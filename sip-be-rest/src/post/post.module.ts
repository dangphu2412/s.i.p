import { CommentModule } from '@comment/comment.module';
import { MediaModule } from '@media/media.module';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankModule } from '@rank/rank.module';
import { TopicModule } from '@topic/topic.module';
import { UserModule } from '@user/user.module';
import { VoteModule } from '@vote/vote.module';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { PostUseCase } from './post.usecase';
import { PostPublishValidator } from './validator/post-publish.validator';
import { PostUpdateValidator } from './validator/post-update.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository]),
    VoteModule,
    UserModule,
    TopicModule,
    CommentModule,
    MediaModule,
    RankModule,
  ],
  controllers: [PostController],
  providers: [
    PostUseCase,
    PostService,
    Logger,
    PostUpdateValidator,
    PostPublishValidator,
  ],
  exports: [PostUseCase],
})
export class PostModule {}
