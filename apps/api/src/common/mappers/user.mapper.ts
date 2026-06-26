import type { UserProfile } from '@ribbon/shared';
import type { User } from '@prisma/client';

/** Maps a Prisma User row to the public UserProfile DTO. */
export function toUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  };
}
