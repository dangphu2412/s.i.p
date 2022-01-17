import { Vote } from '@vote/vote.entity';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateVotes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const posts = await connection.getRepository(Post).find();
    const authors = await connection.getRepository(User).find();

    const chunkVotes = posts.map((post) => {
      return authors.map((author) => {
        const vote = new Vote();
        vote.author = author;
        vote.post = post;
        return vote;
      });
    });

    for await (const votes of chunkVotes) {
      await connection.getRepository(Vote).insert(votes);
    }
  }
}
