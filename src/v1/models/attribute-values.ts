import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { CategoryAttributeValues, CategoryAttributeValuesId } from './category-attribute-values';
import type { CustomAttributes, CustomAttributesId } from './custom-attributes';

export interface AttributeValuesAttributes {
  IdAttributeValues: number;
  IdAttribute?: number;
  Value?: string;
}

export type AttributeValuesPk = "IdAttributeValues";
export type AttributeValuesId = AttributeValues[AttributeValuesPk];
export type AttributeValuesOptionalAttributes = "IdAttributeValues" | "IdAttribute" | "Value";
export type AttributeValuesCreationAttributes = Optional<AttributeValuesAttributes, AttributeValuesOptionalAttributes>;

export class AttributeValues extends Model<AttributeValuesAttributes, AttributeValuesCreationAttributes> implements AttributeValuesAttributes {
  IdAttributeValues!: number;
  IdAttribute?: number;
  Value?: string;

  // AttributeValues hasMany CategoryAttributeValues via IdAttributeValue
  CategoryAttributeValues!: CategoryAttributeValues[];
  getCategoryAttributeValues!: Sequelize.HasManyGetAssociationsMixin<CategoryAttributeValues>;
  setCategoryAttributeValues!: Sequelize.HasManySetAssociationsMixin<CategoryAttributeValues, CategoryAttributeValuesId>;
  addCategoryAttributeValue!: Sequelize.HasManyAddAssociationMixin<CategoryAttributeValues, CategoryAttributeValuesId>;
  addCategoryAttributeValues!: Sequelize.HasManyAddAssociationsMixin<CategoryAttributeValues, CategoryAttributeValuesId>;
  createCategoryAttributeValue!: Sequelize.HasManyCreateAssociationMixin<CategoryAttributeValues>;
  removeCategoryAttributeValue!: Sequelize.HasManyRemoveAssociationMixin<CategoryAttributeValues, CategoryAttributeValuesId>;
  removeCategoryAttributeValues!: Sequelize.HasManyRemoveAssociationsMixin<CategoryAttributeValues, CategoryAttributeValuesId>;
  hasCategoryAttributeValue!: Sequelize.HasManyHasAssociationMixin<CategoryAttributeValues, CategoryAttributeValuesId>;
  hasCategoryAttributeValues!: Sequelize.HasManyHasAssociationsMixin<CategoryAttributeValues, CategoryAttributeValuesId>;
  countCategoryAttributeValues!: Sequelize.HasManyCountAssociationsMixin;
  // AttributeValues belongsTo CustomAttributes via IdAttribute
  IdAttributeCustomAttribute!: CustomAttributes;
  getIdAttributeCustomAttribute!: Sequelize.BelongsToGetAssociationMixin<CustomAttributes>;
  setIdAttributeCustomAttribute!: Sequelize.BelongsToSetAssociationMixin<CustomAttributes, CustomAttributesId>;
  createIdAttributeCustomAttribute!: Sequelize.BelongsToCreateAssociationMixin<CustomAttributes>;

  static initModel(sequelize: Sequelize.Sequelize): typeof AttributeValues {
    return AttributeValues.init({
    IdAttributeValues: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_attribute_values '
    },
    IdAttribute: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'attribute_values ',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "attribute_values _pkey",
        unique: true,
        fields: [
          { name: "id_attribute_values " },
        ]
      },
    ]
  });
  }
}
