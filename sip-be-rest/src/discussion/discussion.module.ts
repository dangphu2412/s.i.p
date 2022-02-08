import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscussionController } from './discussion.controller';
import { Discussion } from './discussion.entity';
import { DiscussionService } from './discussion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Discussion])],
  controllers: [DiscussionController],
  providers: [DiscussionService],
  exports: [DiscussionService],
})
export class DiscussionModule {}
