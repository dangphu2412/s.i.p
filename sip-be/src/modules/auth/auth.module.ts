import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@modules/config/config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '@modules/users/users.module';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    JwtModule.register({
      secret: ConfigService.get('JWT_SECRET'),
      signOptions: { expiresIn: ConfigService.get('JWT_EXPIRATIONS') },
    }),
    UsersModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, UsersService],
})
export class AuthModule {}
