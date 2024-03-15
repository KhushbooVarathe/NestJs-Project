import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './schema/auth.schema';
import { HttpExceptionFilter } from './errors/custom.error';
import { APP_FILTER } from '@nestjs/core';
import { LoginController } from './login/login.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
@Module({
  imports: [RedisModule,
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' }, // Example expiration time
      }),
      inject: [ConfigService], // Inject ConfigService here
    }),
   
  ],
  controllers: [AuthController, LoginController],
  providers: [
    AuthService
    // to apply filter
    // {
    //     provide:APP_FILTER,
    //     useClass:HttpExceptionFilter
    // },
  ],
  exports:[AuthService]
})
export class AuthModule { }
