import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface AttributesAttributes {
  IdAttributes: number;
  Name?: string;
  Description?: string;
}

export type AttributesPk = "IdAttributes";
export type AttributesId = Attributes[AttributesPk];
export type AttributesOptionalAttributes = "IdAttributes" | "Name" | "Description";
export type AttributesCreationAttributes = Optional<AttributesAttributes, AttributesOptionalAttributes>;

export class Attributes extends Model<AttributesAttributes, AttributesCreationAttributes> implements AttributesAttributes {
  IdAttributes!: number;
  Name?: string;
  Description?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof Attributes {
    return Attributes.init({
    IdAttributes: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_attributes'
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'name'
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
    }
  }, {
    sequelize,
    tableName: 'attributes',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "attributes_pkey",
        unique: true,
        fields: [
          { name: "id_attributes" },
        ]
      },
    ]
  });
  }
}
