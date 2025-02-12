import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ContactDto {
  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @Length(2, 50)
  lastName: string;

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
