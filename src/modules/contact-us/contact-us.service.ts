import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ContactUs } from './contact-us.entity';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { GetContactUsFilterDto } from './dto/get-contact-us-filter.dto';
import { Op } from 'sequelize';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs)
    private contactUsModel: typeof ContactUs,
  ) {}

  async create(createContactUsDto: CreateContactUsDto): Promise<{
    success: boolean;
    message: string;
    data: ContactUs;
  }> {
    const contactUs = await this.contactUsModel.create({ ...createContactUsDto });
    
    return {
      success: true,
      message: 'Contact request submitted successfully',
      data: contactUs,
    };
  }

  async findAll(filterDto: GetContactUsFilterDto): Promise<{
    success: boolean;
    message: string;
    data: ContactUs[];
    pagination: {
      currentPage: number;
      itemsPerPage: number;
      hasMore: boolean;
      offset: number;
      total: number;
    };
  }> {
    const { search, page = 1, limit = 10 } = filterDto;
    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { message: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const result = await this.contactUsModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const hasMore = offset + limit < result.count;

    return {
      success: true,
      message: 'Contact requests fetched successfully',
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
}
