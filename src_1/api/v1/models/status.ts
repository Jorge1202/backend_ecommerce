import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface StatusAttributes {
  Id: number;
  Status?: string;
  Description?: string;
}

export type StatusPk = "Id";
export type StatusId = Status[StatusPk];
export type StatusOptionalAttributes = "Id" | "Status" | "Description";
export type StatusCreationAttributes = Optional<StatusAttributes, StatusOptionalAttributes>;

export class Status extends Model<StatusAttributes, StatusCreationAttributes> implements StatusAttributes {
  Id!: number;
  Status?: string;
  Description?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof Status {
    return Status.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    Status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'status'
    },
    Description: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'description'
    }
  }, {
    sequelize,
    tableName: 'status',
    schema: 'public',
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
