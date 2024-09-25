import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PageServices, PageServicesId } from './page-services';
import type { User, UserId } from './user';

export interface BannersServicesAttributes {
  IdBannersServices: number;
  IdPageService: string;
  BannerPicture: string;
  Title?: string;
  Description?: string;
  DateCreate: string;
  DateUpdate?: string;
  UserCreate: string;
  UserUpdate?: string;
}

export type BannersServicesPk = "IdBannersServices";
export type BannersServicesId = BannersServices[BannersServicesPk];
export type BannersServicesOptionalAttributes = "IdBannersServices" | "Title" | "Description" | "DateUpdate" | "UserUpdate";
export type BannersServicesCreationAttributes = Optional<BannersServicesAttributes, BannersServicesOptionalAttributes>;

export class BannersServices extends Model<BannersServicesAttributes, BannersServicesCreationAttributes> implements BannersServicesAttributes {
  IdBannersServices!: number;
  IdPageService!: string;
  BannerPicture!: string;
  Title?: string;
  Description?: string;
  DateCreate!: string;
  DateUpdate?: string;
  UserCreate!: string;
  UserUpdate?: string;

  // BannersServices belongsTo PageServices via IdPageService
  IdPageServicePageService!: PageServices;
  getIdPageServicePageService!: Sequelize.BelongsToGetAssociationMixin<PageServices>;
  setIdPageServicePageService!: Sequelize.BelongsToSetAssociationMixin<PageServices, PageServicesId>;
  createIdPageServicePageService!: Sequelize.BelongsToCreateAssociationMixin<PageServices>;
  // BannersServices belongsTo User via UserCreate
  UserCreateUser!: User;
  getUserCreateUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUserCreateUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUserCreateUser!: Sequelize.BelongsToCreateAssociationMixin<User>;
  // BannersServices belongsTo User via UserUpdate
  UserUpdateUser!: User;
  getUserUpdateUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUserUpdateUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUserUpdateUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof BannersServices {
    return BannersServices.init({
    IdBannersServices: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_banners_services'
    },
    IdPageService: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'page_services',
        key: 'id_page_services'
      },
      field: 'id_page_service'
    },
    BannerPicture: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'banner_picture'
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
    tableName: 'banners_services',
    schema: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "bannersServices_pkey",
        unique: true,
        fields: [
          { name: "id_banners_services" },
        ]
      },
    ]
  });
  }
}
