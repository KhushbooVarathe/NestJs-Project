import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, ConflictException, BadRequestException,ValidationPipe } from '@nestjs/common';
import { validate } from 'class-validator';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { HttpExceptionFilter } from './errors/custom.error';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  // @UseFilters(new HttpExceptionFilter())
  async create(@Body(ValidationPipe) createAuthDto: CreateAuthDto) {
    try {

      // if (!createAuthDto.firstName) {
      //   throw new BadRequestException('First name is required');
      // }

      // if (!createAuthDto.lastName) {
      //   throw new BadRequestException('Last name is required');
      // }

      // if (!createAuthDto.email) {
      //   throw new BadRequestException('Email is required');
      // }

      // if (!createAuthDto.number) {
      //   throw new BadRequestException('Number is required');
      // }

      // if (!createAuthDto.password) {
      //   throw new BadRequestException('Password is required');
      // }
      // console.log('createAuthDto: ', createAuthDto);
      await this.authService.create(createAuthDto);
      return { message: 'User registered successfully' };
    } catch (error) {
      // if (error instanceof ConflictException && error.message === 'Email already exists') {
      //   throw new ConflictException('Email already exists');
      // }
      throw error;
    }
  }

  
}
