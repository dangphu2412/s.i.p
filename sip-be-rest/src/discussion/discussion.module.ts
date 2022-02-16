import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@user/user.module';
import { VoteModule } from '@vote/vote.module';
import { DiscussionController } from './discussion.controller';
import { DiscussionRepository } from './discussion.repository';
import { DiscussionService } from './discussion.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    UserModule,
    VoteModule,
    TypeOrmModule.forFeature([Comment, DiscussionRepository]),
  ],
  controllers: [DiscussionController],
  providers: [DiscussionService],
  exports: [DiscussionService],
})
export class DiscussionModule {}
