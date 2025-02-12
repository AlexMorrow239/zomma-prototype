import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Contact {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, enum: ['email', 'phone', 'text'] })
  preferredContact: string;

  @Prop()
  businessName?: string;
}
