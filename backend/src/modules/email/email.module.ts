import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EmailRecipientController } from './email-recipient.controller';
import { EmailRecipientService } from './email-recipient.service';
import { EmailTemplateService } from './email-template.service';
import { EmailService } from './email.service';
import {
  EmailRecipient,
  EmailRecipientSchema,
} from './schemas/email-recipient.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: EmailRecipient.name, schema: EmailRecipientSchema },
    ]),
  ],
  controllers: [EmailRecipientController],
  providers: [EmailService, EmailTemplateService, EmailRecipientService],
  exports: [EmailService, EmailRecipientService],
})
export class EmailModule {}
