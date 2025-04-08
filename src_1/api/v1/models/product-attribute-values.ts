import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { CategoryAttributeValues, CategoryAttributeValuesId } from './category-attribute-values';
import type { Products, ProductsId } from './products';

export interface ProductAttributeValuesAttributes {
  IdProductAttributeValues: number;
  IdProducto: string;
  IdValue: number;
}

export type ProductAttributeValuesPk = "IdProductAttributeValues";
export type ProductAttributeValuesId = ProductAttributeValues[ProductAttributeValuesPk];
export type ProductAttributeValuesOptionalAttributes = "IdProductAttributeValues";
export type ProductAttributeValuesCreationAttributes = Optional<ProductAttributeValuesAttributes, ProductAttributeValuesOptionalAttributes>;

export class ProductAttributeValues extends Model<ProductAttributeValuesAttributes, ProductAttributeValuesCreationAttributes> implements ProductAttributeValuesAttributes {
  IdProductAttributeValues!: number;
  IdProducto!: string;
  IdValue!: number;

  // ProductAttributeValues belongsTo CategoryAttributeValues via IdValue
  IdValueCategoryAttributeValue!: CategoryAttributeValues;
  getIdValueCategoryAttributeValue!: Sequelize.BelongsToGetAssociationMixin<CategoryAttributeValues>;
  setIdValueCategoryAttributeValue!: Sequelize.BelongsToSetAssociationMixin<CategoryAttributeValues, CategoryAttributeValuesId>;
  createIdValueCategoryAttributeValue!: Sequelize.BelongsToCreateAssociationMixin<CategoryAttributeValues>;
  // ProductAttributeValues belongsTo Products via IdProducto
  IdProductoProduct!: Products;
  getIdProductoProduct!: Sequelize.BelongsToGetAssociationMixin<Products>;
  setIdProductoProduct!: Sequelize.BelongsToSetAssociationMixin<Products, ProductsId>;
  createIdProductoProduct!: Sequelize.BelongsToCreateAssociationMixin<Products>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ProductAttributeValues {
    return ProductAttributeValues.init({
    IdProductAttributeValues: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_product_attribute_values'
    },
    IdProducto: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'products',
        key: 'id_product'
      },
      field: 'id_producto'
    },
    IdValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'category_attribute_values',
        key: 'id_category_attribute_values'
      },
      field: 'id_value'
    }
  }, {
    sequelize,
    tableName: 'product_attribute_values',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "product_attribute_values_pkey",
        unique: true,
        fields: [
          { name: "id_product_attribute_values" },
        ]
      },
    ]
  });
  }
}
