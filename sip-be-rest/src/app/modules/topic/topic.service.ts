import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './topic.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
  ) {}

  findMany(searchQuery: SearchCriteria) {
    return this.topicRepository.find();
  }
}
