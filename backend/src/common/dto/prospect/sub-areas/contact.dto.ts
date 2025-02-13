import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

import { NameDto } from '../../base/name.dto';

export class ContactDto {
  @ValidateNested()
  name: NameDto;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid number with optional + prefix',
  })
  phone: string;

  @IsEnum(['email', 'phone', 'text'], {
    message: 'Preferred contact must be either email, phone, or text',
  })
  preferredContact: 'email' | 'phone' | 'text';

  @IsOptional()
  @IsString()
  @Length(2, 100)
  businessName?: string;
}
