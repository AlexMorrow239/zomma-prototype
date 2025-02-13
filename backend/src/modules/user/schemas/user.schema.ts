import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { BaseSchema } from '@/common/schemas/base.schema';
import { Name } from '@/common/schemas/name.schema';

/**
 * User schema representing authenticated users of the system.
 *
 * Key features:
 * - Email-based authentication
 * - Basic profile information
 * - Account status management
 * - Password reset functionality
 *
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

  // Inherited from BaseSchema:
  // createdAt: Date;
  // updatedAt: Date;
}

export type UserDocument = User & Document;

/**
 * Generated Mongoose schema for the User class.
 * Includes all properties and their validation rules.
 * Automatically adds createdAt and updatedAt fields.
 */
export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for common queries
UserSchema.index({ email: 1 });
UserSchema.index({ 'name.lastName': 1, 'name.firstName': 1 });

// for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.lastName}`;
});
