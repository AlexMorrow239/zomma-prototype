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

import { Model } from 'mongoose';

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
   * Creates a new user account.
   * @throws ConflictException if email already exists
   * @throws BadRequestException if password doesn't meet requirements
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Find user by email and convert to UserResponseDto
      const savedUser = await this.userModel.findOne({
        email: createUserDto.email.toLowerCase(),
      });

      if (!savedUser) {
        throw new NotFoundException('User not found after creation');
      }

      // Remove sensitive data and return user
      const { password: _, ...userData } = savedUser.toObject();
      return {
        ...userData,
        _id: userData._id.toString(),
      } as UserResponseDto;
    } catch (error) {
      // Log the error for internal tracking
      this.logger.error(
        `Error retrieving created user: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Retrieves a user's profile information.
   * @throws NotFoundException if user not found
   */
  async getUser(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password: _, ...userData } = user;
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
}
