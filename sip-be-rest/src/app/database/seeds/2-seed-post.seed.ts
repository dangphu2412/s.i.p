import { Post } from '@modules/post/post.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreatePosts implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const POST_COUNT = 50;
    await factory(Post)().createMany(POST_COUNT);
  }
}
