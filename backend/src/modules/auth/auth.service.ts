import * as crypto from 'crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import {
  AuthResponseDto,
  CreateUserDto,
  LoginRequestDto,
  UserInfoDto,
} from '@/common/dto';

import { User } from '../user/schemas/user.schema';
import { UsersService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Validates password strength requirements
   * @throws BadRequestException if password doesn't meet requirements
   */
  private validatePassword(password: string): void {
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

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    // Check for existing user with case-insensitive email
    const existingUser = await this.userModel.findOne({
      email: { $regex: new RegExp(`^${createUserDto.email}$`, 'i') },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    // Validate password strength
    this.validatePassword(createUserDto.password);

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create and save user
    const user = await this.userModel.create({
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      name: createUserDto.name,
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
}
