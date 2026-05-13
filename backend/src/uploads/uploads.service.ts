import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const storageConfig = {
  storage: diskStorage({
    destination: './uploads', // Carpeta donde se guardan
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
};

@Injectable()
export class UploadsService {
  // Aquí podrías añadir lógica para optimizar o redimensionar la imagen si fuera necesario
}