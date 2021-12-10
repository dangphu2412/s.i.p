import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Post } from '@modules/post/post.entity';

export default class CreatePosts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Post)().createMany(10);
  }
}
