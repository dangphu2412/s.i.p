import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Post } from '@modules/post/post.entity';

export default class CreatePosts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const POST_COUNT = 50;
    await factory(Post)().createMany(POST_COUNT);
  }
}
