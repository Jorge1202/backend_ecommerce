import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { StaticsService, StaticsServiceId } from './statics-service';
import type { UserPage, UserPageId } from './user-page';

export interface PageServicesAttributes {
  IdPageServices: string;
  Name?: string;
  Descripcion?: string;
  Email?: string;
  PhoneNumber?: string;
  ProfilePicture?: string;
  IsVerificado: boolean;
  IsActive: boolean;
  DateCreate: string;
  DateUpdate?: string;
  IdUserPage: number;
}

export type PageServicesPk = "IdPageServices";
export type PageServicesId = PageServices[PageServicesPk];
export type PageServicesOptionalAttributes = "Name" | "Descripcion" | "Email" | "PhoneNumber" | "ProfilePicture" | "IsActive" | "DateUpdate";
export type PageServicesCreationAttributes = Optional<PageServicesAttributes, PageServicesOptionalAttributes>;

export class PageServices extends Model<PageServicesAttributes, PageServicesCreationAttributes> implements PageServicesAttributes {
  IdPageServices!: string;
  Name?: string;
  Descripcion?: string;
  Email?: string;
  PhoneNumber?: string;
  ProfilePicture?: string;
  IsVerificado!: boolean;
  IsActive!: boolean;
  DateCreate!: string;
  DateUpdate?: string;
  IdUserPage!: number;

  // PageServices hasMany StaticsService via IdPageService
  StaticsServices!: StaticsService[];
  getStaticsServices!: Sequelize.HasManyGetAssociationsMixin<StaticsService>;
  setStaticsServices!: Sequelize.HasManySetAssociationsMixin<StaticsService, StaticsServiceId>;
  addStaticsService!: Sequelize.HasManyAddAssociationMixin<StaticsService, StaticsServiceId>;
  addStaticsServices!: Sequelize.HasManyAddAssociationsMixin<StaticsService, StaticsServiceId>;
  createStaticsService!: Sequelize.HasManyCreateAssociationMixin<StaticsService>;
  removeStaticsService!: Sequelize.HasManyRemoveAssociationMixin<StaticsService, StaticsServiceId>;
  removeStaticsServices!: Sequelize.HasManyRemoveAssociationsMixin<StaticsService, StaticsServiceId>;
  hasStaticsService!: Sequelize.HasManyHasAssociationMixin<StaticsService, StaticsServiceId>;
  hasStaticsServices!: Sequelize.HasManyHasAssociationsMixin<StaticsService, StaticsServiceId>;
  countStaticsServices!: Sequelize.HasManyCountAssociationsMixin;
  // PageServices belongsTo UserPage via IdUserPage
  IdUserPageUserPage!: UserPage;
  getIdUserPageUserPage!: Sequelize.BelongsToGetAssociationMixin<UserPage>;
  setIdUserPageUserPage!: Sequelize.BelongsToSetAssociationMixin<UserPage, UserPageId>;
  createIdUserPageUserPage!: Sequelize.BelongsToCreateAssociationMixin<UserPage>;

  static initModel(sequelize: Sequelize.Sequelize): typeof PageServices {
    return PageServices.init({
    IdPageServices: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      field: 'id_page_services'
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'name'
    },
    Descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'descripcion'
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
    ProfilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_picture'
    },
    IsVerificado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_verificado'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
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
    IdUserPage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_page',
        key: 'id_user_page'
      },
      field: 'id_user_page'
    }
  }, {
    sequelize,
    tableName: 'page_services',
    schema: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "pageServices_pkey",
        unique: true,
        fields: [
          { name: "id_page_services" },
        ]
      },
    ]
  });
  }
}
