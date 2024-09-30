import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TypeCodeAttributes {
  Id: number;
  Type?: string;
  Description?: string;
}

export type TypeCodePk = "Id";
export type TypeCodeId = TypeCode[TypeCodePk];
export type TypeCodeOptionalAttributes = "Id" | "Type" | "Description";
export type TypeCodeCreationAttributes = Optional<TypeCodeAttributes, TypeCodeOptionalAttributes>;

export class TypeCode extends Model<TypeCodeAttributes, TypeCodeCreationAttributes> implements TypeCodeAttributes {
  Id!: number;
  Type?: string;
  Description?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof TypeCode {
    return TypeCode.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    Type: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'type'
    },
    Description: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'description'
    }
  }, {
    sequelize,
    tableName: 'type_code',
    schema: 'user',
    timestamps: false,
    indexes: [
      {
        name: "type_code_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
