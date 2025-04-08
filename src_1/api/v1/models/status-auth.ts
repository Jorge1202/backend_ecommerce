import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface StatusAuthAttributes {
  Id: number;
  Status?: string;
  Description?: string;
}

export type StatusAuthPk = "Id";
export type StatusAuthId = StatusAuth[StatusAuthPk];
export type StatusAuthOptionalAttributes = "Id" | "Status" | "Description";
export type StatusAuthCreationAttributes = Optional<StatusAuthAttributes, StatusAuthOptionalAttributes>;

export class StatusAuth extends Model<StatusAuthAttributes, StatusAuthCreationAttributes> implements StatusAuthAttributes {
  Id!: number;
  Status?: string;
  Description?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof StatusAuth {
    return StatusAuth.init({
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
    tableName: 'status_auth',
    schema: 'user',
    timestamps: false,
    indexes: [
      {
        name: "status_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
