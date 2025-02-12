import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { ChangePasswordDto } from '@/common/dto/users';

import { CreateUserDto } from '../../common/dto/users/create-user.dto';
import { UpdateUserDto } from '../../common/dto/users/update-user.dto';
import { UserResponseDto } from '../../common/dto/users/user-responses.dto';
import { User } from './schemas/user.schema';

/**
 * Service responsible for managing user accounts in the system.
 * Handles user creation, profile management, and authentication.
 */
@Injectable()
export class UsersService {
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
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Validate password strength
    this.validatePassword(createUserDto.password);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
    });

    const { password: _, ...userData } = newUser.toObject();
    return {
      ...userData,
      _id: userData._id.toString(),
    } as UserResponseDto;
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
