import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { InstructorService } from "./instructor.service";
import { ResponseMessage, Roles } from "src/decorator/customize";
import { ApplyInstructorDto } from "./dto/apply-instructor.dto";
import { ApiOperation } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

@Controller("instructor")
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post("instructor-application/:id")
  @ResponseMessage("apply instructor")
  applyInstructor(
    @Param("id") userId: number,
    @Body() body: ApplyInstructorDto
  ) {
    return this.instructorService.applyInstructor(userId, body);
  }

  @Patch("approve-instructor/:id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Approve instructor" })
  @ResponseMessage("approve instructor")
  approveInstructor(
    @Param("id") userId: number,
    @Body() body: { role: UserRole }
  ) {
    return this.instructorService.approveInstructor(userId, body.role);
  }

  @Get("instructor-applications")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get all instructor applications" })
  @ResponseMessage("get all instructor applications")
  getAllInstructorApplications() {
    return this.instructorService.getAllInstructorApplications();
  }

  @Get("instructor-application/:id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get instructor application by user ID" })
  @ResponseMessage("get instructor application by user ID")
  getInstructorApplicationByUserId(@Param("id") userId: number) {
    return this.instructorService.getInstructorApplicationByUserId(userId);
  }
}
