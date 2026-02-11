import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactUsDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the person contacting' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email address of the person contacting' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1234567890', description: 'The mobile number of the person contacting' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be 10 digits' })
  mobile: string;

  @ApiProperty({ example: 'I would like to know more about your products.', description: 'The message from the person contacting' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
