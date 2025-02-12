import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ServicesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  selectedServices: string[];
}
