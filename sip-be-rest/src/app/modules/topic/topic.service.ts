import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { UserCredential } from '@modules/auth/types/user-cred.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './topic.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
  ) {}

  // Lay ra nhung topic va kiem tra xem user da follow topic chua
  async findMany(
    searchQuery: SearchCriteria,
    author: UserCredential | undefined,
  ) {
    const topics = await this.topicRepository.find({
      relations: ['followers'],
    });
    return topics;
  }
}
