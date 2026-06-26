import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role, submitAttemptSchema, upsertQuizSchema } from '@ribbon/shared';
import type { SubmitAttemptInput, UpsertQuizInput } from '@ribbon/shared';
import { QuizzesService } from './quizzes.service';
import { Roles, CurrentUser, type AuthUser } from '@/common/decorators/auth.decorators';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';

@Controller('lessons/:lessonId/quiz')
export class QuizzesController {
  constructor(private readonly quizzes: QuizzesService) {}

  /* ----------------------------- Teacher -------------------------------- */

  @Get()
  @Roles(Role.TEACHER)
  getForAuthor(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string) {
    return this.quizzes.getForAuthor(user.id, lessonId);
  }

  @Put()
  @Roles(Role.TEACHER)
  upsert(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Body(new ZodValidationPipe(upsertQuizSchema)) dto: UpsertQuizInput,
  ) {
    return this.quizzes.upsertForLesson(user.id, lessonId, dto);
  }

  @Delete()
  @Roles(Role.TEACHER)
  remove(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string) {
    return this.quizzes.remove(user.id, lessonId);
  }

  @Get('results')
  @Roles(Role.TEACHER)
  results(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string) {
    return this.quizzes.results(user.id, lessonId);
  }

  /* ----------------------------- Student -------------------------------- */

  @Get('take')
  @Roles(Role.STUDENT)
  take(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string) {
    return this.quizzes.getToTake(user.id, lessonId);
  }

  @Get('my-result')
  @Roles(Role.STUDENT)
  myResult(@CurrentUser() user: AuthUser, @Param('lessonId') lessonId: string) {
    return this.quizzes.myBestResult(user.id, lessonId);
  }

  @Post('attempts')
  @Roles(Role.STUDENT)
  submit(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Body(new ZodValidationPipe(submitAttemptSchema)) dto: SubmitAttemptInput,
  ) {
    return this.quizzes.submit(user.id, lessonId, dto);
  }
}
