import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface BannersProfileAttributes {
  IdBannersProfile: number;
  IdPageUser: string;
  BannerPicture?: string;
  Title?: string;
  Description?: string;
  DateCreate: string;
  DateUpdate?: string;
}

export type BannersProfileOptionalAttributes = "IdBannersProfile" | "BannerPicture" | "Title" | "Description" | "DateUpdate";
export type BannersProfileCreationAttributes = Optional<BannersProfileAttributes, BannersProfileOptionalAttributes>;

export class BannersProfile extends Model<BannersProfileAttributes, BannersProfileCreationAttributes> implements BannersProfileAttributes {
  IdBannersProfile!: number;
  IdPageUser!: string;
  BannerPicture?: string;
  Title?: string;
  Description?: string;
  DateCreate!: string;
  DateUpdate?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof BannersProfile {
    return BannersProfile.init({
    IdBannersProfile: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_banners_profile'
    },
    IdPageUser: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'id_page_user'
    },
    BannerPicture: {
      type: DataTypes.STRING,
      allowNull: true,
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
    }
  }, {
    sequelize,
    tableName: 'banners_profile',
    schema: 'pages',
    timestamps: false
  });
  }
}
