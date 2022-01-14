import Faker, { fake } from 'faker';
import { define } from 'typeorm-seeding';
import { Post } from '@modules/post/post.entity';
import { randomUUID } from 'crypto';
import { SlugUtils } from '@utils/slug';
import { Topic } from '@modules/topic/topic.entity';
import { User } from '@modules/user/user.entity';

define(
  Post,
  (
    faker: typeof Faker,
    { topics, authors }: { topics: Topic[]; authors: User[] },
  ) => {
    const title = faker.commerce.productName() + randomUUID();
    const previewGalleryImg = faker.image.city(400, 400);
    return Post.create({
      content: faker.lorem.paragraph(),
      title,
      summary: faker.lorem.paragraph(1),
      slug: SlugUtils.normalize(title),
      topics: [
        ...new Set([
          faker.random.arrayElement(topics),
          faker.random.arrayElement(topics),
        ]),
      ],
      author: faker.random.arrayElement(authors),
      thumbnail: faker.image.fashion(32, 32),
      galleryImages: [previewGalleryImg, faker.image.city(400, 400)],
      previewGalleryImg: previewGalleryImg,
      productLink: faker.internet.avatar(),
      videoDemo: 'https://www.youtube.com/watch?v=nTtpHxnO9zA',
    });
  },
);
