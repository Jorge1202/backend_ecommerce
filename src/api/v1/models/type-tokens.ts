import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TypeTokensAttributes {
  Id: number;
  Name: string;
  Description?: string;
}

export type TypeTokensPk = "Id";
export type TypeTokensId = TypeTokens[TypeTokensPk];
export type TypeTokensOptionalAttributes = "Id" | "Description";
export type TypeTokensCreationAttributes = Optional<TypeTokensAttributes, TypeTokensOptionalAttributes>;

export class TypeTokens extends Model<TypeTokensAttributes, TypeTokensCreationAttributes> implements TypeTokensAttributes {
  Id!: number;
  Name!: string;
  Description?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof TypeTokens {
    return TypeTokens.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    Name: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'name'
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    }
  }, {
    sequelize,
    tableName: 'typeTokens',
    schema: 'user',
    timestamps: false,
    indexes: [
      {
        name: "typeTokens_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
