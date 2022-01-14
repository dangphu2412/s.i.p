import '@config/crud.config';
import { RuleConfig } from '@config/rule.config';
import { getTypeOrmModule } from '@config/typeorm.config';
import { RaclModule } from '@external/racl/rule.module';
import { DiscussionModule } from '@modules/discussion/discussion.module';
import { MediaModule } from '@modules/media/media.module';
import { PermissionModule } from '@modules/permission/permission.module';
import { PostModule } from '@modules/post/post.module';
import { RoleModule } from '@modules/role/role.module';
import { TopicModule } from '@modules/topic/topic.module';
import { VoteModule } from '@modules/vote/vote.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

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
    DiscussionModule,
    VoteModule,
  ],
})
export class AppModule {}
