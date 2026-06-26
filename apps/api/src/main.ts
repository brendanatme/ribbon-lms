import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  // credentials:true is required because the web app fetches with
  // `credentials: 'include'`; auth itself rides the Authorization header.
  app.enableCors({
    origin: config.get<string>('WEB_ORIGIN', 'http://localhost:5174'),
    credentials: true,
  });

  const port = config.get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api`);
}

bootstrap();
