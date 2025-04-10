import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface StatisticsProfileAttributes {
  IdStatisticsProfile: number;
  Followers?: number;
  Following?: number;
  IdProfile: string;
}

export type StatisticsProfilePk = "IdStatisticsProfile";
export type StatisticsProfileId = StatisticsProfile[StatisticsProfilePk];
export type StatisticsProfileOptionalAttributes = "IdStatisticsProfile" | "Followers" | "Following";
export type StatisticsProfileCreationAttributes = Optional<StatisticsProfileAttributes, StatisticsProfileOptionalAttributes>;

export class StatisticsProfile extends Model<StatisticsProfileAttributes, StatisticsProfileCreationAttributes> implements StatisticsProfileAttributes {
  IdStatisticsProfile!: number;
  Followers?: number;
  Following?: number;
  IdProfile!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof StatisticsProfile {
    return StatisticsProfile.init({
    IdStatisticsProfile: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_statistics_profile'
    },
    Followers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'followers'
    },
    Following: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'following'
    },
    IdProfile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'idProfile'
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
