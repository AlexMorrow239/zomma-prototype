import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { BudgetDto } from './budget.dto';
import { ContactDto } from './contact.dto';
import { GoalsDto } from './goals.dto';
import { ServicesDto } from './services.dto';

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
