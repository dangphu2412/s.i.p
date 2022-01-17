import { Post } from 'src/post/post.entity';
import { Topic } from 'src/topic/topic.entity';
import { User } from 'src/user/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreatePosts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const topics = await connection.manager.find(Topic);
    const authors = await connection.manager.find(User);

    const POST_COUNT = 100;
    await factory(Post)({ topics, authors }).createMany(POST_COUNT);
  }
}
