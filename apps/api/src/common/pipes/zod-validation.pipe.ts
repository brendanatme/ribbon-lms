import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

/**
 * Validates a handler argument against a Zod schema.
 * Usage: @Body(new ZodValidationPipe(createCourseSchema)) dto: CreateCourseInput
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        issues: result.error.issues,
      });
    }
    return result.data;
  }
}
