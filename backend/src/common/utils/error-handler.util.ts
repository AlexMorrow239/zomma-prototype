import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Type,
  UnauthorizedException,
} from '@nestjs/common';

import { MongoServerError } from 'mongodb';

export class ErrorHandler {
  /**
   * Handles service-level errors with consistent error transformation
   *
   * @param error The caught error
   * @param context Description of the operation that failed
   * @param knownErrors Array of error types that should be rethrown without transformation
   * @throws The original error if it's in knownErrors, otherwise an InternalServerErrorException
   *
   * @example
   * try {
   *   await this.userService.updateUser(userId, data);
   * } catch (error) {
   *   ErrorHandler.handleServiceError(
   *     error,
   *     'update user',
   *     [NotFoundException]
   *   );
   * }
   */
  static handleServiceError(
    error: Error,
    context: string,
    knownErrors: Type<Error>[] = [NotFoundException, UnauthorizedException]
  ): never {
    // Handle JWT token expiration
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        message: 'Your session has expired',
        expired: true,
      });
    }

    // Known errors
    if (knownErrors.some((errorType) => error instanceof errorType)) {
      throw error;
    }

    // MongoDB errors
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        throw new BadRequestException(
          'A record with this information already exists'
        );
      }
      throw new InternalServerErrorException('Database error occurred');
    }

    // HTTP exceptions
    if (error instanceof HttpException) {
      throw error;
    }

    // Unknown errors
    throw new InternalServerErrorException({
      message: `Failed to ${context}`,
      errorId: new Date().toISOString(),
    });
  }
}
