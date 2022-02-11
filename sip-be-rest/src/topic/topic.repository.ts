import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { EntityRepository, FindManyOptions, ILike, Repository } from 'typeorm';
import { Topic } from './topic.entity';

@EntityRepository(Topic)
export class TopicRepository extends Repository<Topic> {
  public searchWithPagination(searchQuery: SearchCriteria) {
    const findManyOptions: FindManyOptions<Topic> = {
      skip: searchQuery.offset,
      take: searchQuery.limit,
    };
    if (searchQuery.search) {
      findManyOptions.where = {
        name: ILike(`%${searchQuery.search}%`),
      };
    }
    return this.find(findManyOptions);
  }
}
