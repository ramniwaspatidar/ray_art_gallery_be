import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productModel.create({ ...createProductDto });
  }

  async findAll(filterDto: GetProductsFilterDto): Promise<{ rows: Product[]; count: number }> {
    const { search, category, subCategory, page = 1, limit = 10 } = filterDto;
    const where: any = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (category) {
      where.category = category;
    }

    if (subCategory) {
      where.subCategory = subCategory;
    }

    const offset = (page - 1) * limit;

    return this.productModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }
}
