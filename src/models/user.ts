import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Auth, AuthId } from './auth';
import type { Devices, DevicesId } from './devices';

export interface UserAttributes {
  IdUser: string;
  Email: string;
  Username: string;
  Name: string;
  Firstname: string;
  Lastname?: string;
  Phone?: string;
  Genero?: string;
  Active?: boolean;
  DateCreate?: Date;
  DateUpdate?: Date;
}

export type UserPk = "IdUser";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "Lastname" | "Phone" | "Genero" | "Active" | "DateCreate" | "DateUpdate";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  IdUser!: string;
  Email!: string;
  Username!: string;
  Name!: string;
  Firstname!: string;
  Lastname?: string;
  Phone?: string;
  Genero?: string;
  Active?: boolean;
  DateCreate?: Date;
  DateUpdate?: Date;

  // User hasMany Auth via IdUser
  Auths!: Auth[];
  getAuths!: Sequelize.HasManyGetAssociationsMixin<Auth>;
  setAuths!: Sequelize.HasManySetAssociationsMixin<Auth, AuthId>;
  addAuth!: Sequelize.HasManyAddAssociationMixin<Auth, AuthId>;
  addAuths!: Sequelize.HasManyAddAssociationsMixin<Auth, AuthId>;
  createAuth!: Sequelize.HasManyCreateAssociationMixin<Auth>;
  removeAuth!: Sequelize.HasManyRemoveAssociationMixin<Auth, AuthId>;
  removeAuths!: Sequelize.HasManyRemoveAssociationsMixin<Auth, AuthId>;
  hasAuth!: Sequelize.HasManyHasAssociationMixin<Auth, AuthId>;
  hasAuths!: Sequelize.HasManyHasAssociationsMixin<Auth, AuthId>;
  countAuths!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany Devices via IdUser
  Devices!: Devices[];
  getDevices!: Sequelize.HasManyGetAssociationsMixin<Devices>;
  setDevices!: Sequelize.HasManySetAssociationsMixin<Devices, DevicesId>;
  addDevice!: Sequelize.HasManyAddAssociationMixin<Devices, DevicesId>;
  addDevices!: Sequelize.HasManyAddAssociationsMixin<Devices, DevicesId>;
  createDevice!: Sequelize.HasManyCreateAssociationMixin<Devices>;
  removeDevice!: Sequelize.HasManyRemoveAssociationMixin<Devices, DevicesId>;
  removeDevices!: Sequelize.HasManyRemoveAssociationsMixin<Devices, DevicesId>;
  hasDevice!: Sequelize.HasManyHasAssociationMixin<Devices, DevicesId>;
  hasDevices!: Sequelize.HasManyHasAssociationsMixin<Devices, DevicesId>;
  countDevices!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init({
    IdUser: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'id_user'
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'email'
    },
    Username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'username'
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name'
    },
    Firstname: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'firstname'
    },
    Lastname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'lastname'
    },
    Phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'phone'
    },
    Genero: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'genero'
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'active'
    },
    DateCreate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW, // Establece fecha y hora actuales
      field: 'date_create'
    },
    DateUpdate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_update'
    }
  }, {
    sequelize,
    tableName: 'user',
    schema: 'user',
    timestamps: true, // Utiliza timestamps automáticos
    createdAt: 'DateCreate',
    updatedAt: 'DateUpdate',
    hooks: {
      beforeCreate: (user: User) => {
        const now = new Date();
        user.DateCreate = now;
        user.DateUpdate = now;
      },
      beforeUpdate: (user: User) => {
        user.DateUpdate = new Date();
      }
    },
    indexes: [
      {
        name: "id_user_pkey",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
  }
}
