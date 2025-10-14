import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLessonDto, instructorId?: number) {
    // kiểm tra course có tồn tại không
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });
    if (!course) throw new NotFoundException("Course not found");

    return this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        videoUrl: dto.videoUrl,
        orderIndex: dto.orderIndex ?? 0,
        courseId: dto.courseId,
      },
    });
  }

  async findAll() {
    return this.prisma.lesson.findMany({
      include: { course: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!lesson) throw new NotFoundException("Lesson not found");
    return lesson;
  }

  async getLessonsByCourse(courseId: number) {
    return this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
    });
  }

  async update(id: number, dto: UpdateLessonDto) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Lesson not found");

    return this.prisma.lesson.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Lesson not found");

    return this.prisma.lesson.delete({ where: { id } });
  }
}
