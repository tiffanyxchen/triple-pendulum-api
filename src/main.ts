import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT ?? 3000;   // ✅ define port here
  await app.listen(port);

  console.log(`🚀 Backend listening on http://localhost:${port}`);  // ✅ now port exists
}

bootstrap();
