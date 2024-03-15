import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Transport from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000; // Assuming 'PORT' is the key in your .env file

  //IT ENABLE THE CORS IN YOUR BACKEND APPLICAION
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST','PATCH','PUT','DELETE','ALL'], // Allow specified HTTP methods
    // allowedHeaders: ['Content-Type', 'Authorization'], // Allow specified headers
  });

  await app.listen(port,()=>{
    console.log(`SERVER LISTENING PORT ${port}`);
  });
}
bootstrap();
