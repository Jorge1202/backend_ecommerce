import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Multimedia, MultimediaId } from './multimedia';
import type { Products, ProductsId } from './products';

export interface ProductMultimediaAttributes {
  IdProductMultimedia: number;
  IdProduct?: string;
  IdMultimedia: string;
}

export type ProductMultimediaPk = "IdProductMultimedia";
export type ProductMultimediaId = ProductMultimedia[ProductMultimediaPk];
export type ProductMultimediaOptionalAttributes = "IdProduct";
export type ProductMultimediaCreationAttributes = Optional<ProductMultimediaAttributes, ProductMultimediaOptionalAttributes>;

export class ProductMultimedia extends Model<ProductMultimediaAttributes, ProductMultimediaCreationAttributes> implements ProductMultimediaAttributes {
  IdProductMultimedia!: number;
  IdProduct?: string;
  IdMultimedia!: string;

  // ProductMultimedia belongsTo Multimedia via IdMultimedia
  IdMultimediaMultimedium!: Multimedia;
  getIdMultimediaMultimedium!: Sequelize.BelongsToGetAssociationMixin<Multimedia>;
  setIdMultimediaMultimedium!: Sequelize.BelongsToSetAssociationMixin<Multimedia, MultimediaId>;
  createIdMultimediaMultimedium!: Sequelize.BelongsToCreateAssociationMixin<Multimedia>;
  // ProductMultimedia belongsTo Products via IdProduct
  IdProductProduct!: Products;
  getIdProductProduct!: Sequelize.BelongsToGetAssociationMixin<Products>;
  setIdProductProduct!: Sequelize.BelongsToSetAssociationMixin<Products, ProductsId>;
  createIdProductProduct!: Sequelize.BelongsToCreateAssociationMixin<Products>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ProductMultimedia {
    return ProductMultimedia.init({
    IdProductMultimedia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_product_multimedia '
    },
    IdProduct: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: {
          tableName: 'products',
          schema: 'products'
        },
        key: 'id_product'
      },
      field: 'id_product'
    },
    IdMultimedia: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: {
          tableName: 'multimedia',
          schema: 'multimedia'
        },
        key: 'id_multimedia'
      },
      field: 'id_multimedia'
    }
  }, {
    sequelize,
    tableName: 'product_multimedia ',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "product_multimedia _pkey",
        unique: true,
        fields: [
          { name: "id_product_multimedia " },
        ]
      },
    ]
  });
  }
}
