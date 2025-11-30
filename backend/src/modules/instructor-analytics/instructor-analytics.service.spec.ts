import { Test, TestingModule } from '@nestjs/testing';
import { InstructorAnalyticsService } from './instructor-analytics.service';

describe('InstructorAnalyticsService', () => {
  let service: InstructorAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstructorAnalyticsService],
    }).compile();

    service = module.get<InstructorAnalyticsService>(InstructorAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
