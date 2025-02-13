import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  AuthResponseDto,
  LoginUserRequestDto,
  RegisterUserRequestDto,
} from '@/common/dto';

import { AuthService } from './auth.service';

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
  @ApiBody({
    type: RegisterUserRequestDto,
    description: 'User registration details',
    examples: {
      validUser: {
        value: {
          email: 'john.doe@example.com',
          password: 'Password123!',
          name: {
            firstName: 'John',
            lastName: 'Doe',
          },
        },
        summary: 'Valid user registration example',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
    content: {
      'application/json': {
        example: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
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
    @Body() RegisterUserRequestDto: RegisterUserRequestDto
  ): Promise<AuthResponseDto> {
    return await this.authService.register(RegisterUserRequestDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns a JWT token',
  })
  @ApiBody({
    type: LoginUserRequestDto,
    description: 'User login credentials',
    examples: {
      validLogin: {
        value: {
          email: 'john.doe@example.com',
          password: 'Password123!',
        },
        summary: 'Valid login example',
      },
    },
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
  async login(@Body() loginDto: LoginUserRequestDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginDto);
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
