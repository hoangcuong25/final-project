import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { QuestionService } from "./question.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseMessage, Roles } from "src/core/decorator/customize";

@ApiTags("Question")
@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Create new question for a quiz" })
  @ResponseMessage("Create question successfully")
  @ApiBearerAuth()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all questions" })
  @ResponseMessage("Get all questions successfully")
  @ApiBearerAuth()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get question by ID (include options)" })
  @ResponseMessage("Get question by ID successfully")
  @ApiBearerAuth()
  findOne(@Param("id") id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Update question content" })
  @ResponseMessage("Update question successfully")
  @ApiBearerAuth()
  update(
    @Param("id") id: string,
    @Body() updateQuestionDto: UpdateQuestionDto
  ) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(":id")
  @Roles("INSTRUCTOR")
  @ApiOperation({ summary: "Delete question" })
  @ResponseMessage("Delete question successfully")
  @ApiBearerAuth()
  remove(@Param("id") id: string) {
    return this.questionService.remove(+id);
  }
}
