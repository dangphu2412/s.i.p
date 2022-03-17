import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '@notification/notification.module';
import { PermissionModule } from '@permission/permission.module';
import { BcryptService } from 'src/auth/services/bcrypt.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PermissionModule,
    NotificationModule,
  ],
  controllers: [UserController],
  providers: [UserService, BcryptService],
  exports: [UserService],
})
export class UserModule {}
