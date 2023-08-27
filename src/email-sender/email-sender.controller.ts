import {Request, Response} from 'express';
import {SendDto} from './email-sender.dto';
import {EmailSenderService} from './email-sender.service';
import {Controller, UseInterceptors} from '@nestjs/common';
import {HttpCode, HttpStatus} from '@nestjs/common';
import {UploadedFiles} from '@nestjs/common';
import {Post, Query, Req, Res} from '@nestjs/common';
import {FilesInterceptor} from '@nestjs/platform-express';
import {multerConfig} from '../multer/multer.config';
import {ApiCookieAuth, ApiTags} from '@nestjs/swagger';

@ApiTags('email-sender')
@Controller('email-sender')
export class EmailSenderController {
  constructor(private emailSenderService: EmailSenderService) {}

  @ApiCookieAuth()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 3, multerConfig))
  @Post('/send')
  async sendEmail(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response,
    @UploadedFiles() files: Express.Multer.File[],
    @Query() dto: SendDto
  ) {
    await this.emailSenderService.sendEmail(req['user'], dto, files);
    res.send('ok');
  }
}
