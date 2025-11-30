import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstructorAnalyticsService } from './instructor-analytics.service';
import { CreateInstructorAnalyticDto } from './dto/create-instructor-analytic.dto';
import { UpdateInstructorAnalyticDto } from './dto/update-instructor-analytic.dto';

@Controller('instructor-analytics')
export class InstructorAnalyticsController {
  constructor(private readonly instructorAnalyticsService: InstructorAnalyticsService) {}

  @Post()
  create(@Body() createInstructorAnalyticDto: CreateInstructorAnalyticDto) {
    return this.instructorAnalyticsService.create(createInstructorAnalyticDto);
  }

  @Get()
  findAll() {
    return this.instructorAnalyticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instructorAnalyticsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstructorAnalyticDto: UpdateInstructorAnalyticDto) {
    return this.instructorAnalyticsService.update(+id, updateInstructorAnalyticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instructorAnalyticsService.remove(+id);
  }
}
