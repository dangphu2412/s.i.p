import { SlugUtils } from './../../utils/slug';
import { Permission } from '@permission/permission.entity';
import { User } from '@user/user.entity';
import { internet, name, image, lorem } from 'faker';

export class IterateFactory {
  public static createUser(i: number, permissions: Permission[]): User {
    const user = new User();
    const fullName = name.findName() + i;
    user.email = internet.email(fullName);
    user.avatar =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ87KJTvoZmlpQo-zqqQqFPbUXHqBnJt8xDZg&usqp=CAU';
    user.fullName = fullName;
    user.username = fullName;
    user.hashTag = SlugUtils.normalize(fullName);
    user.permissions = permissions;
    user.password = internet.password();
    user.headline = lorem.words(5);

    return user;
  }
}
