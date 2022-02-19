import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { DiscussionComment } from './entities/discussion-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, DiscussionComment])],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
