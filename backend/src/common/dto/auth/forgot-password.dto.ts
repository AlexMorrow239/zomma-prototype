import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
