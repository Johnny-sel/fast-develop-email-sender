// user.middleware.ts
import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {HttpService} from '@nestjs/axios';
import {firstValueFrom} from 'rxjs';
import {User} from '../common/types/user.type';
import {ERRORS} from '../common/enums/errors.enum';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const cookies = req.headers.cookie;
    const options = {headers: {Cookie: cookies}, withCredentials: true};
    const url = this.configService.get('AUTH_SERVICE_GET_USER_URL');

    try {
      const resObservable = this.httpService.get<{user: User}>(url, options);
      const res = await firstValueFrom(resObservable);

      if (!res.data.user) {
        throw ERRORS.ACCESS_DENIED;
      }

      req['user'] = res.data.user;
      next();
    } catch (error) {
      console.error('[error] AuthMiddleware use:', error);
      res
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .status(401)
        .send(ERRORS.ACCESS_DENIED);
    }
  }
}
