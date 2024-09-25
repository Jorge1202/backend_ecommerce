import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PageStore, PageStoreId } from './page-store';
import type { User, UserId } from './user';

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

export type BannersStorePk = "IdBannersStore";
export type BannersStoreId = BannersStore[BannersStorePk];
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

  // BannersStore belongsTo PageStore via IdPageStore
  IdPageStorePageStore!: PageStore;
  getIdPageStorePageStore!: Sequelize.BelongsToGetAssociationMixin<PageStore>;
  setIdPageStorePageStore!: Sequelize.BelongsToSetAssociationMixin<PageStore, PageStoreId>;
  createIdPageStorePageStore!: Sequelize.BelongsToCreateAssociationMixin<PageStore>;
  // BannersStore belongsTo User via UserCreate
  UserCreateUser!: User;
  getUserCreateUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUserCreateUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUserCreateUser!: Sequelize.BelongsToCreateAssociationMixin<User>;
  // BannersStore belongsTo User via UserUpdate
  UserUpdateUser!: User;
  getUserUpdateUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUserUpdateUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUserUpdateUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof BannersStore {
    return BannersStore.init({
    IdBannersStore: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_banners_store'
    },
    IdPageStore: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'page_store',
        key: 'id_page_store'
      },
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
      references: {
        model: 'user',
        key: 'id_user'
      },
      field: 'user_create'
    },
    UserUpdate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id_user'
      },
      field: 'user_update'
    }
  }, {
    sequelize,
    tableName: 'banners_store',
    schema: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "bannersStore_pkey",
        unique: true,
        fields: [
          { name: "id_banners_store" },
        ]
      },
    ]
  });
  }
}
