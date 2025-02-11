import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthResponseDto } from '@/common/dto/auth/auth-response.dto';
import { ForgotPasswordDto } from '@/common/dto/auth/forgot-password.dto';
import { LoginDto } from '@/common/dto/auth/login.dto';
import { ResetPasswordDto } from '@/common/dto/auth/reset-password.dto';
import { CreateUserDto } from '@/common/dto/users';

import { AuthService } from './auth.service';

/**
 * Controller handling all authentication-related HTTP endpoints.
 * Provides functionality for:
 * - User registration
 * - Login and authentication
 * - Password management (forgot/reset)
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new user account in the system',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already exists',
  })
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<AuthResponseDto> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns a JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  // @Post('forgot-password')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   summary: 'Forgot password',
  //   description: 'Initiates password reset process by sending reset email',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Reset email sent (if account exists)',
  // })
  // async forgotPassword(
  //   @Body() forgotPasswordDto: ForgotPasswordDto
  // ): Promise<void> {
  //   return await this.authService.forgotPassword(forgotPasswordDto.email);
  // }

  // @Post('reset-password')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   summary: 'Reset password',
  //   description: 'Resets user password using reset token',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Password successfully reset',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad Request - Invalid password format',
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Unauthorized - Invalid or expired token',
  // })
  // async resetPassword(
  //   @Body() resetPasswordDto: ResetPasswordDto
  // ): Promise<void> {
  //   return await this.authService.resetPassword(
  //     resetPasswordDto.token,
  //     resetPasswordDto.newPassword
  //   );
  // }
}
