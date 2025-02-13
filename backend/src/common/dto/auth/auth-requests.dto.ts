import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { NameDto } from '../base/name.dto';

export class RegisterUserRequestDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @ApiProperty({
    example: 'adminPass123',
    description: 'Admin password required for registration',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  adminPassword: string;

  @ApiProperty({
    type: NameDto,
    description: 'User name information',
  })
  @ValidateNested({ message: 'Invalid name format' })
  @Type(() => NameDto)
  @IsNotEmpty({ message: 'Name information is required' })
  name: NameDto;
}

export class LoginUserRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    format: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Account password',
    required: true,
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class ForgotPasswordRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address for password reset',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordRequestDto {
  @ApiProperty({
    description: 'Password reset token received via email',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePass123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  newPassword: string;
}
