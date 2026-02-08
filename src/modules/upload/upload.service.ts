import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { S3Service } from './s3.service';
import { UploadFileDto, UploadResponseDto } from './dto/upload.dto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(file: Express.Multer.File, uploadDto: UploadFileDto): Promise<UploadResponseDto> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      // Validate file type and size
      this.validateFile(file);

      // Generate unique key for S3
      const key = this.generateFileKey(file.originalname, uploadDto.category);

      // Upload to S3
      const s3Result = await this.s3Service.uploadFile(file, key);

      // Return response
      return {
        url: s3Result.Location,
        key: s3Result.Key,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date(),
      };
    } catch (error) {
      this.logger.error('Error uploading file:', error);
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
      this.logger.error('Error uploading multiple files:', error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Service.deleteFile(key);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw error;
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    try {
      return await this.s3Service.getSignedUrl(key);
    } catch (error) {
      this.logger.error('Error getting signed URL:', error);
      throw error;
    }
  }

  async listFiles(category?: string): Promise<any[]> {
    try {
      const files = await this.s3Service.listFiles(category);
      return files.map(file => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        etag: file.ETag,
      }));
    } catch (error) {
      this.logger.error('Error listing files:', error);
      throw error;
    }
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

  private generateFileKey(filename: string, category?: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = filename.split('.').pop();
    const baseName = filename.split('.').slice(0, -1).join('.');
    
    const prefix = category ? `${category}/` : 'uploads/';
    return `${prefix}${timestamp}-${randomString}-${baseName}.${extension}`;
  }
}