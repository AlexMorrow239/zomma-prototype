import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateProspectDto, UpdateProspectDto } from '@/common/dto';

import { EmailService } from '../email/email.service';
import { Prospect, ProspectDocument } from './schemas/prospect.schema';

@Injectable()
export class ProspectService {
  private readonly notificationRecipients: string[];
  private readonly logger = new Logger(ProspectService.name);

  constructor(
    @InjectModel(Prospect.name)
    private prospectModel: Model<ProspectDocument>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {
    // Get notification recipients from config, or use a default list
    this.notificationRecipients = this.configService.get<string[]>(
      'prospect.notificationRecipients'
    ) || ['alex.morrow239@gmail.com']; // Default fallback email
  }

  async create(
    createProspectDto: CreateProspectDto
  ): Promise<ProspectDocument> {
    try {
      // Validate required nested fields
      if (
        !createProspectDto.contact?.name.firstName ||
        !createProspectDto.contact?.name.lastName
      ) {
        throw new BadRequestException('First name and last name are required');
      }

      const createdProspect = new this.prospectModel(createProspectDto);
      const savedProspect = await createdProspect.save();

      try {
        // Send notification emails about the new prospect application
        await this.emailService.sendProspectApplicationNotification(
          savedProspect,
          this.notificationRecipients
        );
        this.logger.log(
          `Notification sent for new prospect: ${savedProspect.id}`
        );
      } catch (emailError) {
        // Log the error but don't fail the entire operation
        this.logger.error(
          `Failed to send prospect notification email: ${emailError.message}`,
          emailError.stack
        );
      }

      return savedProspect;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException('Error creating prospect');
    }
  }

  async findAll(): Promise<ProspectDocument[]> {
    return this.prospectModel
      .find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();
  }

  async update(
    id: string,
    updateProspectDto: UpdateProspectDto
  ): Promise<ProspectDocument> {
    const updatedProspect = await this.prospectModel
      .findByIdAndUpdate(id, updateProspectDto, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
      })
      .exec();

    if (!updatedProspect) {
      throw new NotFoundException(`Prospect with ID "${id}" not found`);
    }

    return updatedProspect;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedProspect = await this.prospectModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedProspect) {
      throw new NotFoundException(`Prospect with ID "${id}" not found`);
    }

    return {
      message: `Prospect ${id} has been successfully deleted`,
    };
  }
}
