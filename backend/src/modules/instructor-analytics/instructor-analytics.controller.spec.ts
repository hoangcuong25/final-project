import { Test, TestingModule } from '@nestjs/testing';
import { InstructorAnalyticsController } from './instructor-analytics.controller';
import { InstructorAnalyticsService } from './instructor-analytics.service';

describe('InstructorAnalyticsController', () => {
  let controller: InstructorAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstructorAnalyticsController],
      providers: [InstructorAnalyticsService],
    }).compile();

    controller = module.get<InstructorAnalyticsController>(InstructorAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
