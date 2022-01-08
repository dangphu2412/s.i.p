import { AccessRights } from '@constants/access-rights.enum';
import { BcryptService } from '@modules/auth/services/bcrypt.service';
import { Permission } from '@modules/permission/permission.entity';
import { User } from '@modules/user/user.entity';
import { Connection, In } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateUsers implements Seeder {
  private notAdmin(access: keyof typeof AccessRights.RootAccess): boolean {
    return access !== AccessRights.RootAccess.ADMIN;
  }

  public async run(factory: Factory, connection: Connection): Promise<any> {
    const commonPermissions = await connection.getRepository(Permission).find({
      where: {
        name: In(Object.values(AccessRights.RootAccess).filter(this.notAdmin)),
      },
    });

    const password = await new BcryptService().hash('Sgroup123@@');

    await factory(User)({
      permissions: commonPermissions,
      password,
    }).createMany(10);
  }
}
