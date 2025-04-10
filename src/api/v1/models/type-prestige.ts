import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { StatisticsStore, StatisticsStoreId } from './statistics-store';

export interface TypePrestigeAttributes {
  IdTypePrestige: number;
  Prestige: string;
  Descripcion?: string;
}

export type TypePrestigePk = "IdTypePrestige";
export type TypePrestigeId = TypePrestige[TypePrestigePk];
export type TypePrestigeOptionalAttributes = "IdTypePrestige" | "Descripcion";
export type TypePrestigeCreationAttributes = Optional<TypePrestigeAttributes, TypePrestigeOptionalAttributes>;

export class TypePrestige extends Model<TypePrestigeAttributes, TypePrestigeCreationAttributes> implements TypePrestigeAttributes {
  IdTypePrestige!: number;
  Prestige!: string;
  Descripcion?: string;

  // TypePrestige hasMany StatisticsStore via IdTypePrestige
  StatisticsStores!: StatisticsStore[];
  getStatisticsStores!: Sequelize.HasManyGetAssociationsMixin<StatisticsStore>;
  setStatisticsStores!: Sequelize.HasManySetAssociationsMixin<StatisticsStore, StatisticsStoreId>;
  addStatisticsStore!: Sequelize.HasManyAddAssociationMixin<StatisticsStore, StatisticsStoreId>;
  addStatisticsStores!: Sequelize.HasManyAddAssociationsMixin<StatisticsStore, StatisticsStoreId>;
  createStatisticsStore!: Sequelize.HasManyCreateAssociationMixin<StatisticsStore>;
  removeStatisticsStore!: Sequelize.HasManyRemoveAssociationMixin<StatisticsStore, StatisticsStoreId>;
  removeStatisticsStores!: Sequelize.HasManyRemoveAssociationsMixin<StatisticsStore, StatisticsStoreId>;
  hasStatisticsStore!: Sequelize.HasManyHasAssociationMixin<StatisticsStore, StatisticsStoreId>;
  hasStatisticsStores!: Sequelize.HasManyHasAssociationsMixin<StatisticsStore, StatisticsStoreId>;
  countStatisticsStores!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof TypePrestige {
    return TypePrestige.init({
    IdTypePrestige: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_type_prestige'
    },
    Prestige: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'prestige'
    },
    Descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'descripcion'
    }
  }, {
    sequelize,
    tableName: 'type_prestige',
    schema: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "typePrestige_pkey",
        unique: true,
        fields: [
          { name: "id_type_prestige" },
        ]
      },
    ]
  });
  }
}
