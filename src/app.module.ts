import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './modules/upload/upload.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModule } from './modules/product/product.module';
import { AdminModule } from './modules/admin/admin.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        
        if (databaseUrl) {
          return {
            uri: databaseUrl,
            dialect: 'postgres',
            autoLoadModels: true,
            synchronize: true, // Set to false in production
            dialectOptions: {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            },
          };
        }

        return {
          dialect: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadModels: true,
          synchronize: true, // Set to false in production
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [{
        ttl: config.get<number>('THROTTLE_TTL') || 60000,
        limit: parseInt(config.get('THROTTLE_LIMIT') || '') || 10,
      }],
    }),
    UploadModule,
    ProductModule,
    AdminModule,
    ContactUsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
