import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  // ─── CREATE ──────────────────────────────
  async create(createQuizDto: CreateQuizDto) {
    const { title, lessonId } = createQuizDto;

    // Kiểm tra lesson có tồn tại không
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException("Lesson not found");

    // Mỗi lesson chỉ có 1 quiz
    const existingQuiz = await this.prisma.quiz.findUnique({
      where: { lessonId },
    });
    if (existingQuiz)
      throw new NotFoundException("This lesson already has a quiz");

    return this.prisma.quiz.create({
      data: {
        title,
        lessonId,
      },
    });
  }

  // ─── GET ALL ──────────────────────────────
  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        lesson: true,
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ─── GET ONE ──────────────────────────────
  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        lesson: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    if (!quiz) throw new NotFoundException("Quiz not found");
    return quiz;
  }

  // ─── UPDATE ──────────────────────────────
  async update(id: number, updateQuizDto: UpdateQuizDto) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException("Quiz not found");

    return this.prisma.quiz.update({
      where: { id },
      data: updateQuizDto,
    });
  }

  // ─── DELETE ──────────────────────────────
  async remove(id: number) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException("Quiz not found");

    return this.prisma.quiz.delete({ where: { id } });
  }
}
