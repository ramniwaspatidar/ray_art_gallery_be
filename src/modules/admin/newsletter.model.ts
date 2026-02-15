import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface NewsletterCreationAttributes {
  email: string;
}

@Table({ tableName: 'Newsletters' })
export class Newsletter extends Model<Newsletter, NewsletterCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;
}
