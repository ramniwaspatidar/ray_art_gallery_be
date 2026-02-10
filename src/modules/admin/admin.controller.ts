import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ValidateAdminDto } from './dto/validate-admin.dto';
import { GetAdminsFilterDto } from './dto/get-admins-filter.dto';
import { Admin } from './admin.model';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiResponse({ 
    status: 201, 
    description: 'Admin created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Admin created successfully' },
        data: {
          type: 'object',
          properties: {
            admin: { $ref: '#/components/schemas/Admin' },
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed or email already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Admin with this email already exists' },
        data: {
          type: 'object',
          properties: {
            admin: { type: 'null', example: null }
          }
        }
      }
    }
  })
  create(@Body() createAdminDto: CreateAdminDto): Promise<{
    success: boolean;
    message: string;
    data: {
      admin: Admin | null;
      accessToken?: string;
    };
  }> {
    return this.adminService.create(createAdminDto);
  }

  @Post('validate')
  @Public()
  @ApiOperation({ summary: 'Validate admin user credentials' })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin validated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Admin validated successfully' },
        data: { $ref: '#/components/schemas/Admin' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Invalid email or password' },
        data: { type: 'null', example: null }
      }
    }
  })
  validate(@Body() validateAdminDto: ValidateAdminDto): Promise<{
    success: boolean;
    message: string;
    data: {
      admin: Admin | null;
      accessToken?: string;
    };
  }> {
    return this.adminService.validateAdmin(validateAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admin users with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by admin name or email' })
  @ApiQuery({ name: 'role', required: false, enum: ['super_admin', 'admin', 'moderator'], description: 'Filter by role' })
  @ApiResponse({
    status: 200,
    description: 'Admins retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Admins fetched successfully' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Admin' }
        },
        pagination: {
          type: 'object',
          properties: {
            currentPage: { type: 'number', example: 1 },
            itemsPerPage: { type: 'number', example: 10 },
            hasMore: { type: 'boolean', example: false },
            offset: { type: 'number', example: 0 },
            total: { type: 'number', example: 5 }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required'
  })
  findAll(@Query() filterDto: GetAdminsFilterDto): Promise<{
    success: boolean;
    message: string;
    data: Admin[];
    pagination: {
      currentPage: number;
      itemsPerPage: number;
      hasMore: boolean;
      offset: number;
      total: number;
    };
  }> {
    return this.adminService.findAll(filterDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated admin user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Current admin retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Admin retrieved successfully' },
        data: { $ref: '#/components/schemas/Admin' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required'
  })
  getCurrentUser(@CurrentUser() user: any): Promise<{
    success: boolean;
    message: string;
    data: Admin | null;
  }> {
    return this.adminService.findOne(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an admin user by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Admin ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Admin retrieved successfully' },
        data: { $ref: '#/components/schemas/Admin' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Admin not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Admin not found' },
        data: { type: 'null', example: null }
      }
    }
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<{
    success: boolean;
    message: string;
    data: Admin | null;
  }> {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an admin user by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Admin ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Admin updated successfully' },
        data: { $ref: '#/components/schemas/Admin' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Admin not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Admin not found' },
        data: { type: 'null', example: null }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed or email already exists' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto
  ): Promise<{
    success: boolean;
    message: string;
    data: Admin | null;
  }> {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin user by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Admin ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Admin deleted successfully' },
        data: { type: 'null', example: null }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Admin not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Admin not found' },
        data: { type: 'null', example: null }
      }
    }
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{
    success: boolean;
    message: string;
    data: null;
  }> {
    return this.adminService.remove(id);
  }
}