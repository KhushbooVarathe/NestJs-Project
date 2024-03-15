import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RegisterModule } from './module/register/register.module';
// import { RedisModule } from './modules/redis.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }
    ),
    MongooseModule.forRootAsync(
      {

        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({ uri: configService.get("MONGO_URI") }),
        inject: [ConfigService]
      }
    ),
    AuthModule,
    RegisterModule,

    // RedisModule
    // CorsModule.forRoot({
    //   origin: ['http://localhost:3000'], // Allow requests from this origin
    //   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified HTTP methods
    //   allowedHeaders: ['Content-Type', 'Authorization'], // Allow specified headers
    //   exposedHeaders: ['Content-Length', 'X-Request-ID'], // Expose additional headers
    //   credentials: true, // Enable credentials (e.g., cookies, authorization headers)
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
