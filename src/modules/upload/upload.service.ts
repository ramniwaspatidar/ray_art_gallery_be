import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { UploadFileDto, UploadResponseDto } from './dto/upload.dto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  async uploadFile(file: Express.Multer.File, uploadDto: UploadFileDto): Promise<UploadResponseDto> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      this.validateFile(file);

      const result = await this.uploadToCloudinary(file, uploadDto.category);

      return {
        url: result.secure_url,
        key: result.public_id,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date(),
      };
    } catch (error) {
      this.logger.error('Error uploading file to Cloudinary:', error);
      throw error;
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[], uploadDto: UploadFileDto): Promise<UploadResponseDto[]> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided');
      }

      const uploadPromises = files.map(file => this.uploadFile(file, uploadDto));
      return await Promise.all(uploadPromises);
    } catch (error) {
      this.logger.error('Error uploading multiple files to Cloudinary:', error);
      throw error;
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`File deleted successfully from Cloudinary: ${publicId}`);
    } catch (error) {
      this.logger.error('Error deleting file from Cloudinary:', error);
      throw error;
    }
  }

  private async uploadToCloudinary(file: Express.Multer.File, folder?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || 'uploads',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  private validateFile(file: Express.Multer.File): void {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'text/plain',
      'video/mp4',
      'video/webm',
    ];

    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type '${file.mimetype}' not allowed`);
    }
  }
}