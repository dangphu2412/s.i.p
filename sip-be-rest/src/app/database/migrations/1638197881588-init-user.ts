import { AccessRights } from '@constants/access-rights.enum';
import { ConfigService } from '@external/config/config.service';
import { BcryptService } from 'src/auth/services/bcrypt.service';
import { Permission } from '@modules/permission/permission.entity';
import { User } from '@modules/user/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class initUser1638197881588 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminPermission = await queryRunner.manager.findOne(Permission, {
      where: {
        name: AccessRights.RootAccess.ADMIN,
      },
    });

    const user = new User();
    user.username = 'admin@gmail.com';
    user.email = 'admin@gmail.com';
    user.fullName = 'admin';
    user.password = await new BcryptService().hash('Sgroup123@@');
    user.permissions = [adminPermission];
    user.avatar = ConfigService.get('DEFAULT_AVATAR');
    queryRunner.manager.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, {
      where: {
        username: 'admin@gmail.com',
      },
    });
  }
}
