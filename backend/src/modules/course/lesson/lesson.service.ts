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

  async create(
    dto: CreateLessonDto,
    instructorId?: number,
    video?: Express.Multer.File
  ) {
    // 🧩 Kiểm tra chapter có tồn tại và thuộc về course mà instructor sở hữu
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: dto.chapterId },
      include: { course: true },
    });

    if (!chapter || chapter.course.instructorId !== instructorId) {
      throw new NotFoundException("Chapter not found or access denied");
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
          `Order index ${dto.orderIndex} already exists in this chapter`
        );
      }
    }

    // 🧩 Upload video lên Cloudinary
    if (!video) throw new NotFoundException("Video file is required");

    // 🧩 Upload video lên Cloudinary (nếu có)
    let videoUrl: string | null = null;

    const uploaded = await this.cloudinaryService.uploadFile(
      video,
      "lessons",
      "video" //  phải chỉ định "video"
    );
    videoUrl = uploaded.secure_url;

    // 🧩 Tạo lesson
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

  async findAll() {
    return this.prisma.lesson.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });
    if (!lesson) throw new NotFoundException("Lesson not found");
    return lesson;
  }

  async getLessonsByCourse(courseId: number, instructorId: number) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, instructorId },
    });

    if (!course)
      throw new ForbiddenException("You are not allowed to access this course");

    const lessons = await this.prisma.lesson.findMany({
      where: {
        chapter: {
          courseId,
        },
      },
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
      message: "Lessons fetched successfully",
      data: lessons,
    };
  }

  async update(
    id: number,
    dto: UpdateLessonDto,
    instructorId: number,
    video?: Express.Multer.File
  ) {
    const existing = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!existing) throw new NotFoundException("Lesson not found");
    if (existing.chapter.course.instructorId !== instructorId)
      throw new ForbiddenException("You are not allowed to update this lesson");

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
      // Nếu bạn muốn, có thể xóa video cũ ở đây:
      // if (existing.videoUrl) await this.cloudinaryService.deleteFile(existing.videoUrl);

      const uploaded = await this.cloudinaryService.uploadFile(
        video,
        "lessons",
        "video"
      );
      videoUrl = uploaded.secure_url;
    }

    // 🧩 Cập nhật lesson
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
      message: "Lesson updated successfully",
      data: updated,
    };
  }

  async remove(id: number) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Lesson not found");

    return this.prisma.lesson.delete({ where: { id } });
  }
}
