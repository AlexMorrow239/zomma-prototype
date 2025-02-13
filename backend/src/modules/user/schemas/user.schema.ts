import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { BaseSchema } from '@/common/schemas/base.schema';
import { Name } from '@/common/schemas/name.schema';

/**
 * User schema representing authenticated users of the system.
 */
@Schema({ timestamps: true })
export class User extends BaseSchema {
  /**
   * User's email address.
   * Used as the unique identifier for authentication.
   */
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 255,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email address',
    ],
  })
  email: string;

  /**
   * Hashed password for authentication.
   * Never stored in plain text.
   * Hashing is handled by the service layer.
   */
  @Prop({
    required: true,
    minlength: 6,
    select: false, // Don't include password in default queries
  })
  password: string;

  /**
   * User's full name.
   * Stored in separate firstName and lastName fields
   * for proper sorting and display.
   */
  @Prop({
    required: true,
    type: Name,
  })
  name: Name;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

// for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.lastName}`;
});
