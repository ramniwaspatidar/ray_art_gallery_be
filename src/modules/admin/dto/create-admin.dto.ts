import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '../admin.model';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Admin name',
    example: 'John Doe',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@example.com',
    type: String
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'securePassword123',
    type: String,
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'Admin role',
    enum: AdminRole,
    example: AdminRole.ADMIN
  })
  @IsEnum(AdminRole)
  @IsNotEmpty()
  role: AdminRole;
}