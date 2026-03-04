import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
    @ApiProperty({ example: 'user@test.com' })
    email: string;

    @ApiProperty({ example: 'password123' })
    password: string;
}
