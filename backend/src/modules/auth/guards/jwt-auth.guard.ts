import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TokenExpiredError } from 'jsonwebtoken';

/**
 * Guard implementing JWT authentication for protected routes.
 * Extends Passport's AuthGuard to provide JWT-specific handling.
 *
 * Usage:
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Get('protected-route')
 * async someProtectedMethod() {
 *   // Only accessible with valid JWT
 * }
 * ```
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Custom request handler for JWT authentication.
   * Provides specific error handling for common JWT issues.
   */
  handleRequest(err: any, user: any, info: Error | null) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException({
        message: 'Your session has expired',
        expired: true,
      });
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
