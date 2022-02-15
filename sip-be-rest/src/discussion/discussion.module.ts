import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscussionController } from './discussion.controller';
import { Comment } from './entities/comment.entity';
import { DiscussionService } from './discussion.service';
import { Discussion } from './entities/discussion.entity';
import { UserModule } from '@user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Comment, Discussion])],
  controllers: [DiscussionController],
  providers: [DiscussionService],
  exports: [DiscussionService],
})
export class DiscussionModule {}
