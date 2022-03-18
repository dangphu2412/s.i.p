import { ValidatorModule } from './../validator/validator.module';
import { DiscussionModule } from '@discussion/discussion.module';
import { AuthModule } from '@auth/auth.module';
import '@config/crud.config';
import { RuleConfig } from '@config/rule.config';
import { getTypeOrmModule } from '@config/typeorm.config';
import { CommentModule } from '@comment/comment.module';
import { RaclModule } from '@external/racl/rule.module';
import { MediaModule } from '@media/media.module';
import { Module, CacheModule } from '@nestjs/common';
import { PermissionModule } from '@permission/permission.module';
import { PostModule } from '@post/post.module';
import { RoleModule } from '@role/role.module';
import { TopicModule } from '@topic/topic.module';
import { UserModule } from '@user/user.module';
import { VoteModule } from '@vote/vote.module';
import { NotificationModule } from 'src/notification/notification.module';
import { RankModule } from '@rank/rank.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from 'src/events/event.module';

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
    ValidatorModule,
    NotificationModule,
    RankModule,
    EventModule,
    CacheModule.register(),
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
