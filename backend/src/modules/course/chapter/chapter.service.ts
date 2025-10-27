import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";
import { PrismaService } from "src/core/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ChapterService {
  constructor(private readonly prisma: PrismaService) {}

  // ───────────────────────────────────────────────
  async create(courseId: number, dto: CreateChapterDto, instructorId: number) {
    try {
      // Kiểm tra course có tồn tại và thuộc instructor này không
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });
      if (!course) throw new NotFoundException("Course not found");
      if (course.instructorId !== instructorId)
        throw new ForbiddenException(
          "You are not the instructor of this course"
        );

      const chapter = await this.prisma.chapter.create({
        data: {
          title: dto.title,
          description: dto.description,
          courseId,
          orderIndex: dto.order ?? 0,
          duration: dto.duration ?? 0,
        },
      });

      return {
        message: "Chapter created successfully",
        data: chapter,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ───────────────────────────────────────────────
  async findAll(courseId: number) {
    const chapters = await this.prisma.chapter.findMany({
      where: { courseId },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            duration: true,
          },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    // Tính tổng duration mỗi chapter
    const withDuration = chapters.map((chapter) => {
      const totalDuration = chapter.lessons.reduce(
        (sum, l) => sum + (l.duration ?? 0),
        0
      );
      return { ...chapter, totalDuration };
    });

    return {
      message: "Get all chapters successfully",
      data: withDuration,
    };
  }

  // ───────────────────────────────────────────────
  async findOne(courseId: number, id: number) {
    const chapter = await this.prisma.chapter.findFirst({
      where: { id, courseId },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            duration: true,
          },
        },
      },
    });
    if (!chapter) throw new NotFoundException("Chapter not found");

    const totalDuration = chapter.lessons.reduce(
      (sum, l) => sum + (l.duration ?? 0),
      0
    );

    return {
      message: "Get chapter detail successfully",
      data: { ...chapter, totalDuration },
    };
  }

  // ───────────────────────────────────────────────
  async update(
    courseId: number,
    id: number,
    dto: UpdateChapterDto,
    instructorId: number
  ) {
    const chapter = await this.prisma.chapter.findFirst({
      where: { id, courseId },
      include: { course: true },
    });

    if (!chapter) throw new NotFoundException("Chapter not found");
    if (chapter.course.instructorId !== instructorId)
      throw new ForbiddenException(
        "You are not allowed to update this chapter"
      );

    const updated = await this.prisma.chapter.update({
      where: { id },
      data: {
        title: dto.title ?? chapter.title,
        description: dto.description ?? chapter.description,
        orderIndex: dto.order ?? chapter.orderIndex,
        duration: dto.duration ?? chapter.duration,
      },
    });

    return {
      message: "Chapter updated successfully",
      data: updated,
    };
  }

  // ───────────────────────────────────────────────
  async remove(courseId: number, id: number, instructorId: number) {
    const chapter = await this.prisma.chapter.findFirst({
      where: { id, courseId },
      include: { course: true },
    });

    if (!chapter) throw new NotFoundException("Chapter not found");
    if (chapter.course.instructorId !== instructorId)
      throw new ForbiddenException(
        "You are not allowed to delete this chapter"
      );

    await this.prisma.chapter.delete({ where: { id } });

    return {
      message: "Chapter deleted successfully",
    };
  }
}
