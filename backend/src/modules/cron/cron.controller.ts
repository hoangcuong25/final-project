import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CronService } from "./cron.service";
import { UpdateCourseDailyStatsDto } from "./dto/update-course-daily-stats.dto";
import { Public, ResponseMessage, Roles } from "src/core/decorator/customize";

@ApiTags("Cron")
@Controller("cron")
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post("update-course-daily-stats")
  @Public()
  @ApiOperation({
    summary: "Manually trigger course daily stats update",
    description:
      "Updates course daily statistics for a specific date. If no date is provided, uses today's date. This endpoint is for testing and manual triggering.",
  })
  @ResponseMessage("Course daily stats updated successfully")
  async updateCourseDailyStats(@Body() dto: UpdateCourseDailyStatsDto) {
    const date = dto.date ? new Date(dto.date) : new Date();
    await this.cronService.updateCourseDailyStats(date);
    return {
      message: "Course daily stats updated successfully",
      date: date.toISOString(),
    };
  }
}
