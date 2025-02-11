import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class UserLoginInfoDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Unique identifier for the user',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    format: 'email',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'John',
    description: "User's first name",
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: "User's last name",
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token for authorization',
    format: 'jwt',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    type: UserLoginInfoDto,
    description:
      'Basic user information returned upon successful authentication',
  })
  @ValidateNested()
  @Type(() => UserLoginInfoDto)
  user: UserLoginInfoDto;
}
