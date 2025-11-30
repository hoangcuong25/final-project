import { Injectable } from '@nestjs/common';
import { CreateInstructorAnalyticDto } from './dto/create-instructor-analytic.dto';
import { UpdateInstructorAnalyticDto } from './dto/update-instructor-analytic.dto';

@Injectable()
export class InstructorAnalyticsService {
  create(createInstructorAnalyticDto: CreateInstructorAnalyticDto) {
    return 'This action adds a new instructorAnalytic';
  }

  findAll() {
    return `This action returns all instructorAnalytics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} instructorAnalytic`;
  }

  update(id: number, updateInstructorAnalyticDto: UpdateInstructorAnalyticDto) {
    return `This action updates a #${id} instructorAnalytic`;
  }

  remove(id: number) {
    return `This action removes a #${id} instructorAnalytic`;
  }
}
