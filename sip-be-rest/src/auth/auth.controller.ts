import { UrlProvider } from '@modules/url/url.provider';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthContext } from './decorator/user-cred.decorator';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './services/auth.service';
import { GoogleUserExtractedDto } from './internal/google-user-extracted';

@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly urlProvider: UrlProvider,
  ) {}

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Res() res: Response,
    @AuthContext() user: GoogleUserExtractedDto,
  ) {
    const loginResponse = await this.authService.loginWithGoogle(user);
    return res.redirect(
      this.urlProvider.getClientSuccessRedirect(loginResponse),
    );
  }
}
