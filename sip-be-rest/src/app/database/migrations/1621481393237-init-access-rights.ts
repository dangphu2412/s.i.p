import { AccessRights } from '@constants/access-rights.enum';
import { Permission } from '@modules/../../../permission/permission.entity';
import { Role } from '@modules/../../../role/role.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class initRole1621481393237 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let rootAccessRole = new Role();
    rootAccessRole.name = 'Root access';

    let bussinessRole = new Role();
    bussinessRole.name = 'Business';

    rootAccessRole = await queryRunner.manager.save(Role, rootAccessRole);
    bussinessRole = await queryRunner.manager.save(Role, bussinessRole);

    const newRootAccessPermissions: Permission[] = Object.values(
      AccessRights.RootAccess,
    ).map((accessRight) => {
      const permission = new Permission();
      permission.name = accessRight;
      permission.priority = 0;
      permission.role = rootAccessRole;
      return permission;
    });
    const newBusinessAccessPermissions: Permission[] = Object.values(
      AccessRights.Business,
    ).map((accessRight) => {
      const permission = new Permission();
      permission.name = accessRight;
      permission.priority = 0;
      permission.role = bussinessRole;
      return permission;
    });

    await queryRunner.manager.insert(Permission, [
      ...newRootAccessPermissions,
      ...newBusinessAccessPermissions,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.clear(Permission);
  }
}
