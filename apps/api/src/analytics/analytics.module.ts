import { Controller, Get, Module, Param, UseGuards } from '@nestjs/common';
import { Role } from '@ribbon/shared';
import { AnalyticsService } from './analytics.service';
import { Roles, CurrentUser, type AuthUser } from '@/common/decorators/auth.decorators';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('analytics')
@UseGuards(RolesGuard)
@Roles(Role.TEACHER)
class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('courses/:id')
  course(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.analytics.courseAnalytics(user.id, id);
  }
}

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
