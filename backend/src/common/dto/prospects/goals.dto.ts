import { IsString, Length } from 'class-validator';

export class GoalsDto {
  @IsString()
  @Length(10, 1000, {
    message: 'Financial goals must be between 10 and 1000 characters',
  })
  financialGoals: string;

  @IsString()
  @Length(10, 1000, {
    message: 'Challenges must be between 10 and 1000 characters',
  })
  challenges: string;
}
