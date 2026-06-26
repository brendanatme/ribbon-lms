import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { AuthResponse, LoginInput, SignupInput, UserProfile } from '@ribbon/shared';
import type { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private toProfile(user: User): UserProfile {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private sign(user: User): string {
    return this.jwt.sign({ sub: user.id, role: user.role });
  }

  async signup(input: SignupInput): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictException({ message: 'Email already registered', code: 'EMAIL_TAKEN' });
    }
    const passwordHash = await argon2.hash(input.password);
    const user = await this.prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash, role: 'STUDENT' },
    });
    return { accessToken: this.sign(user), user: this.toProfile(user) };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || user.status === 'DISABLED') {
      throw new UnauthorizedException({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
    }
    const valid = await argon2.verify(user.passwordHash, input.password);
    if (!valid) {
      throw new UnauthorizedException({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
    }
    return { accessToken: this.sign(user), user: this.toProfile(user) };
  }

  async me(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return this.toProfile(user);
  }
}
