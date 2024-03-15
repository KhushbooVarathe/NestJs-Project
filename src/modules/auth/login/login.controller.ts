import { BadRequestException, Body, Controller, Get, UnauthorizedException,ValidationPipe } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginAuthDto } from '../dto/login-auth.dto';
@Controller('login')
export class LoginController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    async Login(@Body(ValidationPipe) loginAuthDto: LoginAuthDto) {
        try {
            // if (!loginAuthDto.email) {
            //     throw new BadRequestException('Email is required');
            // }

            // if (!loginAuthDto.password) {
            //     throw new BadRequestException('password is required');
            // }
            console.log('loginAuthDto: ', loginAuthDto);
            const data: any = await this.authService.login(loginAuthDto);
            //   console.log('data:===controller ', data);
            if (data) {
                return data
            }

        } catch (error) {
            console.log('error:==controller login ', error);
            throw error
        }
    }
}
