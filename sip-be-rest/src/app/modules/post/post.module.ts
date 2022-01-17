import { DiscussionModule } from '@modules/discussion/discussion.module';
import { UserModule } from 'src/user/user.module';
import { VoteModule } from '@modules/vote/vote.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository]),
    VoteModule,
    UserModule,
    DiscussionModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
