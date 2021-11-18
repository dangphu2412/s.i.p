import { Module } from '@nestjs/common';
import { getGraphqlConfig } from '@configs/graphql.config';
import { getTypeOrmModule } from '@configs/typeorm.config';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { PostModule } from '@modules/post/post.module';
import { TopicModule } from './modules/topic/topic.module';
import { VotesModule } from './modules/votes/votes.module';

@Module({
  imports: [
    getTypeOrmModule(),
    getGraphqlConfig(),
    UsersModule,
    AuthModule,
    PostModule,
    TopicModule,
    VotesModule,
  ],
})
export class AppModule {}
