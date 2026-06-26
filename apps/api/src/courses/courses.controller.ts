import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  Role,
  createCourseSchema,
  createLessonSchema,
  createModuleSchema,
  updateCourseSchema,
  updateLessonSchema,
  updateModuleSchema,
} from '@ribbon/shared';
import type {
  CreateCourseInput,
  CreateLessonInput,
  CreateModuleInput,
  UpdateCourseInput,
  UpdateLessonInput,
  UpdateModuleInput,
} from '@ribbon/shared';
import { CoursesService } from './courses.service';
import { Roles, CurrentUser, type AuthUser } from '@/common/decorators/auth.decorators';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';

@Controller()
@Roles(Role.TEACHER)
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  @Get('teacher/courses')
  list(@CurrentUser() user: AuthUser) {
    return this.courses.listForTeacher(user.id);
  }

  @Get('courses/:id')
  detail(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.courses.detailForTeacher(user.id, id);
  }

  @Post('courses')
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createCourseSchema)) dto: CreateCourseInput,
  ) {
    return this.courses.create(user.id, dto);
  }

  @Patch('courses/:id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCourseSchema)) dto: UpdateCourseInput,
  ) {
    return this.courses.update(user.id, id, dto);
  }

  @Delete('courses/:id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.courses.remove(user.id, id);
  }

  @Patch('courses/:id/publish')
  publish(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.courses.setPublished(user.id, id, true);
  }

  @Patch('courses/:id/unpublish')
  unpublish(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.courses.setPublished(user.id, id, false);
  }

  @Post('courses/:id/modules')
  addModule(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createModuleSchema)) dto: CreateModuleInput,
  ) {
    return this.courses.addModule(user.id, id, dto);
  }

  @Patch('modules/:moduleId')
  updateModule(
    @CurrentUser() user: AuthUser,
    @Param('moduleId') moduleId: string,
    @Body(new ZodValidationPipe(updateModuleSchema)) dto: UpdateModuleInput,
  ) {
    return this.courses.updateModule(user.id, moduleId, dto);
  }

  @Delete('modules/:moduleId')
  removeModule(@CurrentUser() user: AuthUser, @Param('moduleId') moduleId: string) {
    return this.courses.removeModule(user.id, moduleId);
  }

  @Post('modules/:moduleId/lessons')
  addLesson(
    @CurrentUser() user: AuthUser,
    @Param('moduleId') moduleId: string,
    @Body(new ZodValidationPipe(createLessonSchema)) dto: CreateLessonInput,
  ) {
    return this.courses.addLesson(user.id, moduleId, dto);
  }

  @Patch('lessons/:lessonId')
  updateLesson(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Body(new ZodValidationPipe(updateLessonSchema)) dto: UpdateLessonInput,
  ) {
    return this.courses.updateLesson(user.id, lessonId, dto);
  }

  @Delete('lessons/:lessonId')
  removeLesson(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string) {
    return this.courses.removeLesson(user.id, lessonId);
  }
}
