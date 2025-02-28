import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailTemplateService } from './email-template.service';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [EmailService, EmailTemplateService],
  exports: [EmailService],
})
export class EmailModule {}
