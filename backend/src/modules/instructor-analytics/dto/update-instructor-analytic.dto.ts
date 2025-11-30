import { PartialType } from '@nestjs/swagger';
import { CreateInstructorAnalyticDto } from './create-instructor-analytic.dto';

export class UpdateInstructorAnalyticDto extends PartialType(CreateInstructorAnalyticDto) {}
