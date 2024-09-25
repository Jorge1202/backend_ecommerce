import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { AttributeValues, AttributeValuesId } from './attribute-values';
import type { Categories, CategoriesId } from './categories';
import type { ProductAttributeValues, ProductAttributeValuesId } from './product-attribute-values';

export interface CategoryAttributeValuesAttributes {
  IdCategoryAttributeValues: number;
  IdCategory: number;
  IdAttributeValue: number;
}

export type CategoryAttributeValuesPk = "IdCategoryAttributeValues";
export type CategoryAttributeValuesId = CategoryAttributeValues[CategoryAttributeValuesPk];
export type CategoryAttributeValuesOptionalAttributes = "IdCategoryAttributeValues";
export type CategoryAttributeValuesCreationAttributes = Optional<CategoryAttributeValuesAttributes, CategoryAttributeValuesOptionalAttributes>;

export class CategoryAttributeValues extends Model<CategoryAttributeValuesAttributes, CategoryAttributeValuesCreationAttributes> implements CategoryAttributeValuesAttributes {
  IdCategoryAttributeValues!: number;
  IdCategory!: number;
  IdAttributeValue!: number;

  // CategoryAttributeValues belongsTo AttributeValues via IdAttributeValue
  IdAttributeValueAttributeValues!: AttributeValues;
  getIdAttributeValueAttributeValues!: Sequelize.BelongsToGetAssociationMixin<AttributeValues>;
  setIdAttributeValueAttributeValues!: Sequelize.BelongsToSetAssociationMixin<AttributeValues, AttributeValuesId>;
  createIdAttributeValueAttributeValues!: Sequelize.BelongsToCreateAssociationMixin<AttributeValues>;
  // CategoryAttributeValues belongsTo Categories via IdCategory
  IdCategoryCategory!: Categories;
  getIdCategoryCategory!: Sequelize.BelongsToGetAssociationMixin<Categories>;
  setIdCategoryCategory!: Sequelize.BelongsToSetAssociationMixin<Categories, CategoriesId>;
  createIdCategoryCategory!: Sequelize.BelongsToCreateAssociationMixin<Categories>;
  // CategoryAttributeValues hasMany ProductAttributeValues via IdValue
  ProductAttributeValues!: ProductAttributeValues[];
  getProductAttributeValues!: Sequelize.HasManyGetAssociationsMixin<ProductAttributeValues>;
  setProductAttributeValues!: Sequelize.HasManySetAssociationsMixin<ProductAttributeValues, ProductAttributeValuesId>;
  addProductAttributeValue!: Sequelize.HasManyAddAssociationMixin<ProductAttributeValues, ProductAttributeValuesId>;
  addProductAttributeValues!: Sequelize.HasManyAddAssociationsMixin<ProductAttributeValues, ProductAttributeValuesId>;
  createProductAttributeValue!: Sequelize.HasManyCreateAssociationMixin<ProductAttributeValues>;
  removeProductAttributeValue!: Sequelize.HasManyRemoveAssociationMixin<ProductAttributeValues, ProductAttributeValuesId>;
  removeProductAttributeValues!: Sequelize.HasManyRemoveAssociationsMixin<ProductAttributeValues, ProductAttributeValuesId>;
  hasProductAttributeValue!: Sequelize.HasManyHasAssociationMixin<ProductAttributeValues, ProductAttributeValuesId>;
  hasProductAttributeValues!: Sequelize.HasManyHasAssociationsMixin<ProductAttributeValues, ProductAttributeValuesId>;
  countProductAttributeValues!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof CategoryAttributeValues {
    return CategoryAttributeValues.init({
    IdCategoryAttributeValues: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_category_attribute_values'
    },
    IdCategory: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id_categories'
      },
      field: 'id_category'
    },
    IdAttributeValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'attribute_values ',
        key: 'id_attribute_values '
      },
      field: 'id_attribute_value'
    }
  }, {
    sequelize,
    tableName: 'category_attribute_values',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "category_attribute_values_pkey",
        unique: true,
        fields: [
          { name: "id_category_attribute_values" },
        ]
      },
    ]
  });
  }
}
