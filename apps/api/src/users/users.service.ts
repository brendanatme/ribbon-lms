import { Injectable } from '@nestjs/common';
import type { ListUsersQuery, PaginatedUsers, Role, UserStatus } from '@ribbon/shared';
import type { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { paginated, toSkipTake } from '../common/pagination.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private toProfile(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async list(query: ListUsersQuery): Promise<PaginatedUsers> {
    const where: Prisma.UserWhereInput = {
      ...(query.role ? { role: query.role } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...toSkipTake(query),
      }),
      this.prisma.user.count({ where }),
    ]);

    return paginated(items.map((u) => this.toProfile(u)), total, query);
  }

  async updateRole(id: string, role: Role) {
    const user = await this.prisma.user.update({ where: { id }, data: { role } });
    return this.toProfile(user);
  }

  async updateStatus(id: string, status: UserStatus) {
    const user = await this.prisma.user.update({ where: { id }, data: { status } });
    return this.toProfile(user);
  }
}
