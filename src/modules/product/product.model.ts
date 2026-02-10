import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductCategory {
  MANDALA = 'Mandala',
  RESIN = 'Resin',
  LIPPAN = 'Lippan',
}

@Table
export class Product extends Model {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
    type: Number
  })
  declare id: number;

  @ApiProperty({
    description: 'Product name',
    example: 'Beautiful Mandala Art',
    type: String
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Handcrafted mandala art piece with intricate designs',
    type: String
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 299.99,
    type: Number
  })
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @ApiPropertyOptional({
    description: 'Original price before discount',
    example: 399.99,
    type: Number
  })
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  originalPrice: number;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/mandala-art.jpg',
    type: String
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Product category',
    enum: ProductCategory,
    example: ProductCategory.MANDALA
  })
  @Column({
    type: DataType.ENUM(...Object.values(ProductCategory)),
    allowNull: false,
  })
  category: ProductCategory;

  @ApiPropertyOptional({
    description: 'Product sub-category',
    example: 'Wall Art',
    type: String
  })
  @Column({
    type: DataType.STRING,
    allowNull: true, // Subcategory might be optional or string based
  })
  subCategory: string;

  @ApiProperty({
    description: 'Product creation date',
    example: '2024-01-15T10:30:00Z',
    type: Date
  })
  declare createdAt: Date;

  @ApiProperty({
    description: 'Product last update date',
    example: '2024-01-20T14:45:00Z',
    type: Date
  })
  declare updatedAt: Date;
}
