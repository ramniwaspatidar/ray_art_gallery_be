import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Table
export class Admin extends Model {
  @ApiProperty({
    description: 'Admin ID',
    example: 1,
    type: Number
  })
  declare id: number;

  @ApiProperty({
    description: 'Admin name',
    example: 'John Doe',
    type: String
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@example.com',
    type: String
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @ApiProperty({
    description: 'Admin password (hashed)',
    example: 'hashedPassword123',
    type: String
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty({
    description: 'Admin role',
    enum: AdminRole,
    example: AdminRole.ADMIN
  })
  @Column({
    type: DataType.ENUM(...Object.values(AdminRole)),
    allowNull: false,
    defaultValue: AdminRole.ADMIN,
  })
  role: AdminRole;

  @ApiProperty({
    description: 'Admin creation date',
    example: '2024-01-15T10:30:00Z',
    type: Date
  })
  declare createdAt: Date;

  @ApiProperty({
    description: 'Admin last update date',
    example: '2024-01-20T14:45:00Z',
    type: Date
  })
  declare updatedAt: Date;
}