import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';

import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../../users/schemas/user.schema';

/**
 * JWT Strategy implementation for Passport authentication.
 * Validates JWT tokens and retrieves associated user profiles.
 *
 * Configuration:
 * - Extracts JWT from Authorization Bearer header
 * - Validates token expiration
 * - Uses environment-configured JWT secret
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validates JWT payload and retrieves user profile.
   * Called automatically by Passport after token is verified.
   *
   * @param payload - Decoded JWT payload containing user ID
   * @returns User document if validation successful
   * @throws UnauthorizedException if user not found
   */
  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
