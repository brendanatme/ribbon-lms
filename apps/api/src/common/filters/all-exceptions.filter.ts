import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

/** Maps known Prisma error codes to HTTP responses. */
function mapPrismaError(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case 'P2025': // operation failed because the record was not found
      return { status: HttpStatus.NOT_FOUND, message: 'Resource not found', code: 'NOT_FOUND' };
    case 'P2002': // unique constraint violation
      return {
        status: HttpStatus.CONFLICT,
        message: 'Resource already exists',
        code: 'CONFLICT',
      };
    default:
      return null;
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let issues: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;
        message = (r.message as string) ?? message;
        code = (r.code as string) ?? code;
        issues = r.issues;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = mapPrismaError(exception);
      if (mapped) {
        ({ status, message, code } = mapped);
      } else {
        this.logger.error(exception);
      }
    } else {
      this.logger.error(exception);
    }

    response.status(status).json({ statusCode: status, message, code, issues });
  }
}
