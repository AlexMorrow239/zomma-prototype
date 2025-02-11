import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

/**
 * User schema representing authenticated users of the system.
 *
 * Key features:
 * - Email-based authentication
 * - Basic profile information
 * - Account status management
 * - Password reset functionality
 *
 * Security considerations:
 * - Passwords are hashed before storage
 * - Reset tokens have expiration dates
 */
@Schema({ timestamps: true })
export class User extends Document {
  /**
   * User's email address.
   * Used as the unique identifier for authentication.
   */
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  /**
   * Hashed password for authentication.
   * Never stored in plain text.
   * Hashing is handled by the service layer.
   */
  @Prop({ required: true })
  password: string;

  /**
   * User's full name.
   * Stored in separate firstName and lastName fields
   * for proper sorting and display.
   */
  @Prop({
    type: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    required: true,
  })
  name: {
    firstName: string;
    lastName: string;
  };

  /**
   * Token for password reset functionality.
   * Only present when a reset is in progress.
   * Cleared after successful reset.
   */
  @Prop()
  resetPasswordToken?: string;

  /**
   * Expiration timestamp for password reset token.
   * Ensures reset links cannot be used indefinitely.
   */
  @Prop()
  resetPasswordExpires?: Date;

  /**
   * Automatically managed timestamps.
   * Added by the timestamps: true schema option.
   */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generated Mongoose schema for the User class.
 * Includes all properties and their validation rules.
 * Automatically adds createdAt and updatedAt fields.
 */
export const UserSchema = SchemaFactory.createForClass(User);
