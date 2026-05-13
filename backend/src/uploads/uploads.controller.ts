import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from './uploads.service';
import { Response } from 'express';
import { join } from 'path';

@Controller('uploads')
export class UploadsController {
  
  @Post('foto')
  @UseInterceptors(FileInterceptor('file', storageConfig))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    
    return { url: file.filename };
  }

  @Get(':imagename')
  verFoto(@Param('imagename') image, @Res() res: Response) {
    
    return res.sendFile(join(process.cwd(), 'uploads', image));
  }
}