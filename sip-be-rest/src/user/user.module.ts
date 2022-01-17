import { BcryptService } from 'src/auth/services/bcrypt.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { PermissionModule } from '@permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PermissionModule],
  controllers: [UserController],
  providers: [UserService, BcryptService],
  exports: [UserService],
})
export class UserModule {}
