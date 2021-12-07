import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { VoteModule } from '@modules/vote/vote.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), VoteModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
