import {MiddlewareConsumer, Module} from '@nestjs/common';
import {NestModule, RequestMethod} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {EmailSenderModule} from './email-sender/email-sender.module';
import {HttpModule} from '@nestjs/axios';
import {AuthMiddleware} from './auth-proxy/auth.middleware';
import {ValidateBeforeMulterInterceptorMiddleware} from './email-sender/email-sender.middleware';
import {ProxyMiddleware} from './auth-proxy/proxy.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    EmailSenderModule,
    HttpModule,
  ],
  controllers: [],
  providers: [ProxyMiddleware, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: '*', method: RequestMethod.ALL})
      .apply(ValidateBeforeMulterInterceptorMiddleware)
      .forRoutes('email-sender/send');
  }
}
