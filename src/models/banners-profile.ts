import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Profile, ProfileId } from './profile';

export interface BannersProfileAttributes {
  IdBannersProfile: number;
  IdPageUser: string;
  BannerPicture?: string;
  Title?: string;
  Description?: string;
  DateCreate: string;
  DateUpdate?: string;
}

export type BannersProfilePk = "IdBannersProfile";
export type BannersProfileId = BannersProfile[BannersProfilePk];
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

  // BannersProfile belongsTo Profile via IdPageUser
  IdPageUserProfile!: Profile;
  getIdPageUserProfile!: Sequelize.BelongsToGetAssociationMixin<Profile>;
  setIdPageUserProfile!: Sequelize.BelongsToSetAssociationMixin<Profile, ProfileId>;
  createIdPageUserProfile!: Sequelize.BelongsToCreateAssociationMixin<Profile>;

  static initModel(sequelize: Sequelize.Sequelize): typeof BannersProfile {
    return BannersProfile.init({
    IdBannersProfile: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_banners_profile'
    },
    IdPageUser: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'profile',
        key: 'id_profile'
      },
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
    timestamps: false,
    indexes: [
      {
        name: "bannersUser_pkey",
        unique: true,
        fields: [
          { name: "id_banners_profile" },
        ]
      },
    ]
  });
  }
}
