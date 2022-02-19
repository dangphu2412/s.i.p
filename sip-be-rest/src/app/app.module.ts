import { DiscussionModule } from '@discussion/discussion.module';
import { AuthModule } from '@auth/auth.module';
import '@config/crud.config';
import { RuleConfig } from '@config/rule.config';
import { getTypeOrmModule } from '@config/typeorm.config';
import { CommentModule } from '@comment/comment.module';
import { RaclModule } from '@external/racl/rule.module';
import { MediaModule } from '@media/media.module';
import { Module } from '@nestjs/common';
import { PermissionModule } from '@permission/permission.module';
import { PostModule } from '@post/post.module';
import { RoleModule } from '@role/role.module';
import { TopicModule } from '@topic/topic.module';
import { UserModule } from '@user/user.module';
import { VoteModule } from '@vote/vote.module';

@Module({
  imports: [
    getTypeOrmModule(),
    RaclModule.register({
      useClass: RuleConfig,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    MediaModule,
    TopicModule,
    PostModule,
    CommentModule,
    DiscussionModule,
    VoteModule,
  ],
})
export class AppModule {}
