import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { CategoryAttributeValues, CategoryAttributeValuesId } from './category-attribute-values';
import type { Products, ProductsId } from './products';

export interface CategoriesAttributes {
  IdCategories: number;
  Name: string;
  ParentId?: number;
  Level: number;
  CategoryCode: string;
  IsFinal?: boolean;
}

export type CategoriesPk = "IdCategories";
export type CategoriesId = Categories[CategoriesPk];
export type CategoriesOptionalAttributes = "IdCategories" | "ParentId" | "IsFinal";
export type CategoriesCreationAttributes = Optional<CategoriesAttributes, CategoriesOptionalAttributes>;

export class Categories extends Model<CategoriesAttributes, CategoriesCreationAttributes> implements CategoriesAttributes {
  IdCategories!: number;
  Name!: string;
  ParentId?: number;
  Level!: number;
  CategoryCode!: string;
  IsFinal?: boolean;

  // Categories belongsTo Categories via ParentId
  Parent!: Categories;
  getParent!: Sequelize.BelongsToGetAssociationMixin<Categories>;
  setParent!: Sequelize.BelongsToSetAssociationMixin<Categories, CategoriesId>;
  createParent!: Sequelize.BelongsToCreateAssociationMixin<Categories>;
  // Categories hasMany CategoryAttributeValues via IdCategory
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
  // Categories hasMany Products via IdCategory
  Products!: Products[];
  getProducts!: Sequelize.HasManyGetAssociationsMixin<Products>;
  setProducts!: Sequelize.HasManySetAssociationsMixin<Products, ProductsId>;
  addProduct!: Sequelize.HasManyAddAssociationMixin<Products, ProductsId>;
  addProducts!: Sequelize.HasManyAddAssociationsMixin<Products, ProductsId>;
  createProduct!: Sequelize.HasManyCreateAssociationMixin<Products>;
  removeProduct!: Sequelize.HasManyRemoveAssociationMixin<Products, ProductsId>;
  removeProducts!: Sequelize.HasManyRemoveAssociationsMixin<Products, ProductsId>;
  hasProduct!: Sequelize.HasManyHasAssociationMixin<Products, ProductsId>;
  hasProducts!: Sequelize.HasManyHasAssociationsMixin<Products, ProductsId>;
  countProducts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Categories {
    return Categories.init({
    IdCategories: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_categories'
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "unique_name_per_level",
      field: 'name'
    },
    ParentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id_categories'
      },
      field: 'parent_id'
    },
    Level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "unique_name_per_level",
      field: 'level'
    },
    CategoryCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'category_code'
    },
    IsFinal: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'is_final'
    }
  }, {
    sequelize,
    tableName: 'categories',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "categories_pkey",
        unique: true,
        fields: [
          { name: "id_categories" },
        ]
      },
      {
        name: "unique_name_per_level",
        unique: true,
        fields: [
          { name: "name" },
          { name: "level" },
        ]
      },
    ]
  });
  }
}
