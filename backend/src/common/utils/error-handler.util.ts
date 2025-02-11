/**
 * Utility class for standardized error handling across services
 * Provides centralized error processing, logging, and transformation
 */
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Type,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { CustomLogger } from '@common/services/logger.service';

export class ErrorHandler {
  /**
   * Handles service-level errors with consistent logging and error transformation
   *
   * @param logger CustomLogger instance for error logging
   * @param error The caught error
   * @param context Description of the operation that failed
   * @param details Additional error context details
   * @param knownErrors Array of error types that should be rethrown without transformation
   * @throws The original error if it's in knownErrors, otherwise an InternalServerErrorException
   *
   * @example
   * try {
   *   await this.userService.updateUser(userId, data);
   * } catch (error) {
   *   ErrorHandler.handleServiceError(
   *     this.logger,
   *     error,
   *     'update user',
   *     { userId, data },
   *     [NotFoundException]
   *   );
   * }
   */
  static handleServiceError(
    logger: CustomLogger,
    error: Error,
    context: string,
    details?: Record<string, any>,
    knownErrors: Type<Error>[] = [NotFoundException, UnauthorizedException],
  ): never {
    // Prepare structured log data
    const logData = {
      operation: context,
      errorType: error?.constructor?.name || 'UnknownError',
      errorMessage: error?.message || 'Unknown error occurred',
      ...details,
    };

    // Handle JWT token expiration
    if (error.name === 'TokenExpiredError') {
      logger.logObject('warn', logData, 'Token expired');
      throw new UnauthorizedException({ message: 'Your session has expired', expired: true });
    }

    // Known errors
    if (knownErrors.some((errorType) => error instanceof errorType)) {
      logger.logObject('warn', logData, `Known error occurred during ${context}`);
      throw error;
    }

    // MongoDB errors
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        logger.logObject('warn', { ...logData, mongoError: error.code }, 'Duplicate key error');
        throw new BadRequestException('A record with this information already exists');
      }
      logger.logObject('error', { ...logData, mongoError: error.code }, 'MongoDB error');
    }

    // HTTP exceptions
    if (error instanceof HttpException) {
      logger.logObject('error', { ...logData, statusCode: error.getStatus() }, 'HTTP exception');
      throw error;
    }

    // Unknown errors
    logger.logObject('error', { ...logData, severity: 'CRITICAL' }, 'Unhandled error');
    throw new InternalServerErrorException({
      message: `Failed to ${context}`,
      errorId: new Date().toISOString(),
    });
  }
}
