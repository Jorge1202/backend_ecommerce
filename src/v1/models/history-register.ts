import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface HistoryRegisterAttributes {
  Id: number;
  Email?: string;
  Name?: string;
  Firstname?: string;
  Lastname?: string;
  Username?: string;
  StatusRegister?: number;
  DateCreate?: Date;
  DateUpdate?: Date;
  HasPassword?: boolean;
}

export type HistoryRegisterPk = "Id";
export type HistoryRegisterId = HistoryRegister[HistoryRegisterPk];
export type HistoryRegisterOptionalAttributes = "Id" | "Email" | "Name" | "Firstname" | "Lastname" | "Username" | "StatusRegister" | "DateCreate" | "DateUpdate" | "HasPassword";
export type HistoryRegisterCreationAttributes = Optional<HistoryRegisterAttributes, HistoryRegisterOptionalAttributes>;

export class HistoryRegister extends Model<HistoryRegisterAttributes, HistoryRegisterCreationAttributes> implements HistoryRegisterAttributes {
  Id!: number;
  Email?: string;
  Name?: string;
  Firstname?: string;
  Lastname?: string;
  Username?: string;
  StatusRegister?: number;
  DateCreate?: Date;
  DateUpdate?: Date;
  HasPassword?: boolean;


  static initModel(sequelize: Sequelize.Sequelize): typeof HistoryRegister {
    return HistoryRegister.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'email'
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'name'
    },
    Firstname: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'firstname'
    },
    Lastname: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'lastname'
    },
    Username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'username'
    },
    StatusRegister: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      field: 'status_register'
    },
    DateCreate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_create'
    },
    DateUpdate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_update'
    },
    HasPassword: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'has_password'
    }
  }, {
    sequelize,
    tableName: 'history_register',
    schema: 'user',
    timestamps: true, // Utiliza timestamps automáticos
    createdAt: 'DateCreate',
    updatedAt: 'DateUpdate',
    hooks: {
      beforeCreate: (history: HistoryRegister) => {
        const now = new Date();
        history.DateCreate = now;
        history.DateUpdate = now;
      },
      beforeUpdate: (history: HistoryRegister) => {
        history.DateUpdate = new Date();
      }
    },
    indexes: [
      {
        name: "history_register_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
