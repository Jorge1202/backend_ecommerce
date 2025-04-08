import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PageServices, PageServicesId } from './page-services';

export interface StaticsServiceAttributes {
  IdStaticsService: number;
  IdPageService: string;
  Followers: number;
  Following: number;
}

export type StaticsServicePk = "IdStaticsService";
export type StaticsServiceId = StaticsService[StaticsServicePk];
export type StaticsServiceOptionalAttributes = "IdStaticsService" | "Followers" | "Following";
export type StaticsServiceCreationAttributes = Optional<StaticsServiceAttributes, StaticsServiceOptionalAttributes>;

export class StaticsService extends Model<StaticsServiceAttributes, StaticsServiceCreationAttributes> implements StaticsServiceAttributes {
  IdStaticsService!: number;
  IdPageService!: string;
  Followers!: number;
  Following!: number;

  // StaticsService belongsTo PageServices via IdPageService
  IdPageServicePageService!: PageServices;
  getIdPageServicePageService!: Sequelize.BelongsToGetAssociationMixin<PageServices>;
  setIdPageServicePageService!: Sequelize.BelongsToSetAssociationMixin<PageServices, PageServicesId>;
  createIdPageServicePageService!: Sequelize.BelongsToCreateAssociationMixin<PageServices>;

  static initModel(sequelize: Sequelize.Sequelize): typeof StaticsService {
    return StaticsService.init({
    IdStaticsService: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_statics_service'
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
    tableName: 'statics_service',
    schema: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "staticsService_pkey",
        unique: true,
        fields: [
          { name: "id_statics_service" },
        ]
      },
    ]
  });
  }
}
