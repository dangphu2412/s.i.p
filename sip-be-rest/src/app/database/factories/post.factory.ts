import { PostStatus, ProductRunningStatus } from '@post/enums/post-status.enum';
import { SlugUtils } from '@utils/slug';
import Faker from 'faker';
import { Post } from 'src/post/post.entity';
import { Topic } from 'src/topic/topic.entity';
import { User } from 'src/user/user.entity';
import { define } from 'typeorm-seeding';

let uniqueChar = 0;

define(
  Post,
  (
    faker: typeof Faker,
    { topics, authors }: { topics: Topic[]; authors: User[] },
  ) => {
    const title = faker.commerce.productName() + uniqueChar;
    const previewGalleryImg = faker.image.city(400, 400);
    uniqueChar++;
    const postStatusValues = Object.values(PostStatus);
    const runningStatusValues = Object.values(ProductRunningStatus);
    return Post.create({
      content: faker.lorem.paragraph(1),
      title,
      summary: faker.lorem.lines(1),
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
      status: faker.random.arrayElement(postStatusValues),
      runningStatus: faker.random.arrayElement(runningStatusValues),
    });
  },
);
