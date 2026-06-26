import { Controller, Get, Param } from '@nestjs/common';
import { Role } from '@ribbon/shared';
import { AnalyticsService } from './analytics.service';
import { Roles, CurrentUser, type AuthUser } from '@/common/decorators/auth.decorators';

@Controller('analytics')
@Roles(Role.TEACHER)
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('courses/:id')
  course(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.analytics.courseAnalytics(user.id, id);
  }
}
