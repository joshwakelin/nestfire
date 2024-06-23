import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: '*',  // Allow all origins, or specify a domain like 'http://example.com'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization',  // Allowed headers
  };

  app.enableCors(corsOptions);  // Enable CORS with the specified options

  await app.listen(3000);
}
bootstrap();
