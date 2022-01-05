import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Vote } from '@modules/vote/vote.entity';
import { Post } from '@modules/post/post.entity';
import { User } from '@modules/user/user.entity';

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
