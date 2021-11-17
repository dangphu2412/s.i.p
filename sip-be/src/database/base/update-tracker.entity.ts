import { Field, InterfaceType } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@InterfaceType()
export class UpdateTracker {
  @Field(() => Date, { description: 'Entity created at' })
  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;

  @Field(() => Date, { description: 'Entity updated at' })
  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
  })
  updatedAt: Date;
}
