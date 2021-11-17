import { DynamicModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GRAPHQL_UI_PATH } from 'src/constants/config.constant';

export function getGraphqlConfig(): DynamicModule {
  return GraphQLModule.forRoot({
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    path: GRAPHQL_UI_PATH,
  });
}
