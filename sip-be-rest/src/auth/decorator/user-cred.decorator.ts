import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserCredential } from '../client/user-cred';

export const AuthContext = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserCredential => {
    return ctx.switchToHttp().getRequest()?.user;
  },
);
