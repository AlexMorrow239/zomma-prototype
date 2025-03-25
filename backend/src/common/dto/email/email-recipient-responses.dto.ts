import { randomUUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';

import { CreateEmailRecipientDto } from './email-recipient-requests.dto';

export class EmailRecipientResponseDto extends CreateEmailRecipientDto {
  @ApiProperty({
    example: randomUUID(),
    description: 'The unique identifier of the email recipient',
  })
  id: string;

  @ApiProperty({
    example: true,
    description: 'Whether the recipient is active',
  })
  active: boolean;

  @ApiProperty({
    example: '2024-03-20T15:30:00.000Z',
    description: 'Timestamp when the email recipient was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-20T15:30:00.000Z',
    description: 'Timestamp when the email recipient was last updated',
  })
  updatedAt: Date;
}
