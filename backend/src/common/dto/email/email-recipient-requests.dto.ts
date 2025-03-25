import { ApiProperty, PartialType } from '@nestjs/swagger';

import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEmailRecipientDto {
  @ApiProperty({
    description: 'Email address of the recipient',
    required: true,
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email address is invalid' })
  email: string;

  @ApiProperty({
    description: 'Name of the recipient',
    required: false,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @ApiProperty({
    description: 'Whether the recipient is active',
    required: false,
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Additional description or notes about the recipient',
    required: false,
    example: 'Marketing department contact',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description?: string;
}

export class UpdateEmailRecipientDto extends PartialType(
  CreateEmailRecipientDto
) {
  @ApiProperty({
    description: 'Email address of the recipient',
    required: false,
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email address is invalid' })
  email?: string;

  @ApiProperty({
    description: 'Whether the recipient is active',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
