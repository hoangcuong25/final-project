import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles, ResponseMessage } from "src/decorator/customize";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Lesson")
@Controller("lesson")
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles("INSTRUCTOR")
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Instructor create a new lesson" })
  @ResponseMessage("Lesson created successfully")
  @UseInterceptors(FileInterceptor("video"))
  create(
    @Body() dto: CreateLessonDto,
    @Req() req: any,
    @UploadedFile() video?: Express.Multer.File
  ) {
    const instructorId = req.user?.id;
    return this.lessonService.create(dto, instructorId, video);
  }

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get all lessons" })
  @ResponseMessage("Fetched all lessons")
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get lesson detail by ID" })
  @ResponseMessage("Fetched lesson detail")
  findOne(@Param("id") id: string) {
    return this.lessonService.findOne(+id);
  }

  @Get("course/:courseId")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Get all lessons by course ID" })
  @ResponseMessage("Fetched lessons by course")
  getLessonsByCourse(@Param("courseId") courseId: string) {
    return this.lessonService.getLessonsByCourse(+courseId);
  }

  @Patch(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Update lesson by ID" })
  @ResponseMessage("Lesson updated successfully")
  update(@Param("id") id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonService.update(+id, dto);
  }

  @Delete(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Delete lesson by ID" })
  @ResponseMessage("Lesson deleted successfully")
  remove(@Param("id") id: string) {
    return this.lessonService.remove(+id);
  }
}
