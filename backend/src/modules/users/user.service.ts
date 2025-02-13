import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { string } from 'joi';
import { Model } from 'mongoose';
import { async } from 'rxjs';

import { ChangePasswordDto } from '@/common/dto/users';

import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../../common/dto/';
import { User } from './schemas/user.schema';

/**
 * Service responsible for managing user accounts in the system.
 * Handles user creation, profile management, and authentication.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Validates password strength requirements
   * @throws BadRequestException if password doesn't meet requirements
   */
  validatePassword(password: string): void {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    const errors: string[] = [];

    if (!isLongEnough) errors.push('be at least 8 characters long');
    if (!hasUpperCase) errors.push('contain at least one uppercase letter');
    if (!hasLowerCase) errors.push('contain at least one lowercase letter');
    if (!hasNumbers) errors.push('contain at least one number');
    if (!hasSpecialChar) errors.push('contain at least one special character');

    if (errors.length > 0) {
      throw new BadRequestException(`Password must ${errors.join(', ')}`);
    }
  }

  /**
   * Creates a new user account.
   * @throws ConflictException if email already exists
   * @throws BadRequestException if password doesn't meet requirements
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Check for existing user with case-insensitive email
      const existingUser = await this.userModel.findOne({
        email: { $regex: new RegExp(`^${createUserDto.email}$`, 'i') },
      });

      if (existingUser) {
        throw new ConflictException(
          'An account with this email already exists'
        );
      }

      // Validate password strength
      try {
        this.validatePassword(createUserDto.password);
      } catch (error) {
        throw new BadRequestException(error.message);
      }

      // Hash password
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      } catch (error) {
        throw new InternalServerErrorException('Error processing password');
      }

      // Create and save user document
      const savedUser = await this.userModel.create({
        email: createUserDto.email.toLowerCase(),
        password: hashedPassword,
        name: createUserDto.name,
      });

      // Remove sensitive data and return user
      const { password: _, ...userData } = savedUser.toObject();
      return {
        ...userData,
        _id: userData._id.toString(),
      } as UserResponseDto;
    } catch (error) {
      // Log the error for internal tracking
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves a user's profile information.
   * @throws NotFoundException if user not found
   */
  async getUser(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password: _, ...userData } = user.toObject();
    return {
      ...userData,
      _id: userData._id.toString(),
    } as UserResponseDto;
  }

  /**
   * Updates a user's profile information.
   * @throws NotFoundException if user not found
   */
  async updateUser(
    userId: string,
    updateProfileDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateProfileDto },
      { new: true }
    );

    const { password: _, ...userData } = updatedUser.toObject();
    return {
      ...userData,
      _id: userData._id.toString(),
    } as UserResponseDto;
  }

  /**
   * Changes a user's password.
   * @throws NotFoundException if user not found
   * @throws UnauthorizedException if current password is incorrect
   * @throws BadRequestException if new password is same as current or invalid
   */
  /**
   * Changes a user's password.
   * @throws NotFoundException if user not found
   * @throws UnauthorizedException if current password is incorrect
   * @throws BadRequestException if new password is same as current or invalid
   */
  async changeUserPassword(
    userId: string,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password
    );
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from current password'
      );
    }

    // Validate password strength
    this.validatePassword(changePasswordDto.newPassword);

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  }
}
