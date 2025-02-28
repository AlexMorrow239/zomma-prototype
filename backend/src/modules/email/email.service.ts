import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

import { Prospect } from '../prospect/schemas/prospect.schema';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly emailTemplateService: EmailTemplateService,
    private readonly configService: ConfigService
  ) {
    const smtpConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('email.user'),
        pass: this.configService.get('email.password'),
      },
    };
    this.transporter = nodemailer.createTransport(smtpConfig);
  }

  /**
   * Sends notification emails when a new prospect application is submitted
   * @param prospect The prospect data
   * @param recipientEmails List of email addresses to notify
   */
  async sendProspectApplicationNotification(
    prospect: Prospect,
    recipientEmails: string[]
  ): Promise<void> {
    try {
      if (!recipientEmails || recipientEmails.length === 0) {
        this.logger.warn(
          'No recipient emails provided for prospect notification'
        );
        return;
      }

      const { subject, text, html } =
        this.emailTemplateService.getProspectApplicationTemplate(prospect);

      // Send to all recipients
      for (const recipientEmail of recipientEmails) {
        await this.sendEmailWithRetry(recipientEmail, subject, text, html);
      }

      this.logger.log(
        `Prospect application notification emails sent successfully to ${recipientEmails.join(', ')}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to send prospect application notification: ${error.message}`,
        error.stack
      );
    }
  }

  /**
   * Helper method to send emails with retry logic
   */
  private async sendEmailWithRetry(
    to: string,
    subject: string,
    text: string,
    html: string,
    retryCount = 0
  ): Promise<void> {
    try {
      const fromAddress = this.configService.get('email.fromAddress');
      await this.transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text: `${text}\n\nNOTE: This email was sent from a no-reply address. Please do not reply to this email.`,
        html: `${html}\n<p style="color: #64748b; font-size: 12px; margin-top: 20px;">NOTE: This email was sent from a no-reply address. Please do not reply to this email.</p>`,
        replyTo: fromAddress,
      });

      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        this.logger.warn(
          `Failed to send email to ${to}, retrying... (${retryCount + 1}/${this.MAX_RETRIES})`
        );

        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
        return this.sendEmailWithRetry(to, subject, text, html, retryCount + 1);
      }

      this.logger.error(
        `Failed to send email after ${this.MAX_RETRIES} retries: ${error.message}`,
        error.stack
      );
    }
  }
}
