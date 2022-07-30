import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments

    if (err || !user) {
      if (info['message'] === 'invalid token') {
        info['invalidToken'] = true;
      }
      if (info['message'] === 'jwt expired') {
        info['expiredToken'] = true;
      }
      throw err || new UnauthorizedException(info);
    }
    return user;
  }
}
