import { PermissionModule } from '@modules/permission/permission.module';
import { UrlModule } from '@modules/url/url.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '../external/config/config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { BcryptService } from './services/bcrypt.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ConfigService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: ConfigService.get('JWT_EXPIRATION'),
      },
    }),
    UserModule,
    PermissionModule,
    UrlModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, BcryptService],
})
export class AuthModule {}
