import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

import { NameDto } from '../base/name.dto';

export class UpdateUserDto extends NameDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;
}
