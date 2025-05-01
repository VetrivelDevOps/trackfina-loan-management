import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Loan extends Model {
  public id!: number;
  public userId!: number;
  public amount!: number;
  public interestRate!: number;
  public term!: number;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Loan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    interestRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'loans',
    timestamps: true,
  }
);