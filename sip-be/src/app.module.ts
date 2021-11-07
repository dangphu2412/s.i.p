import { Module } from '@nestjs/common';
import { getGraphqlConfig } from './configs/graphql.config';
import { getTypeOrmModule } from './configs/typeorm.config';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [getTypeOrmModule(), getGraphqlConfig(), UsersModule],
})
export class AppModule {}
