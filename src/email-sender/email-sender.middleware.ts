import {Injectable, NestMiddleware, BadRequestException} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {validate} from 'class-validator';
import {plainToInstance} from 'class-transformer';
import {SendDto} from './email-sender.dto';

@Injectable()
export class ValidateBeforeMulterInterceptorMiddleware
  implements NestMiddleware
{
  async use(
    req: Request<{}, {}, {}, SendDto>,
    _: Response,
    next: NextFunction
  ) {
    const dto = plainToInstance(SendDto, req.query);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    next();
  }
}
