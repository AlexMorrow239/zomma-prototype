import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  CreateEmailRecipientDto,
  EmailRecipientResponseDto,
  UpdateEmailRecipientDto,
} from '@/common/dto';

import {
  EmailRecipient,
  EmailRecipientDocument,
} from './schemas/email-recipient.schema';

@Injectable()
export class EmailRecipientService {
  private readonly logger = new Logger(EmailRecipientService.name);

  constructor(
    @InjectModel(EmailRecipient.name)
    private emailRecipientModel: Model<EmailRecipientDocument>
  ) {}

  /**
   * Get all active email recipients
   */
  async getAllActiveRecipients(): Promise<EmailRecipientResponseDto[]> {
    this.logger.log('Fetching all active email recipients');
    const recipients = await this.emailRecipientModel
      .find({ active: true })
      .exec();
    return recipients.map((recipient) => this.mapToResponseDto(recipient));
  }

  /**
   * Get all email recipients
   */
  async getAllRecipients(): Promise<EmailRecipientResponseDto[]> {
    this.logger.log('Fetching all email recipients');
    const recipients = await this.emailRecipientModel.find().exec();
    return recipients.map((recipient) => this.mapToResponseDto(recipient));
  }

  /**
   * Get email recipient by ID
   */
  async getRecipientById(id: string): Promise<EmailRecipientResponseDto> {
    this.logger.log(`Fetching email recipient by ID: ${id}`);
    const recipient = await this.emailRecipientModel.findById(id).exec();

    if (!recipient) {
      throw new NotFoundException(`Email recipient with ID ${id} not found`);
    }

    return this.mapToResponseDto(recipient);
  }

  /**
   * Create a new email recipient
   */
  async createRecipient(
    recipientData: CreateEmailRecipientDto
  ): Promise<EmailRecipientResponseDto> {
    this.logger.log(`Creating new email recipient: ${recipientData.email}`);
    const newRecipient = new this.emailRecipientModel(recipientData);
    const saved = await newRecipient.save();
    return this.mapToResponseDto(saved);
  }

  /**
   * Update an existing email recipient
   */
  async updateRecipient(
    id: string,
    updateData: UpdateEmailRecipientDto
  ): Promise<EmailRecipientResponseDto> {
    this.logger.log(`Updating email recipient with ID ${id}`);
    this.logger.debug(`Original update data: ${JSON.stringify(updateData)}`);

    // Create a new update object with properly converted active field
    const updateDataToApply = { ...updateData };

    // Explicitly convert the active field to a boolean if it's present
    if (updateData.active !== undefined) {
      if (typeof updateData.active === 'string') {
        const activeStr = updateData.active as string;
        // Special handling for 'false' string value
        if (activeStr.toLowerCase() === 'false') {
          updateDataToApply.active = false;
        } else {
          updateDataToApply.active = activeStr.toLowerCase() === 'true';
        }
      } else {
        updateDataToApply.active = Boolean(updateData.active);
      }

      this.logger.debug(
        `After conversion: active=${updateDataToApply.active} (${typeof updateDataToApply.active})`
      );
    }

    this.logger.debug(
      `Processed update data: ${JSON.stringify(updateDataToApply)}`
    );

    const updatedRecipient = await this.emailRecipientModel
      .findByIdAndUpdate(id, updateDataToApply, { new: true })
      .exec();

    if (!updatedRecipient) {
      throw new NotFoundException(`Email recipient with ID ${id} not found`);
    }

    this.logger.debug(
      `MongoDB returned document: ${JSON.stringify(updatedRecipient.toObject())}`
    );

    return this.mapToResponseDto(updatedRecipient);
  }

  /**
   * Delete an email recipient
   */
  async deleteRecipient(id: string): Promise<void> {
    this.logger.log(`Deleting email recipient with ID ${id}`);
    const result = await this.emailRecipientModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Email recipient with ID ${id} not found`);
    }
  }

  /**
   * Get all active recipient emails as string array
   * This method is used by the email service
   */
  async getActiveRecipientEmails(): Promise<string[]> {
    this.logger.log('Fetching all active recipient emails as string array');
    const recipients = await this.getAllActiveRecipients();
    return recipients.map((recipient) => recipient.email);
  }

  /**
   * Map the database document to response DTO
   */
  private mapToResponseDto(
    recipient: EmailRecipientDocument
  ): EmailRecipientResponseDto {
    return {
      id: recipient._id.toString(),
      email: recipient.email,
      name: recipient.name,
      active: !!recipient.active,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    };
  }
}
