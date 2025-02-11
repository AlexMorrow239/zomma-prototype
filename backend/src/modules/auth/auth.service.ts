import * as crypto from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { AuthResponseDto } from '@/common/dto/auth/auth-response.dto';
import { CreateUserDto } from '@/common/dto/users';

import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/user.service';

/**
 * Service handling authentication and authorization operations.
 * Manages user authentication lifecycle including:
 * - User registration
 * - Login and JWT token generation
 * - Password management (reset, forgot password)
 *
 * Security Features:
 * - Bcrypt password hashing
 * - JWT token-based authentication
 * - Time-limited password reset tokens
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Registers a new user account.
   *
   * @param createUserDto - Registration data
   * @returns AuthResponseDto containing access token and user info
   */
  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    await this.usersService.createUser(createUserDto);
    const user = await this.userModel.findOne({ email: createUserDto.email });
    return await this.generateAuthResponse(user);
  }

  /**
   * Authenticates a user and generates login credentials.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns AuthResponseDto containing access token and user info
   * @throws UnauthorizedException for invalid credentials
   */
  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.validateUser(email, password);
    return this.generateAuthResponse(user);
  }

  /**
   * Validates user credentials.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns User document if validation successful
   * @throws UnauthorizedException for invalid credentials
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException(
        'No account found with this email. Please check your email or register for a new account.'
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password. Please try again.');
    }

    return user;
  }

  /**
   * Generates JWT token and formats login response.
   *
   * @param user - User document
   * @returns AuthResponseDto containing access token and user info
   */
  private generateAuthResponse(user: User): Promise<AuthResponseDto> {
    const payload = { sub: user._id.toString(), email: user.email };
    const token = this.jwtService.sign(payload);

    return Promise.resolve({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.name.firstName,
        lastName: user.name.lastName,
      },
    });
  }

  /**
   * Generates a secure random reset token
   */
  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Initiates password reset process for forgotten passwords.
   * Generates time-limited reset token and sends reset email.
   *
   * @param email - User's email address
   */
  // async forgotPassword(email: string): Promise<void> {
  //   const user = await this.userModel.findOne({ email });
  //   if (!user) {
  //     // Return void even if user not found to prevent email enumeration
  //     return;
  //   }

  //   const resetToken = this.jwtService.sign(
  //     { sub: user._id, email: user.email },
  //     { expiresIn: '1h' }
  //   );

  //   // Store hashed reset token
  //   const hashedToken = await bcrypt.hash(resetToken, 10);
  //   await this.userModel.findByIdAndUpdate(user._id, {
  //     resetPasswordToken: hashedToken,
  //     resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
  //   });
  // }

  /**
   * Completes password reset process using reset token.
   *
   * @param token - Password reset token
   * @param newPassword - New password to set
   * @throws UnauthorizedException for invalid or expired tokens
   */
  // async resetPassword(token: string, newPassword: string): Promise<void> {
  //   const user = await this.userModel.findOne({
  //     resetPasswordToken: token,
  //     resetPasswordExpiry: { $gt: new Date() },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid or expired reset token');
  //   }

  //   // Validate new password
  //   await this.usersService.validatePassword(newPassword);

  //   // Hash the new password
  //   const hashedPassword = await bcrypt.hash(newPassword, 10);

  //   // Update user's password and clear reset token fields
  //   await this.userModel.findByIdAndUpdate(user.id, {
  //     password: hashedPassword,
  //     resetPasswordToken: null,
  //     resetPasswordExpiry: null,
  //   });
  // }
}
