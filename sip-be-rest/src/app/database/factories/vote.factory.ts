import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Vote } from '@vote/vote.entity';

define(
  Vote,
  (faker: typeof Faker, { post, author }: { post: Post; author: User }) => {
    const vote = new Vote();
    vote.post = post;
    vote.author = author;
    vote.isVoted = faker.random.boolean();
    return vote;
  },
);
