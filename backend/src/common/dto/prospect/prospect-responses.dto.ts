import { ApiProperty } from '@nestjs/swagger';

import { CreateProspectDto } from './prospect-requests.dto';

export class ProspectResponseDto extends CreateProspectDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The unique identifier of the prospect',
  })
  id: string;

  @ApiProperty({
    enum: ['pending', 'contacted', 'qualified', 'converted', 'rejected'],
    example: 'pending',
    description: 'Current status of the prospect',
  })
  status: 'pending' | 'contacted';

  @ApiProperty({
    example: '2024-03-20T15:30:00.000Z',
    description: 'Timestamp when the prospect was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-20T15:30:00.000Z',
    description: 'Timestamp when the prospect was last updated',
  })
  updatedAt: Date;
}
