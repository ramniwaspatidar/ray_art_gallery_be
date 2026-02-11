import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'contact_us' })
export class ContactUs extends Model {
  @ApiProperty({ example: 'John Doe', description: 'Name of the sender' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email of the sender' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ example: '1234567890', description: 'Mobile number of the sender' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mobile: string;

  @ApiProperty({ example: 'Hello, I have a query.', description: 'Message content' })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;
}
