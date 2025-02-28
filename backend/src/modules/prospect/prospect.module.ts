import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmailModule } from '../email/email.module';
import { ProspectController } from './prospect.controller';
import { ProspectService } from './prospect.service';
import { Prospect, ProspectSchema } from './schemas/prospect.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prospect.name, schema: ProspectSchema },
    ]),
    EmailModule,
  ],
  controllers: [ProspectController],
  providers: [ProspectService],
})
export class ProspectModule {}
