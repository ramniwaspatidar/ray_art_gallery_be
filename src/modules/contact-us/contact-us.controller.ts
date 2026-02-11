import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { GetContactUsFilterDto } from './dto/get-contact-us-filter.dto';

@ApiTags('contact-us')
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact request' })
  @ApiResponse({ status: 201, description: 'The contact request has been successfully created.' })
  @UsePipes(ValidationPipe)
  create(@Body() createContactUsDto: CreateContactUsDto) {
    return this.contactUsService.create(createContactUsDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all contact requests with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all contact requests.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  findAll(@Query() filterDto: GetContactUsFilterDto) {
    return this.contactUsService.findAll(filterDto);
  }
}
