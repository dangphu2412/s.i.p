import { Module } from '@nestjs/common';
import { getGraphqlConfig } from './configs/graphql.config';
import { getTypeOrmModule } from './configs/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [getTypeOrmModule(), getGraphqlConfig(), UsersModule, AuthModule],
})
export class AppModule {}
