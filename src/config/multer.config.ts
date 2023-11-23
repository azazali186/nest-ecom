import { NotAcceptableException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(
        null,
        file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
      );
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/)) {
      return callback(
        new NotAcceptableException({
          statusCode: 406,
          message: 'Only image and pdf files are allowed!',
        }).getResponse(),
        false,
      );
    }
    callback(null, true);
  },
};
