import { Field, InterfaceType } from '@nestjs/graphql';
import { DeleteDateColumn } from 'typeorm';

@InterfaceType()
export class TrashTracker {
  @Field(() => Date, { description: 'Entity deleted at', nullable: true })
  @DeleteDateColumn({ name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date;
}
