import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  ChangePasswordDto,
  UpdateUserDto,
  UserResponseDto,
} from '@/common/dto/users';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { User } from '@/modules/users/schemas/user.schema';
import { UsersService } from '@/modules/users/user.service';

import { GetUser } from './get-user.decorator';

/**
 * Controller handling user-related HTTP endpoints.
 * Groups functionality into:
 * - Profile management (view/update)
 * - Security operations (password change)
 * - Account status management (deactivation)
 */
@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //#region Profile Management

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user profile',
    description: "Retrieves the authenticated user's profile information",
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  async getProfile(@GetUser() user: User): Promise<UserResponseDto> {
    return await this.usersService.getUser(user.id);
  }

  @Patch('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update user profile',
    description: "Updates the authenticated user's profile information",
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  async updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUser(user.id, updateProfileDto);
  }

  //#endregion

  //#region Security Operations

  // @Post('change-password')
  // @UseGuards(JwtAuthGuard)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   summary: 'Change password',
  //   description: "Changes the authenticated user's password",
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Password changed successfully',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad Request - Invalid password format or same as current',
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Unauthorized - Invalid current password or token',
  // })
  // async changePassword(
  //   @GetUser() user: User,
  //   @Body() changePasswordDto: ChangePasswordDto
  // ): Promise<void> {
  //   await this.usersService.changeUserPassword(
  //     user.id,
  //     changePasswordDto.currentPassword,
  //     changePasswordDto.newPassword
  //   );
  // }

  //#endregion
}
