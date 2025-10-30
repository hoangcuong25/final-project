import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import * as fs from "fs";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CloudinaryService } from "src/core/cloudinary/cloudinary.service";

@Injectable()
export class LessonService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  // 🧩 Tạo bài học mới
  async create(
    dto: CreateLessonDto,
    instructorId?: number,
    video?: Express.Multer.File
  ) {
    // 🧩 Kiểm tra chapter tồn tại và thuộc khóa học của giảng viên
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: dto.chapterId },
      include: { course: true },
    });

    if (!chapter || chapter.course.instructorId !== instructorId) {
      throw new NotFoundException(
        "Không tìm thấy chương hoặc không có quyền truy cập"
      );
    }

    // 🧩 Kiểm tra trùng orderIndex trong cùng 1 chapter
    if (dto.orderIndex !== undefined && dto.orderIndex !== null) {
      const existingLesson = await this.prisma.lesson.findFirst({
        where: {
          chapterId: dto.chapterId,
          orderIndex: dto.orderIndex,
        },
      });

      if (existingLesson) {
        throw new BadRequestException(
          `Thứ tự ${dto.orderIndex} đã tồn tại trong chương này`
        );
      }
    }

    // 🧩 Kiểm tra có video không
    if (!video) throw new NotFoundException("Cần phải có file video");

    // 🧩 Upload video lên Cloudinary
    let videoUrl: string | null = null;

    const uploaded = await this.cloudinaryService.uploadFile(
      video,
      "lessons",
      "video"
    );
    videoUrl = uploaded.secure_url;

    // 🧩 Tạo bài học
    return this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        videoUrl,
        orderIndex: dto.orderIndex ?? 0,
        chapterId: dto.chapterId,
      },
    });
  }

  // 🧩 Lấy tất cả bài học
  async findAll() {
    return this.prisma.lesson.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // 🧩 Lấy bài học theo ID
  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException("Không tìm thấy bài học");
    return lesson;
  }

  // 🧩 Lấy danh sách bài học theo khóa học của giảng viên
  async getLessonsByCourse(courseId: number, instructorId: number) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, instructorId },
    });

    if (!course)
      throw new ForbiddenException(
        "Bạn không có quyền truy cập vào khóa học này"
      );

    const lessons = await this.prisma.lesson.findMany({
      where: { chapter: { courseId } },
      orderBy: { orderIndex: "asc" },
      include: {
        quizzes: {
          include: {
            _count: { select: { questions: true } },
          },
        },
        chapter: true,
      },
    });

    return {
      message: "Lấy danh sách bài học thành công",
      data: lessons,
    };
  }

  // 🧩 Cập nhật bài học
  async update(
    id: number,
    dto: UpdateLessonDto,
    instructorId: number,
    video?: Express.Multer.File
  ) {
    const existing = await this.prisma.lesson.findUnique({
      where: { id },
      include: { chapter: { include: { course: true } } },
    });

    if (!existing) throw new NotFoundException("Không tìm thấy bài học");
    if (existing.chapter.course.instructorId !== instructorId)
      throw new ForbiddenException("Bạn không có quyền cập nhật bài học này");

    // 🧩 Kiểm tra trùng orderIndex trong cùng chapter
    if (
      dto.orderIndex !== undefined &&
      dto.orderIndex !== existing.orderIndex
    ) {
      const duplicate = await this.prisma.lesson.findFirst({
        where: {
          chapterId: existing.chapterId,
          orderIndex: dto.orderIndex,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new ConflictException(
          `Thứ tự ${dto.orderIndex} đã tồn tại trong chương này`
        );
      }
    }

    // 🧩 Upload video mới (nếu có)
    let videoUrl = existing.videoUrl;
    if (video) {
      // Nếu muốn xóa video cũ, có thể thực hiện ở đây
      // if (existing.videoUrl) await this.cloudinaryService.deleteFile(existing.videoUrl);

      const uploaded = await this.cloudinaryService.uploadFile(
        video,
        "lessons",
        "video"
      );
      videoUrl = uploaded.secure_url;
    }

    // 🧩 Cập nhật bài học
    const updated = await this.prisma.lesson.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        content: dto.content ?? existing.content,
        orderIndex: dto.orderIndex ?? existing.orderIndex,
        videoUrl,
      },
    });

    return {
      message: "Cập nhật bài học thành công",
      data: updated,
    };
  }

  // 🧩 Xóa bài học
  async remove(id: number) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Không tìm thấy bài học");

    return this.prisma.lesson.delete({ where: { id } });
  }
}
