import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Categories, CategoriesId } from './categories';
import type { Condition, ConditionId } from './condition';
import type { CustomAttributeValues, CustomAttributeValuesId } from './custom-attribute-values';
import type { Descripction, DescripctionId } from './descripction';
import type { PageStore, PageStoreId } from './page-store';
import type { ProductAttributeValues, ProductAttributeValuesId } from './product-attribute-values';
import type { ProductMultimedia, ProductMultimediaId } from './product-multimedia';
import type { ProductVariation, ProductVariationId } from './product-variation';

export interface ProductsAttributes {
  IdProduct: string;
  IdStore: string;
  Title?: string;
  Status?: number;
  DateCreate: string;
  DateUpdate?: string;
  UserCreate: string;
  UserUpdate?: string;
  IdCategory: number;
  IdCondition?: number;
}

export type ProductsPk = "IdProduct";
export type ProductsId = Products[ProductsPk];
export type ProductsOptionalAttributes = "Title" | "Status" | "DateUpdate" | "UserUpdate" | "IdCondition";
export type ProductsCreationAttributes = Optional<ProductsAttributes, ProductsOptionalAttributes>;

export class Products extends Model<ProductsAttributes, ProductsCreationAttributes> implements ProductsAttributes {
  IdProduct!: string;
  IdStore!: string;
  Title?: string;
  Status?: number;
  DateCreate!: string;
  DateUpdate?: string;
  UserCreate!: string;
  UserUpdate?: string;
  IdCategory!: number;
  IdCondition?: number;

  // Products belongsTo Categories via IdCategory
  IdCategoryCategory!: Categories;
  getIdCategoryCategory!: Sequelize.BelongsToGetAssociationMixin<Categories>;
  setIdCategoryCategory!: Sequelize.BelongsToSetAssociationMixin<Categories, CategoriesId>;
  createIdCategoryCategory!: Sequelize.BelongsToCreateAssociationMixin<Categories>;
  // Products belongsTo Condition via IdCondition
  IdConditionCondition!: Condition;
  getIdConditionCondition!: Sequelize.BelongsToGetAssociationMixin<Condition>;
  setIdConditionCondition!: Sequelize.BelongsToSetAssociationMixin<Condition, ConditionId>;
  createIdConditionCondition!: Sequelize.BelongsToCreateAssociationMixin<Condition>;
  // Products belongsTo PageStore via IdStore
  IdStorePageStore!: PageStore;
  getIdStorePageStore!: Sequelize.BelongsToGetAssociationMixin<PageStore>;
  setIdStorePageStore!: Sequelize.BelongsToSetAssociationMixin<PageStore, PageStoreId>;
  createIdStorePageStore!: Sequelize.BelongsToCreateAssociationMixin<PageStore>;
  // Products hasMany CustomAttributeValues via IdProduct
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
  // Products hasMany Descripction via IdProduct
  Descripctions!: Descripction[];
  getDescripctions!: Sequelize.HasManyGetAssociationsMixin<Descripction>;
  setDescripctions!: Sequelize.HasManySetAssociationsMixin<Descripction, DescripctionId>;
  addDescripction!: Sequelize.HasManyAddAssociationMixin<Descripction, DescripctionId>;
  addDescripctions!: Sequelize.HasManyAddAssociationsMixin<Descripction, DescripctionId>;
  createDescripction!: Sequelize.HasManyCreateAssociationMixin<Descripction>;
  removeDescripction!: Sequelize.HasManyRemoveAssociationMixin<Descripction, DescripctionId>;
  removeDescripctions!: Sequelize.HasManyRemoveAssociationsMixin<Descripction, DescripctionId>;
  hasDescripction!: Sequelize.HasManyHasAssociationMixin<Descripction, DescripctionId>;
  hasDescripctions!: Sequelize.HasManyHasAssociationsMixin<Descripction, DescripctionId>;
  countDescripctions!: Sequelize.HasManyCountAssociationsMixin;
  // Products hasMany ProductAttributeValues via IdProducto
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
  // Products hasMany ProductMultimedia via IdProduct
  ProductMultimedia!: ProductMultimedia[];
  getProductMultimedia!: Sequelize.HasManyGetAssociationsMixin<ProductMultimedia>;
  setProductMultimedia!: Sequelize.HasManySetAssociationsMixin<ProductMultimedia, ProductMultimediaId>;
  addProductMultimedium!: Sequelize.HasManyAddAssociationMixin<ProductMultimedia, ProductMultimediaId>;
  addProductMultimedia!: Sequelize.HasManyAddAssociationsMixin<ProductMultimedia, ProductMultimediaId>;
  createProductMultimedium!: Sequelize.HasManyCreateAssociationMixin<ProductMultimedia>;
  removeProductMultimedium!: Sequelize.HasManyRemoveAssociationMixin<ProductMultimedia, ProductMultimediaId>;
  removeProductMultimedia!: Sequelize.HasManyRemoveAssociationsMixin<ProductMultimedia, ProductMultimediaId>;
  hasProductMultimedium!: Sequelize.HasManyHasAssociationMixin<ProductMultimedia, ProductMultimediaId>;
  hasProductMultimedia!: Sequelize.HasManyHasAssociationsMixin<ProductMultimedia, ProductMultimediaId>;
  countProductMultimedia!: Sequelize.HasManyCountAssociationsMixin;
  // Products hasMany ProductVariation via IdProduct
  ProductVariations!: ProductVariation[];
  getProductVariations!: Sequelize.HasManyGetAssociationsMixin<ProductVariation>;
  setProductVariations!: Sequelize.HasManySetAssociationsMixin<ProductVariation, ProductVariationId>;
  addProductVariation!: Sequelize.HasManyAddAssociationMixin<ProductVariation, ProductVariationId>;
  addProductVariations!: Sequelize.HasManyAddAssociationsMixin<ProductVariation, ProductVariationId>;
  createProductVariation!: Sequelize.HasManyCreateAssociationMixin<ProductVariation>;
  removeProductVariation!: Sequelize.HasManyRemoveAssociationMixin<ProductVariation, ProductVariationId>;
  removeProductVariations!: Sequelize.HasManyRemoveAssociationsMixin<ProductVariation, ProductVariationId>;
  hasProductVariation!: Sequelize.HasManyHasAssociationMixin<ProductVariation, ProductVariationId>;
  hasProductVariations!: Sequelize.HasManyHasAssociationsMixin<ProductVariation, ProductVariationId>;
  countProductVariations!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Products {
    return Products.init({
    IdProduct: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      field: 'id_product'
    },
    IdStore: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'page_store',
        key: 'id_page_store'
      },
      field: 'id_store'
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'title'
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: ' status'
    },
    DateCreate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_create'
    },
    DateUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_update'
    },
    UserCreate: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'user_create'
    },
    UserUpdate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'user_update'
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
    IdCondition: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'condition',
        key: 'id_condition'
      },
      field: 'id_condition'
    }
  }, {
    sequelize,
    tableName: 'products',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "products_pkey",
        unique: true,
        fields: [
          { name: "id_product" },
        ]
      },
    ]
  });
  }
}
