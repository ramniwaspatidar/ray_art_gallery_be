import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory } from '../product.model';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Latest iPhone with advanced features',
    type: String
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
    type: Number
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({
    description: 'Original price before discount',
    example: 1199.99,
    type: Number
  })
  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
    type: String
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Product category',
    enum: ProductCategory,
    example: ProductCategory.MANDALA
  })
  @IsEnum(ProductCategory)
  @IsNotEmpty()
  category: ProductCategory;

  @ApiProperty({
    description: 'Product sub-category',
    example: 'Smartphones',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  subCategory: string;

  @ApiPropertyOptional({
    description: 'Product features',
    example: ['Water resistant', 'Long battery life'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];
}
