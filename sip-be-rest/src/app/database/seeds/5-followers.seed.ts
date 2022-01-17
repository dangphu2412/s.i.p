import { Topic } from '@modules/topic/topic.entity';
import { User } from 'src/user/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { random } from 'faker';

export default class CreateFollowers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const topics = await connection.getRepository(Topic).find();
    const followers = await connection.getRepository(User).find();

    followers.forEach((follower) => {
      follower.followedTopics = [
        ...new Set([random.arrayElement(topics), random.arrayElement(topics)]),
      ];
    });

    await Promise.all(
      followers.map((follower) =>
        connection.getRepository(User).save(follower),
      ),
    );
  }
}
