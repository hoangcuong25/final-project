import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  // ─── ENROLL COURSE ──────────────────────────────
  async enrollCourse(courseId: number, userId: number, couponCode?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true },
    });

    if (!course || !course.isPublished) {
      throw new NotFoundException("Course not found or not published");
    }

    if (course.instructorId === userId) {
      throw new BadRequestException("Instructor cannot enroll in own course");
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      throw new BadRequestException("You are already enrolled in this course");
    }

    let coupon = null;
    let finalPrice = course.price;

    // Nếu có coupon
    if (couponCode) {
      coupon = await this.prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon || !coupon.isActive) {
        throw new BadRequestException("Invalid or inactive coupon");
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new BadRequestException("Coupon has expired");
      }

      // Kiểm tra target
      if (coupon.target === "COURSE" && coupon.courseId !== courseId) {
        throw new BadRequestException("Coupon not applicable to this course");
      }

      if (coupon.target === "SPECIALIZATION") {
        const courseSpec = await this.prisma.courseSpecialization.findMany({
          where: { courseId },
        });
        const specializationIds = courseSpec.map((s) => s.specializationId);
        if (!specializationIds.includes(coupon.specializationId)) {
          throw new BadRequestException(
            "Coupon not valid for this specialization"
          );
        }
      }

      // Tính giá giảm
      finalPrice = finalPrice * (1 - coupon.percentage / 100);
    }

    // Nếu khóa học free => enroll trực tiếp
    if (course.type === "FREE" || finalPrice <= 0) {
      return this.prisma.enrollment.create({
        data: {
          userId,
          courseId,
          couponId: coupon?.id,
          progress: 0,
        },
      });
    }

    // Nếu là khóa học trả phí => kiểm tra ví
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.walletBalance < finalPrice) {
      throw new BadRequestException("Insufficient wallet balance");
    }

    // Trừ tiền, lưu transaction + enrollment
    return await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: finalPrice } },
      });

      await tx.transaction.create({
        data: {
          userId,
          amount: -finalPrice,
          type: "COURSE_PURCHASE",
          note: `Enroll course #${courseId}`,
        },
      });

      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
        await tx.couponUsage.create({
          data: { userId, couponId: coupon.id },
        });
      }

      return await tx.enrollment.create({
        data: {
          userId,
          courseId,
          couponId: coupon?.id,
          progress: 0,
        },
      });
    });
  }

  // ─── GET MY ENROLLMENTS ──────────────────────────────
  async getMyEnrollments(userId: number) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, fullname: true, avatar: true },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });
  }

  // ─── GET ENROLLMENT DETAIL ──────────────────────────────
  async getEnrollmentDetail(id: number, userId: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: { include: { instructor: true } },
        coupon: true,
      },
    });

    if (!enrollment) throw new NotFoundException("Enrollment not found");
    if (enrollment.userId !== userId) throw new ForbiddenException();

    return enrollment;
  }

  // ─── INSTRUCTOR: GET STUDENTS ──────────────────────────────
  async getStudentsInCourse(courseId: number, instructorId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.instructorId !== instructorId) {
      throw new ForbiddenException("Not your course");
    }

    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: { id: true, fullname: true, email: true, avatar: true },
        },
      },
    });
  }

  // ─── CANCEL ENROLLMENT ──────────────────────────────
  async cancelEnrollment(id: number, userId: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment || enrollment.userId !== userId)
      throw new ForbiddenException("Cannot cancel this enrollment");

    // chỉ cho phép cancel nếu khóa học free hoặc chưa học
    return this.prisma.enrollment.delete({ where: { id } });
  }
}
