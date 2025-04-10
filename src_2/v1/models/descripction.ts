import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Products, ProductsId } from './products';

export interface DescripctionAttributes {
  IdDescripction: number;
  IdProduct?: string;
  Description?: string;
}

export type DescripctionPk = "IdDescripction";
export type DescripctionId = Descripction[DescripctionPk];
export type DescripctionOptionalAttributes = "IdDescripction" | "IdProduct" | "Description";
export type DescripctionCreationAttributes = Optional<DescripctionAttributes, DescripctionOptionalAttributes>;

export class Descripction extends Model<DescripctionAttributes, DescripctionCreationAttributes> implements DescripctionAttributes {
  IdDescripction!: number;
  IdProduct?: string;
  Description?: string;

  // Descripction belongsTo Products via IdProduct
  IdProductProduct!: Products;
  getIdProductProduct!: Sequelize.BelongsToGetAssociationMixin<Products>;
  setIdProductProduct!: Sequelize.BelongsToSetAssociationMixin<Products, ProductsId>;
  createIdProductProduct!: Sequelize.BelongsToCreateAssociationMixin<Products>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Descripction {
    return Descripction.init({
    IdDescripction: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_descripction'
    },
    IdProduct: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'products',
        key: 'id_product'
      },
      field: 'id_product'
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
    }
  }, {
    sequelize,
    tableName: 'descripction',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "descripction_pkey",
        unique: true,
        fields: [
          { name: "id_descripction" },
        ]
      },
    ]
  });
  }
}
