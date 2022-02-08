import {
  PostStatus,
  PricingType,
  ProductRunningStatus,
} from '@post/enums/post-status.enum';
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
    const author = faker.random.arrayElement(authors);
    return Post.create({
      content: faker.lorem.paragraph(1),
      title,
      summary: faker.lorem.words(5),
      slug: SlugUtils.normalize(title),
      description: faker.lorem.lines(2),
      topics: [
        ...new Set([
          faker.random.arrayElement(topics),
          faker.random.arrayElement(topics),
        ]),
      ],
      author,
      thumbnail: faker.image.fashion(32, 32),
      galleryImages: [previewGalleryImg, faker.image.city(400, 400)],
      socialPreviewImage: previewGalleryImg,
      productLink: faker.internet.avatar(),
      makers: [...new Set([author, faker.random.arrayElement(authors)])],
      isAuthorAlsoMaker: true,
      facebookLink: 'https://www.facebook.com/',
      pricingType: faker.random.arrayElement(Object.values(PricingType)),
      videoLink: 'https://www.youtube.com/embed/nTtpHxnO9zA',
      status: faker.random.arrayElement(postStatusValues),
      runningStatus: faker.random.arrayElement(runningStatusValues),
    });
  },
);
