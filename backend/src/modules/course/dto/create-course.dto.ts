import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUrl,
  MinLength,
} from "class-validator";

export class CreateCourseDto {
  @ApiProperty({ example: "React for Beginners", description: "Course title" })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({ example: "Learn the basics of React step by step" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example:
      "https://res.cloudinary.com/demo/image/upload/course_thumbnail.jpg",
    description: "Cloudinary thumbnail URL",
  })
  @IsOptional()
  @IsUrl()
  thumbnail: string;

  @ApiPropertyOptional({ example: 49.99, description: "Course price (USD)" })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: false, description: "Publish status" })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({
    example: 1,
    description: "Instructor ID who owns this course",
  })
  @IsNumber()
  instructorId: number;
}
