import { Topic } from 'src/topic/topic.entity';
import { SlugUtils } from '@utils/slug';
import Faker from 'faker';
import { define } from 'typeorm-seeding';

let uniqueChar = 0;

define(Topic, (faker: typeof Faker) => {
  const name = faker.commerce.productName() + uniqueChar;
  const topic = new Topic();
  topic.name = name;
  topic.slug = SlugUtils.normalize(name);
  topic.summary = faker.lorem.paragraph(2);
  topic.avatar = faker.image.imageUrl();
  uniqueChar++;
  return topic;
});
