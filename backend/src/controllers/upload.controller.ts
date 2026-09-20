import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary.js';
import { sendError, sendSuccess } from '../utils/response.js';

export class UploadController {
  static async uploadImage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        return sendError(
          res,
          'No image file provided',
          'IMAGE_REQUIRED',
          400
        );
      }

      const uploadResult = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'agri-mitra/crops',
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error('Image upload failed'));
              return;
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );

        stream.end(req.file!.buffer);
      });

      return sendSuccess(
        res,
        {
          imageUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  }
}