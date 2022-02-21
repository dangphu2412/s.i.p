import { CommentModule } from '@comment/comment.module';
import { MediaModule } from '@media/media.module';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicModule } from '@topic/topic.module';
import { UserModule } from '@user/user.module';
import { VoteModule } from '@vote/vote.module';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository]),
    VoteModule,
    UserModule,
    TopicModule,
    CommentModule,
    MediaModule,
  ],
  controllers: [PostController],
  providers: [PostService, Logger],
  exports: [PostService],
})
export class PostModule {}
