import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { PrismaModule } from "src/core/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [CronService],
})
export class CronModule {}
