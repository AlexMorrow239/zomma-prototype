import { Prop, Schema } from '@nestjs/mongoose';

import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class BaseSchema {
  @Prop()
  _id: Types.ObjectId;
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
