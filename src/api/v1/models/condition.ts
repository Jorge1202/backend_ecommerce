import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Products, ProductsId } from './products';

export interface ConditionAttributes {
  IdCondition: number;
  Name?: string;
}

export type ConditionPk = "IdCondition";
export type ConditionId = Condition[ConditionPk];
export type ConditionOptionalAttributes = "IdCondition" | "Name";
export type ConditionCreationAttributes = Optional<ConditionAttributes, ConditionOptionalAttributes>;

export class Condition extends Model<ConditionAttributes, ConditionCreationAttributes> implements ConditionAttributes {
  IdCondition!: number;
  Name?: string;

  // Condition hasMany Products via IdCondition
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

  static initModel(sequelize: Sequelize.Sequelize): typeof Condition {
    return Condition.init({
    IdCondition: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_condition'
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'name'
    }
  }, {
    sequelize,
    tableName: 'condition',
    schema: 'products',
    timestamps: false,
    indexes: [
      {
        name: "condition_pkey",
        unique: true,
        fields: [
          { name: "id_condition" },
        ]
      },
    ]
  });
  }
}
