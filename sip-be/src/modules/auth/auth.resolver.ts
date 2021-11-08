import { Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { OAuth } from './entities/auth.entity';

@Resolver(() => OAuth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
}
