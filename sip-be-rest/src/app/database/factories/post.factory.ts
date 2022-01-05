import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Post } from '@modules/post/post.entity';
import { randomUUID } from 'crypto';
import { SlugUtils } from '@utils/slug';

define(Post, (faker: typeof Faker) => {
  const title = faker.commerce.productName() + randomUUID();
  return Post.create({
    content: faker.lorem.paragraph(),
    title,
    summary: faker.lorem.paragraph(1),
    slug: SlugUtils.normalize(title),
  });
});
