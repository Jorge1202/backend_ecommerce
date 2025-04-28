import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { StatisticsStore, StatisticsStoreId } from './statistics-store';

export interface PageStoreAttributes {
  IdPageStore: string;
  Name: string;
  Descripcion?: string;
  ProfilePicture?: string;
  Email?: string;
  PhoneNumber?: string;
  IsActive: boolean;
  IsVerificado: boolean;
  DataCreate: string;
  DataUpdate?: string;
  IdUserPage: number;
}

export type PageStorePk = "IdPageStore";
export type PageStoreId = PageStore[PageStorePk];
export type PageStoreOptionalAttributes = "Descripcion" | "ProfilePicture" | "Email" | "PhoneNumber" | "IsActive" | "DataUpdate";
export type PageStoreCreationAttributes = Optional<PageStoreAttributes, PageStoreOptionalAttributes>;

export class PageStore extends Model<PageStoreAttributes, PageStoreCreationAttributes> implements PageStoreAttributes {
  IdPageStore!: string;
  Name!: string;
  Descripcion?: string;
  ProfilePicture?: string;
  Email?: string;
  PhoneNumber?: string;
  IsActive!: boolean;
  IsVerificado!: boolean;
  DataCreate!: string;
  DataUpdate?: string;
  IdUserPage!: number;

  // PageStore hasMany StatisticsStore via IdPageStore
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

  static initModel(sequelize: Sequelize.Sequelize): typeof PageStore {
    return PageStore.init({
    IdPageStore: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      field: 'id_page_store'
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'name'
    },
    Descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'descripcion'
    },
    ProfilePicture: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'profile_picture'
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'email'
    },
    PhoneNumber: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'phone_number'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    IsVerificado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_verificado'
    },
    DataCreate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'data_create'
    },
    DataUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'data_update'
    },
    IdUserPage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_user_page'
    }
  }, {
    sequelize,
    tableName: 'page_store',
    schema: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "pageStore_pkey",
        unique: true,
        fields: [
          { name: "id_page_store" },
        ]
      },
    ]
  });
  }
}
