import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/graphql/pagination.type';
import { UserType } from './user.type';

@ObjectType()
export class PaginatedUser extends Paginated(UserType) {}
