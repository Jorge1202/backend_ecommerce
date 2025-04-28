import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

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


  static initModel(sequelize: Sequelize.Sequelize): typeof BannersServices {
    return BannersServices.init({
    IdBannersServices: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_banners_services'
    },
    IdPageService: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
      field: 'user_create'
    },
    UserUpdate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'user_update'
    }
  }, {
    sequelize,
    tableName: 'banners_services',
    schema: 'pages',
    timestamps: false
  });
  }
}
