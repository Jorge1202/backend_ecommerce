import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface StatusRegisterAttributes {
  Id: number;
  Status?: string;
  Description?: string;
}

export type StatusRegisterPk = "Id";
export type StatusRegisterId = StatusRegister[StatusRegisterPk];
export type StatusRegisterOptionalAttributes = "Id" | "Status" | "Description";
export type StatusRegisterCreationAttributes = Optional<StatusRegisterAttributes, StatusRegisterOptionalAttributes>;

export class StatusRegister extends Model<StatusRegisterAttributes, StatusRegisterCreationAttributes> implements StatusRegisterAttributes {
  Id!: number;
  Status?: string;
  Description?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof StatusRegister {
    return StatusRegister.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'status'
    },
    Description: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'description'
    }
  }, {
    sequelize,
    tableName: 'status_register',
    schema: 'user',
    timestamps: false,
    indexes: [
      {
        name: "status_register_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
