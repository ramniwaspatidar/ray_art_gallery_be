import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    // Configure AWS S3
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION', 'us-east-1'),
    });
    
    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME', 'ray-gallery-bucket');
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<AWS.S3.ManagedUpload.SendData> {
    try {
      this.logger.log(`Uploading file: ${file.originalname} with key: ${key}`);
      
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', // Make files publicly accessible
      };

      const result = await this.s3.upload(uploadParams).promise();
      this.logger.log(`File uploaded successfully: ${result.Location}`);
      
      return result;
    } catch (error) {
      this.logger.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      this.logger.log(`Deleting file with key: ${key}`);
      
      const deleteParams: AWS.S3.DeleteObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.deleteObject(deleteParams).promise();
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error('Error deleting file from S3:', error);
      throw error;
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      this.logger.log(`Generating signed URL for key: ${key}`);
      
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn,
      };

      const signedUrl = await this.s3.getSignedUrlPromise('getObject', params);
      return signedUrl;
    } catch (error) {
      this.logger.error('Error generating signed URL:', error);
      throw error;
    }
  }

  async listFiles(prefix?: string): Promise<AWS.S3.Object[]> {
    try {
      const params: AWS.S3.ListObjectsV2Request = {
        Bucket: this.bucketName,
        Prefix: prefix,
      };

      const result = await this.s3.listObjectsV2(params).promise();
      return result.Contents || [];
    } catch (error) {
      this.logger.error('Error listing files from S3:', error);
      throw error;
    }
  }
}