import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/create-auth.input';
import { OAuth } from './entities/auth.entity';

@Resolver(() => OAuth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => OAuth)
  public loginGoogle(@Args('authInput') authInput: AuthInput) {
    return this.authService.validateGoogleAccessTokenThenGetAuthCredentials(
      authInput.accessToken,
    );
  }

  @Mutation(() => OAuth)
  public getTestToken() {
    return this.authService.getCredentialsTest();
  }
}
