import { Module } from "@nestjs/common";
import { InstructorApplicationModule } from "./application/instructor-application.module";
import { InstructorAnalyticsModule } from "./analytics/instructor-analytics.module";

@Module({
  imports: [InstructorApplicationModule, InstructorAnalyticsModule],
  exports: [InstructorApplicationModule, InstructorAnalyticsModule],
})
export class InstructorModule {}
