import { Injectable } from '@nestjs/common';
import type { ListUsersQuery, PaginatedUsers, Role, UserStatus } from '@ribbon/shared';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { paginated, toSkipTake } from '@/common/pagination';
import { toUserProfile } from '@/common/mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

    return paginated(items.map(toUserProfile), total, query);
  }

  async updateRole(id: string, role: Role) {
    const user = await this.prisma.user.update({ where: { id }, data: { role } });
    return toUserProfile(user);
  }

  async updateStatus(id: string, status: UserStatus) {
    const user = await this.prisma.user.update({ where: { id }, data: { status } });
    return toUserProfile(user);
  }
}
