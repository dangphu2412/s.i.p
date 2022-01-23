import { DiscussionModule } from 'src/discussion/discussion.module';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { UserModule } from '@user/user.module';
import { VoteModule } from '@vote/vote.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository]),
    VoteModule,
    UserModule,
    DiscussionModule,
  ],
  controllers: [PostController],
  providers: [PostService, Logger],
})
export class PostModule {}
