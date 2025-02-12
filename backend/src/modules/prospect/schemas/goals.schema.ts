import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Goals {
  @Prop({ required: true })
  financialGoals: string;

  @Prop({ required: true })
  challenges: string;
}
