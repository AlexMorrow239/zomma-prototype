import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProspectController } from './prospect.controller';
import { ProspectService } from './prospect.service';
import { Prospect, ProspectSchema } from './schemas/prospect.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prospect.name, schema: ProspectSchema },
    ]),
  ],
  controllers: [ProspectController],
  providers: [ProspectService],
})
export class ProspectModule {}
