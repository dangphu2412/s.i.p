import { AccessRights } from '@constants/access-rights.enum';
import { Permission } from '@permission/permission.entity';
import { Role } from '@role/role.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class initRole1621481393237 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let rootAccessRole = new Role();
    rootAccessRole.name = 'Root access';

    let businessRole = new Role();
    businessRole.name = 'Business';

    rootAccessRole = await queryRunner.manager.save(Role, rootAccessRole);
    businessRole = await queryRunner.manager.save(Role, businessRole);

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
      permission.role = businessRole;
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
