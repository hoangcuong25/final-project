import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "src/core/prisma/prisma.service";
import * as dayjs from "dayjs";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyStats() {
    this.logger.log("Running daily stats cron job...");
    // Run for yesterday
    const yesterday = dayjs().subtract(1, "day").toDate();
    await this.updateCourseDailyStats(yesterday);
    this.logger.log("Daily stats cron job completed.");
  }

  async updateCourseDailyStats(date: Date = new Date()) {
    const startOfDay = dayjs(date).startOf("day").toDate();
    const endOfDay = dayjs(date).endOf("day").toDate();

    this.logger.log(
      `Updating course daily stats for ${startOfDay.toISOString()}`
    );

    // 1. Get all courses
    const courses = await this.prisma.course.findMany({
      select: { id: true },
    });

    for (const course of courses) {
      // 2. Aggregate Views
      const views = await this.prisma.courseView.count({
        where: {
          courseId: course.id,
          viewedAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      // 3. Aggregate Enrollments
      const enrollments = await this.prisma.enrollment.count({
        where: {
          courseId: course.id,
          enrolledAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      // 4. Aggregate Revenue (from InstructorEarning)
      const earnings = await this.prisma.instructorEarning.aggregate({
        where: {
          courseId: course.id,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        _sum: {
          amount: true,
        },
      });
      const revenue = earnings._sum.amount || 0;

      // 5. Upsert CourseDailyStats
      const existingStat = await this.prisma.courseDailyStats.findFirst({
        where: {
          courseId: course.id,
          date: startOfDay,
        },
      });

      if (existingStat) {
        await this.prisma.courseDailyStats.update({
          where: { id: existingStat.id },
          data: {
            views,
            enrollments,
            revenue,
          },
        });
      } else {
        await this.prisma.courseDailyStats.create({
          data: {
            courseId: course.id,
            date: startOfDay,
            views,
            enrollments,
            revenue,
          },
        });
      }
    }
  }
}
