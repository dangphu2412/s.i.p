import { Topic } from '@modules/topic/topic.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateTopics implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Topic)().createMany(10);
  }
}
