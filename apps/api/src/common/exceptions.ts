import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Domain exception helpers. They build the `{ message, code }` response body
 * that AllExceptionsFilter unpacks, keeping the shape in one place so call
 * sites read as `throw notFound('Course not found')`.
 */

export const notFound = (message: string, code = 'NOT_FOUND') =>
  new NotFoundException({ message, code });

export const forbidden = (message: string, code = 'FORBIDDEN') =>
  new ForbiddenException({ message, code });

export const conflict = (message: string, code = 'CONFLICT') =>
  new ConflictException({ message, code });

export const unauthorized = (message: string, code = 'UNAUTHORIZED') =>
  new UnauthorizedException({ message, code });
