import { ApiProperty, PartialType } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { ProspectStatus } from '@/common/enums';

import { BudgetDto } from './sub-areas/budget.dto';
import { ContactDto } from './sub-areas/contact.dto';
import { GoalsDto } from './sub-areas/goals.dto';
import { ServicesDto } from './sub-areas/services.dto';

export class CreateProspectDto {
  @ValidateNested()
  @Type(() => ContactDto)
  contact: ContactDto;

  @ValidateNested()
  @Type(() => GoalsDto)
  goals: GoalsDto;

  @ValidateNested()
  @Type(() => ServicesDto)
  services: ServicesDto;

  @ValidateNested()
  @Type(() => BudgetDto)
  budget: BudgetDto;

  @IsOptional()
  @IsEnum(['pending', 'contacted'], {
    message: 'Status must be either pending or contacted',
  })
  status?: 'pending' | 'contacted' = 'pending';

  @IsOptional()
  @IsString()
  @Length(0, 1000, {
    message: 'Notes must not exceed 1000 characters',
  })
  notes?: string;
}

export class UpdateProspectDto extends PartialType(CreateProspectDto) {
  @ApiProperty({
    enum: ProspectStatus,
    description: 'Current status of the prospect',
    required: false,
    example: ProspectStatus.PENDING,
  })
  @IsEnum(ProspectStatus, {
    message: 'Status must be one of: pending, contacted',
  })
  @IsOptional()
  status?: ProspectStatus;

  @ApiProperty({
    description: 'Additional notes about the prospect',
    required: false,
    example: 'Follow up scheduled for next week',
  })
  @IsString()
  @IsOptional()
  @Length(0, 1000, {
    message: 'Notes must not exceed 1000 characters',
  })
  notes?: string;
}
