import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Name {
  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
  })
  firstName: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
  })
  lastName: string;
}
