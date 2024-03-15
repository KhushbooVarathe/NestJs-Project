import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRegisterDto {
    @IsNotEmpty({ message: 'firstName is required' })
    @IsString()
    firstName: string;

    @IsNotEmpty({ message: 'lastName is required' })
    @IsString()
    lastName: string;

    @IsNotEmpty({ message: 'email is required' })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'number is required' })
    @IsNumber()
    @MaxLength(10)
    number: number;

    @IsNotEmpty({ message: 'password is required' })
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsNumber()
    role?: number;
}
