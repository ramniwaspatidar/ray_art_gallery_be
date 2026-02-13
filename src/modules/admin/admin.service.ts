import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './admin.model';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ValidateAdminDto } from './dto/validate-admin.dto';
import { GetAdminsFilterDto } from './dto/get-admins-filter.dto';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin)
    private adminModel: typeof Admin,
    private jwtService: JwtService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<{
    success: boolean;
    message: string;
    data: {
      admin: Admin | null;
      accessToken?: string;
    };
  }> {
    // Check if admin with email already exists
    const existingAdmin = await this.adminModel.findOne({
      where: { email: createAdminDto.email }
    });

    if (existingAdmin) {
      return {
        success: false,
        message: 'Admin with this email already exists',
        data: {
          admin: null,
        },
      };
    }

    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createAdminDto.password, saltRounds);

    const admin = await this.adminModel.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    // Generate JWT token
    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };
    const accessToken = this.jwtService.sign(payload);
    
    return {
      success: true,
      message: 'Admin created successfully',
      data: {
        admin,
        accessToken,
      },
    };
  }

  async findAll(filterDto: GetAdminsFilterDto): Promise<{
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
    const { search, role, page = 1, limit = 10 } = filterDto;
    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) {
      where.role = role;
    }

    const offset = (page - 1) * limit;

    const result = await this.adminModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const hasMore = offset + limit < result.count;

    return {
      success: true,
      message: 'Admins fetched successfully',
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
    data: Admin | null;
  }> {
    const admin = await this.adminModel.findByPk(id);
    
    if (!admin) {
      return {
        success: false,
        message: 'Admin not found',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Admin retrieved successfully',
      data: admin,
    };
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<{
    success: boolean;
    message: string;
    data: Admin | null;
  }> {
    const admin = await this.adminModel.findByPk(id);
    
    if (!admin) {
      return {
        success: false,
        message: 'Admin not found',
        data: null,
      };
    }

    // Check if email is being updated and if it already exists
    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
      const existingAdmin = await this.adminModel.findOne({
        where: { email: updateAdminDto.email }
      });

      if (existingAdmin) {
        return {
          success: false,
          message: 'Admin with this email already exists',
          data: null,
        };
      }
    }

    // Hash password if it's being updated
    if (updateAdminDto.password) {
      const saltRounds = 10;
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, saltRounds);
    }

    await admin.update(updateAdminDto);
    
    return {
      success: true,
      message: 'Admin updated successfully',
      data: admin,
    };
  }

  async remove(id: number): Promise<{
    success: boolean;
    message: string;
    data: null;
  }> {
    const admin = await this.adminModel.findByPk(id);
    
    if (!admin) {
      return {
        success: false,
        message: 'Admin not found',
        data: null,
      };
    }

    await admin.destroy();
    
    return {
      success: true,
      message: 'Admin deleted successfully',
      data: null,
    };
  }

  async validateAdmin(validateAdminDto: ValidateAdminDto): Promise<{
    success: boolean;
    message: string;
    data: {
      admin: Admin | null;
      accessToken?: string;
    };
  }> {
    try {
      console.log('Validating admin with email:', validateAdminDto.email);
      const admin = await this.adminModel.findOne({
        where: { email: validateAdminDto.email },
        raw: true
      });

      if (!admin) {
        console.warn('Admin validation failed: Email not found');
        return {
          success: false,
          message: 'Invalid email or password',
          data: {
            admin: null,
          },
        };
      }

      // Check if password exists in the retrieved admin record
      if (!admin.password || !validateAdminDto.password) {
        console.warn('Admin validation failed: Missing password in record or input');
        return {
          success: false,
          message: 'Invalid email or password',
          data: {
            admin: null,
          },
        };
      }

      // Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(validateAdminDto.password, admin.password);

      if (!isPasswordValid) {
        console.warn('Admin validation failed: Invalid password');
        return {
          success: false,
          message: 'Invalid email or password',
          data: {
            admin: null,
          },
        };
      }

      // Generate JWT token
      const payload = {
        sub: admin.id,
        email: admin.email,
        role: admin.role,
      };
      
      console.log('Generating JWT token for admin:', admin.id);
      const accessToken = this.jwtService.sign(payload);

      // Fetch the full admin instance for return
      const adminInstance = await this.adminModel.findByPk(admin.id);

      console.log('Admin validated successfully:', admin.id);
      return {
        success: true,
        message: 'Admin validated successfully',
        data: {
          admin: adminInstance,
          accessToken,
        },
      };
    } catch (error) {
      console.error('Error in validateAdmin service:', error);
      throw error; // Re-throw to let the controller/filter handle it, but now we have logs
    }
  }
}