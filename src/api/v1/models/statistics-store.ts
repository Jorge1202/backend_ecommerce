import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PageStore, PageStoreId } from './page-store';
import type { TypePrestige, TypePrestigeId } from './type-prestige';

export interface StatisticsStoreAttributes {
  IdStatisticsStore: number;
  Score: number;
  Ratings: number;
  Followers: number;
  Following: number;
  NumberSales: number;
  IdTypePrestige: number;
  IdPageStore: string;
}

export type StatisticsStorePk = "IdStatisticsStore";
export type StatisticsStoreId = StatisticsStore[StatisticsStorePk];
export type StatisticsStoreOptionalAttributes = "IdStatisticsStore" | "Score" | "Ratings" | "Followers" | "Following" | "NumberSales" | "IdTypePrestige";
export type StatisticsStoreCreationAttributes = Optional<StatisticsStoreAttributes, StatisticsStoreOptionalAttributes>;

export class StatisticsStore extends Model<StatisticsStoreAttributes, StatisticsStoreCreationAttributes> implements StatisticsStoreAttributes {
  IdStatisticsStore!: number;
  Score!: number;
  Ratings!: number;
  Followers!: number;
  Following!: number;
  NumberSales!: number;
  IdTypePrestige!: number;
  IdPageStore!: string;

  // StatisticsStore belongsTo PageStore via IdPageStore
  IdPageStorePageStore!: PageStore;
  getIdPageStorePageStore!: Sequelize.BelongsToGetAssociationMixin<PageStore>;
  setIdPageStorePageStore!: Sequelize.BelongsToSetAssociationMixin<PageStore, PageStoreId>;
  createIdPageStorePageStore!: Sequelize.BelongsToCreateAssociationMixin<PageStore>;
  // StatisticsStore belongsTo TypePrestige via IdTypePrestige
  IdTypePrestigeTypePrestige!: TypePrestige;
  getIdTypePrestigeTypePrestige!: Sequelize.BelongsToGetAssociationMixin<TypePrestige>;
  setIdTypePrestigeTypePrestige!: Sequelize.BelongsToSetAssociationMixin<TypePrestige, TypePrestigeId>;
  createIdTypePrestigeTypePrestige!: Sequelize.BelongsToCreateAssociationMixin<TypePrestige>;

  static initModel(sequelize: Sequelize.Sequelize): typeof StatisticsStore {
    return StatisticsStore.init({
    IdStatisticsStore: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_statistics_store'
    },
    Score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'score'
    },
    Ratings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'ratings'
    },
    Followers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'followers'
    },
    Following: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'following'
    },
    NumberSales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'number_sales'
    },
    IdTypePrestige: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'type_prestige',
        key: 'id_type_prestige'
      },
      field: 'id_type_prestige'
    },
    IdPageStore: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'page_store',
        key: 'id_page_store'
      },
      field: 'id_page_store'
    }
  }, {
    sequelize,
    tableName: 'statistics_store',
    schema: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "statisticsStore_pkey",
        unique: true,
        fields: [
          { name: "id_statistics_store" },
        ]
      },
    ]
  });
  }
}
