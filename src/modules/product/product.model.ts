import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum ProductCategory {
  MANDALA = 'Mandala',
  RESIN = 'Resin',
  LIPPAN = 'Lippan',
}

@Table
export class Product extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  originalPrice: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProductCategory)),
    allowNull: false,
  })
  category: ProductCategory;

  @Column({
    type: DataType.STRING,
    allowNull: true, // Subcategory might be optional or string based
  })
  subCategory: string;
}
