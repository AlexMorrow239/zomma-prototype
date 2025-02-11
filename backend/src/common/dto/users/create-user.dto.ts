import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { NameDto } from '../base/name.dto';

export class CreateUserDto extends NameDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
