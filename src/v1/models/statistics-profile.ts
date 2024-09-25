import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Profile, ProfileId } from './profile';

export interface StatisticsProfileAttributes {
  IdStatisticsProfile: number;
  IdPageUser: string;
  Followers: number;
  Following: number;
}

export type StatisticsProfilePk = "IdStatisticsProfile";
export type StatisticsProfileId = StatisticsProfile[StatisticsProfilePk];
export type StatisticsProfileOptionalAttributes = "IdStatisticsProfile" | "Followers" | "Following";
export type StatisticsProfileCreationAttributes = Optional<StatisticsProfileAttributes, StatisticsProfileOptionalAttributes>;

export class StatisticsProfile extends Model<StatisticsProfileAttributes, StatisticsProfileCreationAttributes> implements StatisticsProfileAttributes {
  IdStatisticsProfile!: number;
  IdPageUser!: string;
  Followers!: number;
  Following!: number;

  // StatisticsProfile belongsTo Profile via IdPageUser
  IdPageUserProfile!: Profile;
  getIdPageUserProfile!: Sequelize.BelongsToGetAssociationMixin<Profile>;
  setIdPageUserProfile!: Sequelize.BelongsToSetAssociationMixin<Profile, ProfileId>;
  createIdPageUserProfile!: Sequelize.BelongsToCreateAssociationMixin<Profile>;

  static initModel(sequelize: Sequelize.Sequelize): typeof StatisticsProfile {
    return StatisticsProfile.init({
    IdStatisticsProfile: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_statistics_profile'
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
    }
  }, {
    sequelize,
    tableName: 'statistics_profile',
    schema: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "statisticsUser_pkey",
        unique: true,
        fields: [
          { name: "id_statistics_profile" },
        ]
      },
    ]
  });
  }
}
