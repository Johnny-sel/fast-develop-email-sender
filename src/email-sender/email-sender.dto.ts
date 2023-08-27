import {ApiProperty} from '@nestjs/swagger';
import {IsString, Length} from 'class-validator';

export class SendDto {
  @ApiProperty()
  @Length(10, 100)
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  @Length(20, 10000)
  text: string;
}
