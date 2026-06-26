import { Body, Controller, Get, Post } from '@nestjs/common';
import { loginSchema, signupSchema } from '@ribbon/shared';
import type { LoginInput, SignupInput } from '@ribbon/shared';
import { AuthService } from './auth.service';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser, type AuthUser } from '@/common/decorators/auth.decorators';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body(new ZodValidationPipe(signupSchema)) dto: SignupInput) {
    return this.auth.signup(dto);
  }

  @Public()
  @Post('login')
  login(@Body(new ZodValidationPipe(loginSchema)) dto: LoginInput) {
    return this.auth.login(dto);
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.auth.me(user.id);
  }
}
