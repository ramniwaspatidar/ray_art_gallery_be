import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './admin.model';
import { Newsletter } from './newsletter.model';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([Admin, Newsletter]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET') || 'default-secret-key',
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
  exports: [AdminService, JwtStrategy],
})
export class AdminModule {}