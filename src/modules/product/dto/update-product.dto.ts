import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory } from '../product.model';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Updated iPhone 15 Pro',
    type: String
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Updated description with new features',
    type: String
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price',
    example: 899.99,
    type: Number
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Original price before discount',
    example: 1099.99,
    type: Number
  })
  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/updated-image.jpg',
    type: String
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Product category',
    enum: ProductCategory,
    example: ProductCategory.RESIN
  })
  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @ApiPropertyOptional({
    description: 'Product sub-category',
    example: 'Updated Smartphones',
    type: String
  })
  @IsString()
  @IsOptional()
  subCategory?: string;
}