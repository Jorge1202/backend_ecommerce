import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { StatisticsProfile, StatisticsProfileId } from './statistics-profile';

export interface ProfileAttributes {
  IdProfile: string;
  Name: string;
  Firstname?: string;
  Lastname?: string;
  Fullname?: string;
  Email?: string;
  Phone?: string;
  ProfilePicture?: string;
  PortadaPicture?: string;
  Descripcion?: string;
  IsVarificado?: boolean;
  IsActive?: boolean;
  DateCreate: Date;
  DateUpdate?: Date;
  IdUserPage: number;
}

export type ProfilePk = "IdProfile";
export type ProfileId = Profile[ProfilePk];
export type ProfileOptionalAttributes = "Firstname" | "Lastname" | "Fullname" | "Email" | "Phone" | "ProfilePicture" | "PortadaPicture" | "Descripcion" | "IsVarificado" | "IsActive" | "DateUpdate";
export type ProfileCreationAttributes = Optional<ProfileAttributes, ProfileOptionalAttributes>;

export class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  IdProfile!: string;
  Name!: string;
  Firstname?: string;
  Lastname?: string;
  Fullname?: string;
  Email?: string;
  Phone?: string;
  ProfilePicture?: string;
  PortadaPicture?: string;
  Descripcion?: string;
  IsVarificado?: boolean;
  IsActive?: boolean;
  DateCreate!: Date;
  DateUpdate?: Date;
  IdUserPage!: number;

  // Profile hasMany StatisticsProfile via IdProfile
  StatisticsProfiles!: StatisticsProfile[];
  getStatisticsProfiles!: Sequelize.HasManyGetAssociationsMixin<StatisticsProfile>;
  setStatisticsProfiles!: Sequelize.HasManySetAssociationsMixin<StatisticsProfile, StatisticsProfileId>;
  addStatisticsProfile!: Sequelize.HasManyAddAssociationMixin<StatisticsProfile, StatisticsProfileId>;
  addStatisticsProfiles!: Sequelize.HasManyAddAssociationsMixin<StatisticsProfile, StatisticsProfileId>;
  createStatisticsProfile!: Sequelize.HasManyCreateAssociationMixin<StatisticsProfile>;
  removeStatisticsProfile!: Sequelize.HasManyRemoveAssociationMixin<StatisticsProfile, StatisticsProfileId>;
  removeStatisticsProfiles!: Sequelize.HasManyRemoveAssociationsMixin<StatisticsProfile, StatisticsProfileId>;
  hasStatisticsProfile!: Sequelize.HasManyHasAssociationMixin<StatisticsProfile, StatisticsProfileId>;
  hasStatisticsProfiles!: Sequelize.HasManyHasAssociationsMixin<StatisticsProfile, StatisticsProfileId>;
  countStatisticsProfiles!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Profile {
    return Profile.init({
    IdProfile: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      field: 'id_profile'
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'name'
    },
    Firstname: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'firstname'
    },
    Lastname: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'lastname'
    },
    Fullname: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'fullname'
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'email'
    },
    Phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'phone'
    },
    ProfilePicture: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'profile_picture'
    },
    PortadaPicture: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'portada_picture'
    },
    Descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'descripcion'
    },
    IsVarificado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'is_varificado'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'is_active'
    },
    DateCreate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'date_create'
    },
    DateUpdate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_update'
    },
    IdUserPage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_user_page'
    }
  }, {
    sequelize,
    tableName: 'profile',
    schema: 'pages',
    timestamps: true, // ✅ activa los timestamps
    createdAt: 'DateCreate', 
    updatedAt: 'DateUpdate', 
    indexes: [
      {
        name: "pageUser_pkey",
        unique: true,
        fields: [
          { name: "id_profile" },
        ]
      },
    ]
  });
  }
}
