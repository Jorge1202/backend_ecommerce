import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { BannersProfile, BannersProfileId } from './banners-profile';
import type { StatisticsProfile, StatisticsProfileId } from './statistics-profile';
import type { UserPage, UserPageId } from './user-page';

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
  IsVarificado: boolean;
  IsActive: boolean;
  DateCreate: Date;
  DateUpdate?: Date;
  IdUserPage: number;
}

export type ProfilePk = "IdProfile";
export type ProfileId = Profile[ProfilePk];
// export type ProfileOptionalAttributes = "IdProfile" | "Firstname" | "Lastname" | "Fullname" | "Email" | "Phone" | "ProfilePicture" | "PortadaPicture" | "Descripcion" | "IsActive" | "DateUpdate";
// export type ProfileCreationAttributes = Optional<ProfileAttributes, ProfileOptionalAttributes>;
export type ProfileOptionalAttributes = "IdProfile" | "Firstname" | "Lastname" | "Fullname" | "Email" | "Phone" | "ProfilePicture" | "PortadaPicture" | "Descripcion" | "IsVarificado" | "IsActive" | "DateCreate" | "DateUpdate";
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
  IsVarificado!: boolean;
  IsActive!: boolean;
  DateCreate!: Date;
  DateUpdate?: Date;
  IdUserPage!: number;

  // Profile hasMany BannersProfile via IdPageUser
  BannersProfiles!: BannersProfile[];
  getBannersProfiles!: Sequelize.HasManyGetAssociationsMixin<BannersProfile>;
  setBannersProfiles!: Sequelize.HasManySetAssociationsMixin<BannersProfile, BannersProfileId>;
  addBannersProfile!: Sequelize.HasManyAddAssociationMixin<BannersProfile, BannersProfileId>;
  addBannersProfiles!: Sequelize.HasManyAddAssociationsMixin<BannersProfile, BannersProfileId>;
  createBannersProfile!: Sequelize.HasManyCreateAssociationMixin<BannersProfile>;
  removeBannersProfile!: Sequelize.HasManyRemoveAssociationMixin<BannersProfile, BannersProfileId>;
  removeBannersProfiles!: Sequelize.HasManyRemoveAssociationsMixin<BannersProfile, BannersProfileId>;
  hasBannersProfile!: Sequelize.HasManyHasAssociationMixin<BannersProfile, BannersProfileId>;
  hasBannersProfiles!: Sequelize.HasManyHasAssociationsMixin<BannersProfile, BannersProfileId>;
  countBannersProfiles!: Sequelize.HasManyCountAssociationsMixin;
  // Profile hasMany StatisticsProfile via IdPageUser
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
  // Profile belongsTo UserPage via IdUserPage
  IdUserPageUserPage!: UserPage;
  getIdUserPageUserPage!: Sequelize.BelongsToGetAssociationMixin<UserPage>;
  setIdUserPageUserPage!: Sequelize.BelongsToSetAssociationMixin<UserPage, UserPageId>;
  createIdUserPageUserPage!: Sequelize.BelongsToCreateAssociationMixin<UserPage>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Profile {
    return Profile.init({
    IdProfile: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_picture'
    },
    PortadaPicture: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'portada_picture'
    },
    Descripcion: {
      type: DataTypes.STRING,
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
      defaultValue: DataTypes.NOW,
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
      references: {
        model: 'user_page',
        key: 'id_user_page'
      },
      field: 'id_user_page'
    }
  }, {
    sequelize,
    tableName: 'profile',
    schema: 'pages',
    timestamps: true, // Utiliza timestamps automáticos
    createdAt: 'DateCreate',
    updatedAt: 'DateUpdate',
    hooks: {
      beforeCreate: (profile: Profile) => {
        const now = new Date();
        profile.DateCreate = now;
        profile.DateUpdate = now;

         // Concatenar Name, Firstname y Lastname para Fullname
         profile.Fullname = [profile.Name, profile.Firstname, profile.Lastname]
         .filter(Boolean) // Elimina valores undefined o null
         .join(' ');
      },
      beforeUpdate: (profile: Profile) => {
        profile.DateUpdate = new Date();
      }
    },
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
