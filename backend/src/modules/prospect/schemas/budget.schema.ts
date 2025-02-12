import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Budget {
  @Prop({
    required: true,
    enum: ['below5k', '5k-10k', '10k-25k', '25k-50k', 'above50k'],
  })
  budgetRange: string;
}
