import { Body, Controller, Get, Post, Put, Delete, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Product } from './product.model';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Product created successfully' },
        data: { $ref: '#/components/schemas/Product' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed'
  })
  create(@Body() createProductDto: CreateProductDto): Promise<{
    success: boolean;
    message: string;
    data: Product;
  }> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by product name' })
  @ApiQuery({ name: 'category', required: false, enum: ['Mandala', 'Resin', 'Lippan'], description: 'Filter by category' })
  @ApiQuery({ name: 'subCategory', required: false, type: String, description: 'Filter by sub-category' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Products fetched successfully' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Product' }
        },
        pagination: {
          type: 'object',
          properties: {
            currentPage: { type: 'number', example: 1 },
            itemsPerPage: { type: 'number', example: 10 },
            hasMore: { type: 'boolean', example: false },
            offset: { type: 'number', example: 0 },
            total: { type: 'number', example: 100 }
          }
        }
      }
    }
  })
  findAll(@Query() filterDto: GetProductsFilterDto): Promise<{
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
    return this.productService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Product retrieved successfully' },
        data: { $ref: '#/components/schemas/Product' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Product not found' },
        data: { type: 'null', example: null }
      }
    }
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<{
    success: boolean;
    message: string;
    data: Product | null;
  }> {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Product updated successfully' },
        data: { $ref: '#/components/schemas/Product' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Product not found' },
        data: { type: 'null', example: null }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed'
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<{
    success: boolean;
    message: string;
    data: Product | null;
  }> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Product deleted successfully' },
        data: { type: 'null', example: null }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Product not found' },
        data: { type: 'null', example: null }
      }
    }
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{
    success: boolean;
    message: string;
    data: null;
  }> {
    return this.productService.remove(id);
  }
}
