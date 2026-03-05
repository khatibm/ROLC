import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
          cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
      limits: {
        fileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024,
      },
      fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|pdf|doc|docx/;
        if (allowed.test(extname(file.originalname).toLowerCase())) {
          cb(null, true);
        } else {
          cb(new Error('File type not allowed'), false);
        }
      },
    }),
  ],
  exports: [MulterModule],
})
export class UploadsModule {}
