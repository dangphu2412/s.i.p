import { Body, Controller, Headers, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './services/auth.service';

@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @Post('/google')
  public loginWithGoogle(@Headers('oauth-google-token') accessToken: string) {
    return this.authService.loginWithGoogle(accessToken);
  }

  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @Post('/login')
  public loginManagement(@Body() loginDto: LoginDto) {
    return this.authService.simpleLogin(loginDto);
  }

  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @Post('/test/get-cred')
  public getTestCredentials() {
    return this.authService.generateTestToken();
  }
}
