import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Loan from './loan.model';

export class Customer extends Model {
  public id!: string;
  public companyId!: string;
  public name!: string;
  public email?: string;
  public phone?: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public zipCode?: string;
  public country?: string;
  public dateOfBirth?: Date;
  public idNumber?: string;
  public idType?: string;
  public status!: string;
  public createdBy!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    idNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    idType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'ACTIVE',
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
  }
);

// Define relationship from Customer to Loan (inverse of what we defined in Loan model)
Customer.hasMany(Loan, { foreignKey: 'customerId', as: 'loans' });

export default Customer;