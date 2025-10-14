import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles, ResponseMessage } from "src/decorator/customize";
import { UpdateLessonDto } from "./dto/update-lesson.dto";

@ApiTags("Lesson")
@Controller("lesson")
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Create a new lesson" })
  @ResponseMessage("Lesson created successfully")
  create(@Body() dto: CreateLessonDto, @Req() req: any) {
    const instructorId = req.user?.id; 
    return this.lessonService.create(dto, instructorId);
  }

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get all lessons" })
  @ResponseMessage("Fetched all lessons")
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(":id")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Get lesson detail by ID" })
  @ResponseMessage("Fetched lesson detail")
  findOne(@Param("id") id: string) {
    return this.lessonService.findOne(+id);
  }

  @Get("course/:courseId")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Get all lessons by course ID" })
  @ResponseMessage("Fetched lessons by course")
  getLessonsByCourse(@Param("courseId") courseId: string) {
    return this.lessonService.getLessonsByCourse(+courseId);
  }

  @Patch(":id")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Update lesson by ID" })
  @ResponseMessage("Lesson updated successfully")
  update(@Param("id") id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonService.update(+id, dto);
  }

  @Delete(":id")
  @Roles("INSTRUCTOR", "ADMIN")
  @ApiOperation({ summary: "Delete lesson by ID" })
  @ResponseMessage("Lesson deleted successfully")
  remove(@Param("id") id: string) {
    return this.lessonService.remove(+id);
  }
}
