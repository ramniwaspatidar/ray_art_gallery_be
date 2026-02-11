import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactUsController } from './contact-us.controller';
import { ContactUsService } from './contact-us.service';
import { ContactUs } from './contact-us.entity';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ContactUs]),
    AdminModule,
  ],
  controllers: [ContactUsController],
  providers: [ContactUsService],
})
export class ContactUsModule {}
