import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs/internal/Observable';
import { AUTHORIZATION_HEADER } from '../constants';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const accessToken = context.switchToHttp().getRequest().headers[
      AUTHORIZATION_HEADER
    ];

    if (accessToken) {
      return super.canActivate(context);
    }
    return true;
  }
}
