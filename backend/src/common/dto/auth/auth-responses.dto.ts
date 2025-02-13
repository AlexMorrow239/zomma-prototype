import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

// Separate user info DTO for better reusability
export class UserInfoDto {
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

// Response DTO for authentication operations
export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    type: UserInfoDto,
    description: 'User information',
  })
  @ValidateNested()
  @Type(() => UserInfoDto)
  user: UserInfoDto;
}
