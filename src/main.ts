import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Ensure upload directories exist
  const uploadDirs = [
    'uploads',
    'uploads/avatars',
    'uploads/knowledge',
    'uploads/books',
  ];
  uploadDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  const port = process.env.API_PORT || 2530;

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Enable CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(port);
  logger.log(`🚀 YTRC-BackEnd running on: http://localhost:${port}/api/v1`);
}

bootstrap();
