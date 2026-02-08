import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadFileDto, UploadResponseDto } from './dto/upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
  ): Promise<UploadResponseDto> {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      return await this.uploadService.uploadFile(file, uploadDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to upload file',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadDto: UploadFileDto,
  ): Promise<UploadResponseDto[]> {
    try {
      if (!files || files.length === 0) {
        throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
      }

      return await this.uploadService.uploadMultipleFiles(files, uploadDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to upload files',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('file/:key')
  async deleteFile(@Param('key') key: string): Promise<{ message: string }> {
    try {
      // Decode the key parameter in case it's URL encoded
      const decodedKey = decodeURIComponent(key);
      await this.uploadService.deleteFile(decodedKey);
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete file',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('signed-url/:key')
  async getSignedUrl(@Param('key') key: string): Promise<{ url: string }> {
    try {
      const decodedKey = decodeURIComponent(key);
      const url = await this.uploadService.getSignedUrl(decodedKey);
      return { url };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to generate signed URL',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('files')
  async listFiles(@Query('category') category?: string): Promise<any[]> {
    try {
      return await this.uploadService.listFiles(category);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to list files',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}