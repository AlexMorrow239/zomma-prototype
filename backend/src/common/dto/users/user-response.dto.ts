import { ApiProperty } from '@nestjs/swagger';

import { NameDto } from '../base/name.dto';

export class UserResponseDto extends NameDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: '2024-03-19T10:00:00Z',
    description: 'Timestamp when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-19T10:00:00Z',
    description: 'Timestamp when the user was last updated',
  })
  updatedAt: Date;
}
