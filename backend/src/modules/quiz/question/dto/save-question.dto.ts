import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class SaveQuestionDto {
  @ApiProperty({
    example: 1,
    description: "ID của khóa học chứa câu hỏi này",
  })
  courseId: number;

  @ApiProperty({
    example: 1,
    description: "ID của bài học chứa câu hỏi này",
  })
  lessonId: number;

  @ApiProperty({
    example: "React là thư viện của ngôn ngữ nào?",
    description: "Nội dung câu hỏi",
  })
  questionText: string;

  @ApiProperty({
    example: 1,
    description: "ID của quiz chứa câu hỏi này",
  })
  quizId: number;

  newOptions: {
    optionText: string;
    isCorrect: boolean;
  }[];
}
