import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Services {
  @Prop({ required: true, type: [String] })
  selectedServices: string[];
}
