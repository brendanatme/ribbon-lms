import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Role, createEnrollmentSchema } from '@ribbon/shared';
import type { CreateEnrollmentInput } from '@ribbon/shared';
import { EnrollmentsService } from './enrollments.service';
import { Roles, CurrentUser, type AuthUser } from '@/common/decorators/auth.decorators';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';

@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollments: EnrollmentsService) {}

  // Catalog is visible to any authenticated user; enrolling requires STUDENT.
  @Get('catalog')
  catalog() {
    return this.enrollments.catalog();
  }

  @Get('catalog/:id')
  catalogDetail(@Param('id') id: string) {
    return this.enrollments.catalogDetail(id);
  }

  @Post('enrollments')
  @Roles(Role.STUDENT)
  enroll(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createEnrollmentSchema)) dto: CreateEnrollmentInput,
  ) {
    return this.enrollments.enroll(user.id, dto.courseId);
  }

  @Get('enrollments')
  @Roles(Role.STUDENT)
  myProgress(@CurrentUser() user: AuthUser) {
    return this.enrollments.myProgress(user.id);
  }

  @Post('lessons/:id/complete')
  @Roles(Role.STUDENT)
  complete(@CurrentUser() user: AuthUser, @Param('id') lessonId: string) {
    return this.enrollments.completeLesson(user.id, lessonId);
  }

  @Get('enrollments/:courseId/result')
  @Roles(Role.STUDENT)
  courseResult(@CurrentUser() user: AuthUser, @Param('courseId') courseId: string) {
    return this.enrollments.courseResult(user.id, courseId);
  }
}
