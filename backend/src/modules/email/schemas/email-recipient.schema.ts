import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { BaseSchema } from '@/common/schemas/base.schema';

@Schema({
  timestamps: true,
  collection: 'email_recipients',
})
export class EmailRecipient extends BaseSchema {
  @Prop({
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Email address is invalid',
    },
  })
  email: string;

  @Prop({
    required: false,
    type: String,
    maxlength: 100,
  })
  name?: string;

  @Prop({
    default: true,
    type: Boolean,
  })
  active: boolean;

  // Inherited from BaseSchema:
  // createdAt: Date;
  // updatedAt: Date;
}

export type EmailRecipientDocument = EmailRecipient & Document;
export const EmailRecipientSchema =
  SchemaFactory.createForClass(EmailRecipient);
