import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;
}

export class UploadResponseDto {
  url: string;
  key: string;
  filename: string;
  size: number;
  mimetype: string;
  uploadedAt: Date;
}