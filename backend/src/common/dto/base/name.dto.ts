import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class NameDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[A-Za-z\s\-']+$/, {
    message:
      'First name can only contain letters, spaces, hyphens, and apostrophes',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[A-Za-z\s\-']+$/, {
    message:
      'Last name can only contain letters, spaces, hyphens, and apostrophes',
  })
  lastName: string;
}
