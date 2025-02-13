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

import { UpdateUserDto, UserResponseDto } from '@/common/dto/';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { User } from '@/modules/user/schemas/user.schema';
import { UsersService } from '@/modules/user/user.service';

import { GetUser } from './get-user.decorator';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  async getProfile(@GetUser('id') userId: string): Promise<UserResponseDto> {
    return await this.usersService.getUser(userId);
  }

  @Patch('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update user profile',
    description:
      "Updates the authenticated user's profile information (excluding password)",
  })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateProfileDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUser(userId, updateProfileDto);
  }
}
