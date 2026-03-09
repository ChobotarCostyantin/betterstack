import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'user@test.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;
}

export class LoginDto {
    @ApiProperty({ example: 'user@test.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    password: string;
}
