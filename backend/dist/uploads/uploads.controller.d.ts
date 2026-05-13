import { Response } from 'express';
export declare class UploadsController {
    uploadFile(file: Express.Multer.File): {
        url: string;
    };
    verFoto(image: any, res: Response): void;
}
