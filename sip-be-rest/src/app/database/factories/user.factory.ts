import { User } from 'src/user/user.entity';
import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Permission } from '@permission/permission.entity';

define(
  User,
  (
    faker: typeof Faker,
    { permissions, password }: { permissions: Permission[]; password: string },
  ) => {
    const user = new User();
    const fullName = faker.name.findName();
    user.email = faker.internet.email(fullName);
    user.avatar = faker.image.avatar();
    user.fullName = fullName;
    user.username = fullName;
    user.hashTag = fullName;
    user.permissions = permissions;
    user.password = password;

    return user;
  },
);
