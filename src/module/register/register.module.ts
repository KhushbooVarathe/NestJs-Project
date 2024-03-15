import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Register, RegisterSchema } from './schema/register.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Register.name, schema: RegisterSchema }]),
  JwtModule.registerAsync({
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET_KEY'),
      signOptions: { expiresIn: '1h' }, // Example expiration time
    }),
    inject: [ConfigService], // Inject ConfigService here
  }),],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
