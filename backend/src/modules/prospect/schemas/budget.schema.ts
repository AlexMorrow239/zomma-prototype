import { Prop, Schema } from '@nestjs/mongoose';

import { BudgetRange } from '@/common/enums';

@Schema({ _id: false })
export class Budget {
  @Prop({
    required: true,
    enum: Object.values(BudgetRange),
    type: String,
  })
  budgetRange: BudgetRange;
}
