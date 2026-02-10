import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateAdminDto {
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
    type: String
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}