import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma/prisma.service";
import { ApplyInstructorDto } from "./dto/apply-instructor.dto";
import { ApplicationStatus, UserRole } from "@prisma/client";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class InstructorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService
  ) {}

  async applyInstructor(userId: number, body: ApplyInstructorDto) {
    const { specializationIds, experience, bio } = body;

    // 1️. Kiểm tra người dùng có tồn tại không
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại");
    }

    // 2️. Kiểm tra xem user đã có đơn đang chờ duyệt chưa
    const existingPending = await this.prisma.instructorApplication.findFirst({
      where: { userId, status: ApplicationStatus.PENDING },
    });

    if (existingPending) {
      throw new BadRequestException(
        "Bạn đã có một đơn đăng ký đang chờ duyệt. Vui lòng chờ phản hồi."
      );
    }

    // 3️. Kiểm tra danh sách chuyên ngành hợp lệ
    const validSpecs = await this.prisma.specialization.findMany({
      where: { id: { in: specializationIds } },
    });

    if (validSpecs.length !== specializationIds.length) {
      throw new BadRequestException(
        "Một hoặc nhiều chuyên ngành không tồn tại"
      );
    }

    // 4️. Tạo đơn đăng ký và gắn nhiều chuyên ngành
    const application = await this.prisma.instructorApplication.create({
      data: {
        userId,
        experience,
        bio,
        applicationSpecializations: {
          create: specializationIds.map((id) => ({
            specialization: { connect: { id } },
          })),
        },
      },
      include: {
        applicationSpecializations: {
          include: { specialization: true },
        },
      },
    });

    // 5️. Gửi email xác nhận
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Xác nhận gửi đơn ứng tuyển Giảng viên",
      template: "./applicationConfirmation", // không cần đuôi .hbs
      context: {
        user,
        application,
        specializations: application.applicationSpecializations.map(
          (item) => item.specialization.name
        ),
        platformName: "EduConnect",
      },
    });

    return {
      message: "Gửi đơn đăng ký giảng viên thành công",
      data: application,
    };
  }

  async approveInstructor(userId: number, role: UserRole) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("User not found");

    return await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async getAllInstructorApplications() {
    const applications = await this.prisma.instructorApplication.findMany({
      include: {
        user: {
          select: { id: true, email: true },
        },
        applicationSpecializations: {
          include: { specialization: true },
        },
      },
    });
    return applications;
  }

  async getInstructorApplicationByUserId(userId: number) {
    return await this.prisma.instructorApplication.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true },
        },
        applicationSpecializations: {
          include: { specialization: true },
        },
      },
    });
  }
}
