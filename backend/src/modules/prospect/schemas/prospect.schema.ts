import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { ProspectStatus } from '@/common/enums';
import { BaseSchema } from '@/common/schemas/base.schema';

import { Budget } from './budget.schema';
import { Contact } from './contact.schema';
import { Goals } from './goals.schema';
import { Services } from './services.schema';

@Schema({
  timestamps: true,
  collection: 'prospects',
})
export class Prospect extends BaseSchema {
  @Prop({
    required: true,
    type: Contact,
    validate: {
      validator: (v: Contact) => v !== null && Object.keys(v).length > 0,
      message: 'Contact information is required',
    },
  })
  contact: Contact;

  @Prop({
    required: true,
    type: Goals,
    validate: {
      validator: (v: Goals) => v !== null && Object.keys(v).length > 0,
      message: 'Goals information is required',
    },
  })
  goals: Goals;

  @Prop({
    required: true,
    type: Services,
    validate: {
      validator: (v: Services) => v !== null && v.selectedServices.length > 0,
      message: 'At least one service must be selected',
    },
  })
  services: Services;

  @Prop({
    required: true,
    type: Budget,
    validate: {
      validator: (v: Budget) => v !== null && Object.keys(v).length > 0,
      message: 'Budget information is required',
    },
  })
  budget: Budget;

  @Prop({
    default: ProspectStatus.PENDING,
    enum: [ProspectStatus.PENDING, ProspectStatus.CONTACTED],
    type: String,
  })
  status: ProspectStatus;

  @Prop({
    maxlength: 1000,
    trim: true,
  })
  notes?: string;

  // Inherited from BaseSchema:
  // createdAt: Date;
  // updatedAt: Date;
}

export type ProspectDocument = Prospect & Document;
export const ProspectSchema = SchemaFactory.createForClass(Prospect);
