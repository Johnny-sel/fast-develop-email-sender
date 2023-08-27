import {ForbiddenException, Injectable} from '@nestjs/common';
import {InternalServerErrorException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {SendDto} from './email-sender.dto';
import {ERRORS} from '../common/enums/errors.enum';
import {User} from '../common/types/user.type';

import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailSenderService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendEmail(
    user: User,
    dto: SendDto,
    files: Express.Multer.File[]
  ) {
    try {
      if (!user?.id || !user?.email) {
        throw new ForbiddenException(ERRORS.ACCESS_DENIED);
      }

      const attachments = files.map(file => ({
        filename: file.originalname,
        content: file.buffer,
      }));

      await this.transporter.sendMail({
        to: this.configService.get('EMAIL_USER'),
        subject: dto.subject,
        text: dto.text,
        html: this.getHtmlTemplateMessage(dto, user.email),
        attachments: attachments,
      });
    } catch (error) {
      console.error('[error]: sendEmail', error);
      throw new InternalServerErrorException('Error sending email');
    }
  }

  getHtmlTemplateMessage(dto: SendDto, from: string) {
    return `
      <span>From: ${from}</span>
      <br>
      <span>Message: ${dto.text}</span>
    `;
  }
}
