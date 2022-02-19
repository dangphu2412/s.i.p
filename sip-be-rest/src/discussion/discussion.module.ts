import { CommentModule } from '@comment/comment.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@user/user.module';
import { VoteModule } from '@vote/vote.module';
import { DiscussionController } from './discussion.controller';
import { DiscussionRepository } from './discussion.repository';
import { DiscussionService } from './discussion.service';

@Module({
  imports: [
    CommentModule,
    VoteModule,
    UserModule,
    TypeOrmModule.forFeature([DiscussionRepository]),
  ],
  controllers: [DiscussionController],
  providers: [DiscussionService],
})
export class DiscussionModule {}
