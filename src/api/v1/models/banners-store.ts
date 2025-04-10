import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface BannersStoreAttributes {
  IdBannersStore: number;
  IdPageStore: string;
  BanerPicture: string;
  Title?: string;
  Description?: string;
  DateCreate?: string;
  DateUpdate?: string;
  UserCreate: string;
  UserUpdate?: string;
}

export type BannersStoreOptionalAttributes = "IdBannersStore" | "Title" | "Description" | "DateCreate" | "DateUpdate" | "UserUpdate";
export type BannersStoreCreationAttributes = Optional<BannersStoreAttributes, BannersStoreOptionalAttributes>;

export class BannersStore extends Model<BannersStoreAttributes, BannersStoreCreationAttributes> implements BannersStoreAttributes {
  IdBannersStore!: number;
  IdPageStore!: string;
  BanerPicture!: string;
  Title?: string;
  Description?: string;
  DateCreate?: string;
  DateUpdate?: string;
  UserCreate!: string;
  UserUpdate?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof BannersStore {
    return BannersStore.init({
    IdBannersStore: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_banners_store'
    },
    IdPageStore: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'id_page_store'
    },
    BanerPicture: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'baner_picture'
    },
    Title: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'title'
    },
    Description: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'description'
    },
    DateCreate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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
    }
  }, {
    sequelize,
    tableName: 'banners_store',
    schema: 'pages',
    timestamps: false
  });
  }
}
