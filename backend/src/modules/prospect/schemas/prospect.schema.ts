import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { Budget } from './budget.schema';
import { Contact } from './contact.schema';
import { Goals } from './goals.schema';
import { Services } from './services.schema';

@Schema({
  timestamps: true,
  collection: 'prospects',
})
export class Prospect {
  @Prop({ required: true, type: Contact })
  contact: Contact;

  @Prop({ required: true, type: Goals })
  goals: Goals;

  @Prop({ required: true, type: Services })
  services: Services;

  @Prop({ required: true, type: Budget })
  budget: Budget;

  @Prop({
    default: 'pending',
    enum: ['pending', 'contacted'],
  })
  status: string;

  @Prop()
  notes?: string;
}

export type ProspectDocument = Prospect & Document;
export const ProspectSchema = SchemaFactory.createForClass(Prospect);
