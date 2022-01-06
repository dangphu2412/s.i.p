import { Post } from '@modules/post/post.entity';
import { User } from '@modules/user/user.entity';
import { Vote } from '@modules/vote/vote.entity';
import { chunk } from 'lodash';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { random } from 'faker';

export default class CreateVotes implements Seeder {
  private fromPostToVotes(
    factory: Factory,
    { post, author }: { post: Post; author: User },
  ) {
    return factory(Vote)({ post, author }).createMany(
      random.number({ min: 15, max: 100 }),
    );
  }

  public async run(factory: Factory, connection: Connection): Promise<any> {
    const allPosts = await connection.getRepository(Post).find();
    const authors = await connection.getRepository(User).find();
    const chunkedPosts = chunk(allPosts, 10);

    const authorValidateDuplicate = {};

    for (const posts of chunkedPosts) {
      let duplicated = true;

      let author: User;

      while (duplicated) {
        author = random.arrayElement(authors);
        if (!authorValidateDuplicate[author.id]) {
          duplicated = false;
        } else {
          authorValidateDuplicate[author.id] = true;
        }
      }
      console.log('Finish random');

      await Promise.all(
        posts.map((post) =>
          this.fromPostToVotes(factory, {
            post,
            author,
          }),
        ),
      );
    }
  }
}
