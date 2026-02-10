import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<{
    success: boolean;
    message: string;
    data: Product;
  }> {
    const product = await this.productModel.create({ ...createProductDto });
    
    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
  }

  async findAll(filterDto: GetProductsFilterDto): Promise<{
    success: boolean;
    message: string;
    data: Product[];
    pagination: {
      currentPage: number;
      itemsPerPage: number;
      hasMore: boolean;
      offset: number;
      total: number;
    };
  }> {
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

    const result = await this.productModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const hasMore = offset + limit < result.count;

    return {
      success: true,
      message: 'Products fetched successfully',
      data: result.rows,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        hasMore,
        offset,
        total: result.count,
      },
    };
  }

  async findOne(id: number): Promise<{
    success: boolean;
    message: string;
    data: Product | null;
  }> {
    const product = await this.productModel.findByPk(id);
    
    if (!product) {
      return {
        success: false,
        message: 'Product not found',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<{
    success: boolean;
    message: string;
    data: Product | null;
  }> {
    const product = await this.productModel.findByPk(id);
    
    if (!product) {
      return {
        success: false,
        message: 'Product not found',
        data: null,
      };
    }

    await product.update(updateProductDto);
    
    return {
      success: true,
      message: 'Product updated successfully',
      data: product,
    };
  }

  async remove(id: number): Promise<{
    success: boolean;
    message: string;
    data: null;
  }> {
    const product = await this.productModel.findByPk(id);
    
    if (!product) {
      return {
        success: false,
        message: 'Product not found',
        data: null,
      };
    }

    await product.destroy();
    
    return {
      success: true,
      message: 'Product deleted successfully',
      data: null,
    };
  }
}
