import { Topic } from '@modules/topic/topic.entity';
import { User } from '@modules/user/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateFollowers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const topics = await connection.getRepository(Topic).find();
    const followers = await connection.getRepository(User).find();

    followers.forEach((follower) => {
      follower.followedTopics = topics;
    });

    await Promise.all(
      followers.map((follower) =>
        connection.getRepository(User).save(follower),
      ),
    );
  }
}
