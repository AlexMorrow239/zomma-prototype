import { IsEnum } from 'class-validator';

export enum BudgetRange {
  BELOW_5K = 'below5k',
  FIVE_TO_TEN = '5k-10k',
  TEN_TO_TWENTYFIVE = '10k-25k',
  TWENTYFIVE_TO_FIFTY = '25k-50k',
  ABOVE_50K = 'above50k',
}

export class BudgetDto {
  @IsEnum(BudgetRange, {
    message:
      'Budget range must be one of: below5k, 5k-10k, 10k-25k, 25k-50k, above50k',
  })
  budgetRange: BudgetRange;
}
