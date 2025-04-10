import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Products, ProductsId } from './products';

export interface ProductVariationAttributes {
  IdProductVariation: number;
  IdProduct: string;
  Sku?: string;
  UniversalCode?: string;
  BasePrice?: number;
  Status?: number;
  IsActive?: boolean;
  DateCreate: string;
  DateUpdate?: string;
  UserCreate: string;
  UserUpdate?: string;
  Stock?: number;
}

export type ProductVariationPk = "IdProductVariation";
export type ProductVariationId = ProductVariation[ProductVariationPk];
export type ProductVariationOptionalAttributes = "IdProductVariation" | "Sku" | "UniversalCode" | "BasePrice" | "Status" | "IsActive" | "DateUpdate" | "UserUpdate" | "Stock";
export type ProductVariationCreationAttributes = Optional<ProductVariationAttributes, ProductVariationOptionalAttributes>;

export class ProductVariation extends Model<ProductVariationAttributes, ProductVariationCreationAttributes> implements ProductVariationAttributes {
  IdProductVariation!: number;
  IdProduct!: string;
  Sku?: string;
  UniversalCode?: string;
  BasePrice?: number;
  Status?: number;
  IsActive?: boolean;
  DateCreate!: string;
  DateUpdate?: string;
  UserCreate!: string;
  UserUpdate?: string;
  Stock?: number;

  // ProductVariation belongsTo Products via IdProduct
  IdProductProduct!: Products;
  getIdProductProduct!: Sequelize.BelongsToGetAssociationMixin<Products>;
  setIdProductProduct!: Sequelize.BelongsToSetAssociationMixin<Products, ProductsId>;
  createIdProductProduct!: Sequelize.BelongsToCreateAssociationMixin<Products>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ProductVariation {
    return ProductVariation.init({
    IdProductVariation: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_product_variation'
    },
    IdProduct: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'products',
        key: 'id_product'
      },
      field: 'id_product'
    },
    Sku: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'sku'
    },
    UniversalCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'universal_code'
    },
    BasePrice: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'base_price'
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'is_active'
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
    Stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'stock'
    }
  }, {
    sequelize,
    tableName: 'product_variation',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "productVariacion_pkey",
        unique: true,
        fields: [
          { name: "id_product_variation" },
        ]
      },
    ]
  });
  }
}
