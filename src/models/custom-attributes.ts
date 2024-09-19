import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { AttributeValues, AttributeValuesId } from './attribute-values';
import type { CustomAttributeValues, CustomAttributeValuesId } from './custom-attribute-values';

export interface CustomAttributesAttributes {
  IdCustomAttributes: number;
  Name: string;
}

export type CustomAttributesPk = "IdCustomAttributes";
export type CustomAttributesId = CustomAttributes[CustomAttributesPk];
export type CustomAttributesOptionalAttributes = "IdCustomAttributes";
export type CustomAttributesCreationAttributes = Optional<CustomAttributesAttributes, CustomAttributesOptionalAttributes>;

export class CustomAttributes extends Model<CustomAttributesAttributes, CustomAttributesCreationAttributes> implements CustomAttributesAttributes {
  IdCustomAttributes!: number;
  Name!: string;

  // CustomAttributes hasMany AttributeValues via IdAttribute
  AttributeValues!: AttributeValues[];
  getAttributeValues!: Sequelize.HasManyGetAssociationsMixin<AttributeValues>;
  setAttributeValues!: Sequelize.HasManySetAssociationsMixin<AttributeValues, AttributeValuesId>;
  addAttributeValue!: Sequelize.HasManyAddAssociationMixin<AttributeValues, AttributeValuesId>;
  addAttributeValues!: Sequelize.HasManyAddAssociationsMixin<AttributeValues, AttributeValuesId>;
  createAttributeValue!: Sequelize.HasManyCreateAssociationMixin<AttributeValues>;
  removeAttributeValue!: Sequelize.HasManyRemoveAssociationMixin<AttributeValues, AttributeValuesId>;
  removeAttributeValues!: Sequelize.HasManyRemoveAssociationsMixin<AttributeValues, AttributeValuesId>;
  hasAttributeValue!: Sequelize.HasManyHasAssociationMixin<AttributeValues, AttributeValuesId>;
  hasAttributeValues!: Sequelize.HasManyHasAssociationsMixin<AttributeValues, AttributeValuesId>;
  countAttributeValues!: Sequelize.HasManyCountAssociationsMixin;
  // CustomAttributes hasMany CustomAttributeValues via IdAttribute
  CustomAttributeValues!: CustomAttributeValues[];
  getCustomAttributeValues!: Sequelize.HasManyGetAssociationsMixin<CustomAttributeValues>;
  setCustomAttributeValues!: Sequelize.HasManySetAssociationsMixin<CustomAttributeValues, CustomAttributeValuesId>;
  addCustomAttributeValue!: Sequelize.HasManyAddAssociationMixin<CustomAttributeValues, CustomAttributeValuesId>;
  addCustomAttributeValues!: Sequelize.HasManyAddAssociationsMixin<CustomAttributeValues, CustomAttributeValuesId>;
  createCustomAttributeValue!: Sequelize.HasManyCreateAssociationMixin<CustomAttributeValues>;
  removeCustomAttributeValue!: Sequelize.HasManyRemoveAssociationMixin<CustomAttributeValues, CustomAttributeValuesId>;
  removeCustomAttributeValues!: Sequelize.HasManyRemoveAssociationsMixin<CustomAttributeValues, CustomAttributeValuesId>;
  hasCustomAttributeValue!: Sequelize.HasManyHasAssociationMixin<CustomAttributeValues, CustomAttributeValuesId>;
  hasCustomAttributeValues!: Sequelize.HasManyHasAssociationsMixin<CustomAttributeValues, CustomAttributeValuesId>;
  countCustomAttributeValues!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof CustomAttributes {
    return CustomAttributes.init({
    IdCustomAttributes: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_custom_attributes'
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name'
    }
  }, {
    sequelize,
    tableName: 'custom_attributes',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "product_attributes_pkey",
        unique: true,
        fields: [
          { name: "id_custom_attributes" },
        ]
      },
    ]
  });
  }
}
