import {InternalServerErrorException} from '@nestjs/common';
import {MulterOptions} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {diskStorage} from 'multer';

export const multerConfig: MulterOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
      cb(null, true);
    } else {
      cb(new InternalServerErrorException('Invalid file type!'), false);
    }
  },

  storage: diskStorage({
    destination: './uploads',
    filename: (_, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
};
