import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateEmailRecipientDto,
  EmailRecipientResponseDto,
  UpdateEmailRecipientDto,
} from '@/common/dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailRecipientService } from './email-recipient.service';

@ApiTags('Email Recipients')
@Controller('email-recipients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Ensure only authenticated users can access these endpoints
export class EmailRecipientController {
  constructor(private readonly emailRecipientService: EmailRecipientService) {}

  @Get()
  @ApiOperation({ summary: 'Get all email recipients' })
  @ApiResponse({
    status: 200,
    description: 'Returns all email recipients',
    type: [EmailRecipientResponseDto],
  })
  async getAllRecipients(): Promise<EmailRecipientResponseDto[]> {
    return this.emailRecipientService.getAllRecipients();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active email recipients' })
  @ApiResponse({
    status: 200,
    description: 'Returns all active email recipients',
    type: [EmailRecipientResponseDto],
  })
  async getAllActiveRecipients(): Promise<EmailRecipientResponseDto[]> {
    return this.emailRecipientService.getAllActiveRecipients();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get email recipient by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the email recipient with the specified ID',
    type: EmailRecipientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Email recipient not found',
  })
  async getRecipientById(
    @Param('id') id: string
  ): Promise<EmailRecipientResponseDto> {
    return this.emailRecipientService.getRecipientById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new email recipient' })
  @ApiResponse({
    status: 201,
    description: 'The email recipient has been successfully created',
    type: EmailRecipientResponseDto,
  })
  async createRecipient(
    @Body() createRecipientDto: CreateEmailRecipientDto
  ): Promise<EmailRecipientResponseDto> {
    return this.emailRecipientService.createRecipient(createRecipientDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an email recipient' })
  @ApiResponse({
    status: 200,
    description: 'The email recipient has been successfully updated',
    type: EmailRecipientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Email recipient not found',
  })
  async updateRecipient(
    @Param('id') id: string,
    @Body() updateRecipientDto: UpdateEmailRecipientDto,
    @Body('active') activeRaw?: string | boolean
  ): Promise<EmailRecipientResponseDto> {
    // If active is passed as a string 'false', ensure it's properly converted
    if (activeRaw !== undefined) {
      if (typeof activeRaw === 'string') {
        if (activeRaw.toLowerCase() === 'false') {
          updateRecipientDto.active = false;
        }
      }
    }

    return this.emailRecipientService.updateRecipient(id, updateRecipientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an email recipient' })
  @ApiResponse({
    status: 200,
    description: 'The email recipient has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Email recipient not found',
  })
  async deleteRecipient(@Param('id') id: string): Promise<void> {
    return this.emailRecipientService.deleteRecipient(id);
  }
}
