import { Topic } from '@modules/topic/topic.entity';
import { SlugUtils } from '@utils/slug';
import { randomUUID } from 'crypto';
import Faker from 'faker';
import { define } from 'typeorm-seeding';

define(Topic, (faker: typeof Faker) => {
  const name = faker.commerce.productName() + randomUUID();
  const topic = new Topic();
  topic.name = name;
  topic.slug = SlugUtils.normalize(name);
  topic.summary = faker.lorem.paragraph(2);
  return topic;
});
