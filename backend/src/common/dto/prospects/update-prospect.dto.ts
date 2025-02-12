import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

import { ProspectStatus } from '@/common/enums';

import { CreateProspectDto } from './create-prospect.dto';

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
