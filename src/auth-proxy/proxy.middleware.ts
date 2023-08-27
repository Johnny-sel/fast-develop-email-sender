import {Injectable, NestMiddleware} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Request, Response, NextFunction} from 'express';
import {createProxyMiddleware, RequestHandler} from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private proxyMiddleware: RequestHandler;

  constructor(private configService: ConfigService) {
    const authService = this.configService.get('AUTH_SERVICE');

    this.proxyMiddleware = createProxyMiddleware({
      target: authService,
      changeOrigin: true,
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/auth')) {
      return this.proxyMiddleware(req, res, next);
    }
    next();
  }
}
