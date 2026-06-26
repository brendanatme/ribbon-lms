import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import {
  Role,
  listUsersQuerySchema,
  updateRoleSchema,
  updateStatusSchema,
} from '@ribbon/shared';
import type { ListUsersQuery, UpdateRoleInput, UpdateStatusInput } from '@ribbon/shared';
import { UsersService } from './users.service.js';
import { Roles } from '../common/decorators/auth.decorators.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';

@Controller('users')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list(@Query(new ZodValidationPipe(listUsersQuerySchema)) query: ListUsersQuery) {
    return this.users.list(query);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateRoleSchema)) dto: UpdateRoleInput,
  ) {
    return this.users.updateRole(id, dto.role);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema)) dto: UpdateStatusInput,
  ) {
    return this.users.updateStatus(id, dto.status);
  }
}
