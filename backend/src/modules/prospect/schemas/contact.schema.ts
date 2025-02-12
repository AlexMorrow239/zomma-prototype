import { Prop, Schema } from '@nestjs/mongoose';

import { Name } from '@/common/schemas/name.schema';

type PreferredContactType = 'email' | 'phone' | 'text';

@Schema({ _id: false })
export class Contact {
  @Prop({
    required: true,
    type: Name,
  })
  name: Name;

  @Prop({
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email: string;

  @Prop({
    required: true,
    match: /^\+?[1-9]\d{1,14}$/,
  })
  phone: string;

  @Prop({
    required: true,
    enum: ['email', 'phone', 'text'],
    type: String,
  })
  preferredContact: PreferredContactType;

  @Prop({
    minlength: 2,
    maxlength: 100,
  })
  businessName?: string;
}
