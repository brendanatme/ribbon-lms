import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { validateEnv } from './common/env';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    QuizzesModule,
    AnalyticsModule,
  ],
  providers: [
    // Global JWT auth; individual routes opt out via @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Global role check; runs after auth and no-ops unless a route sets @Roles().
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
