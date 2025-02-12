import * as crypto from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import {
  ForgotPasswordRequestDto,
  LoginRequestDto,
  ResetPasswordRequestDto,
} from '@/common/dto/auth/auth-requests.dto';
import {
  AuthResponseDto,
  UserInfoDto,
} from '@/common/dto/auth/auth-response.dto';
import { CreateUserDto } from '@/common/dto/users';

import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    await this.usersService.createUser(createUserDto);
    const user = await this.userModel.findOne({
      email: createUserDto.email,
    });
    return await this.generateAuthResponse(user);
  }

  async login(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    return this.generateAuthResponse(user);
  }

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

  private async generateAuthResponse(user: User): Promise<AuthResponseDto> {
    const payload = { sub: user._id.toString(), email: user.email };
    const token = this.jwtService.sign(payload);

    const userInfo: UserInfoDto = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.name.firstName,
      lastName: user.name.lastName,
    };

    return {
      token,
      user: userInfo,
    };
  }

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Return void even if user not found to prevent email enumeration
      return;
    }

    const resetToken = this.jwtService.sign(
      { sub: user._id, email: user.email },
      { expiresIn: '1h' }
    );

    // Store hashed reset token
    const hashedToken = await bcrypt.hash(resetToken, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
    });

    // TODO: send the resetToken via email here
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Validate new password
    await this.usersService.validatePassword(newPassword);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token fields
    await this.userModel.findByIdAndUpdate(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }
}
