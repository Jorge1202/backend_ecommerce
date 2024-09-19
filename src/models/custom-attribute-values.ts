import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { CustomAttributes, CustomAttributesId } from './custom-attributes';
import type { Products, ProductsId } from './products';

export interface CustomAttributeValuesAttributes {
  IdCustomAttributeValues: number;
  IdProduct: string;
  IdAttribute: number;
  Value?: string;
}

export type CustomAttributeValuesPk = "IdCustomAttributeValues";
export type CustomAttributeValuesId = CustomAttributeValues[CustomAttributeValuesPk];
export type CustomAttributeValuesOptionalAttributes = "IdCustomAttributeValues" | "Value";
export type CustomAttributeValuesCreationAttributes = Optional<CustomAttributeValuesAttributes, CustomAttributeValuesOptionalAttributes>;

export class CustomAttributeValues extends Model<CustomAttributeValuesAttributes, CustomAttributeValuesCreationAttributes> implements CustomAttributeValuesAttributes {
  IdCustomAttributeValues!: number;
  IdProduct!: string;
  IdAttribute!: number;
  Value?: string;

  // CustomAttributeValues belongsTo CustomAttributes via IdAttribute
  IdAttributeCustomAttribute!: CustomAttributes;
  getIdAttributeCustomAttribute!: Sequelize.BelongsToGetAssociationMixin<CustomAttributes>;
  setIdAttributeCustomAttribute!: Sequelize.BelongsToSetAssociationMixin<CustomAttributes, CustomAttributesId>;
  createIdAttributeCustomAttribute!: Sequelize.BelongsToCreateAssociationMixin<CustomAttributes>;
  // CustomAttributeValues belongsTo Products via IdProduct
  IdProductProduct!: Products;
  getIdProductProduct!: Sequelize.BelongsToGetAssociationMixin<Products>;
  setIdProductProduct!: Sequelize.BelongsToSetAssociationMixin<Products, ProductsId>;
  createIdProductProduct!: Sequelize.BelongsToCreateAssociationMixin<Products>;

  static initModel(sequelize: Sequelize.Sequelize): typeof CustomAttributeValues {
    return CustomAttributeValues.init({
    IdCustomAttributeValues: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_custom_attribute_values'
    },
    IdProduct: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id_product'
      },
      field: 'id_product'
    },
    IdAttribute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'custom_attributes',
        key: 'id_custom_attributes'
      },
      field: 'id_attribute'
    },
    Value: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'value'
    }
  }, {
    sequelize,
    tableName: 'custom_attribute_values',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "custom_attribute_values_pkey",
        unique: true,
        fields: [
          { name: "id_custom_attribute_values" },
        ]
      },
    ]
  });
  }
}
