import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateAnswerDto, CreateQuestionDto, CreateReplyDto } from "./dto/create-lesson-discussion.dto";

@Injectable()
export class LessonDiscussionService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CREATE QUESTION ────────────────────────────────
  async createQuestion(
    lessonId: number,
    userId: number,
    dto: CreateQuestionDto
  ) {
    // Kiểm tra lesson tồn tại
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException("Bài học không tồn tại");

    return this.prisma.lessonQuestion.create({
      data: {
        content: dto.content,
        userId,
        lessonId,
      },
      include: {
        user: true,
        answers: {
          include: {
            user: true,
            replies: { include: { user: true } },
          },
        },
      },
    });
  }

  // ─── GET QUESTIONS BY LESSON ─────────────────────────
  async getQuestions(lessonId: number) {
    return this.prisma.lessonQuestion.findMany({
      where: { lessonId },
      include: {
        user: true,
        answers: {
          include: {
            user: true,
            replies: {
              include: { user: true },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ─── CREATE ANSWER ────────────────────────────────
  async createAnswer(questionId: number, userId: number, dto: CreateAnswerDto) {
    const question = await this.prisma.lessonQuestion.findUnique({
      where: { id: questionId },
    });
    if (!question) throw new NotFoundException("Câu hỏi không tồn tại");

    return this.prisma.lessonAnswer.create({
      data: {
        content: dto.content,
        userId,
        questionId,
      },
      include: { user: true, replies: { include: { user: true } } },
    });
  }

  // ─── CREATE REPLY ────────────────────────────────
  async createReply(answerId: number, userId: number, dto: CreateReplyDto) {
    const parent = await this.prisma.lessonAnswer.findUnique({
      where: { id: answerId },
    });
    if (!parent) throw new NotFoundException("Câu trả lời không tồn tại");

    return this.prisma.lessonAnswer.create({
      data: {
        content: dto.content,
        userId,
        questionId: parent.questionId,
        parentId: answerId,
      },
      include: { user: true },
    });
  }

  // ─── DELETE QUESTION ────────────────────────────────
  async deleteQuestion(id: number) {
    const question = await this.prisma.lessonQuestion.findUnique({
      where: { id },
    });
    if (!question) throw new NotFoundException("Câu hỏi không tồn tại");

    return this.prisma.lessonQuestion.delete({ where: { id } });
  }

  // ─── DELETE ANSWER / REPLY ─────────────────────────
  async deleteAnswer(id: number) {
    const answer = await this.prisma.lessonAnswer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException("Câu trả lời không tồn tại");

    return this.prisma.lessonAnswer.delete({ where: { id } });
  }
  // ─── DELETE MY QUESTION ─────────────────────────────
  async deleteMyQuestion(id: number, userId: number) {
    const question = await this.prisma.lessonQuestion.findUnique({
      where: { id },
    });
    if (!question) throw new NotFoundException("Câu hỏi không tồn tại");
    if (question.userId !== userId) {
      throw new ForbiddenException("Bạn chỉ có thể xóa câu hỏi của chính mình");
    }

    return this.prisma.lessonQuestion.delete({ where: { id } });
  }

  // ─── DELETE MY ANSWER / REPLY ──────────────────────
  async deleteMyAnswer(id: number, userId: number) {
    const answer = await this.prisma.lessonAnswer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException("Câu trả lời không tồn tại");
    if (answer.userId !== userId) {
      throw new ForbiddenException("Bạn chỉ có thể xóa câu trả lời của chính mình");
    }

    return this.prisma.lessonAnswer.delete({ where: { id } });
  }
}
