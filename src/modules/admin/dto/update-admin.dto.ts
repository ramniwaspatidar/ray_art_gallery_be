import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole } from '../admin.model';

export class UpdateAdminDto {
  @ApiPropertyOptional({
    description: 'Admin name',
    example: 'Updated John Doe',
    type: String
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Admin email address',
    example: 'updated.admin@example.com',
    type: String
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Admin password',
    example: 'newSecurePassword123',
    type: String,
    minLength: 6
  })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Admin role',
    enum: AdminRole,
    example: AdminRole.MODERATOR
  })
  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;
}