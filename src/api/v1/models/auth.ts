import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { CodeAutentication, CodeAutenticationId } from './code-autentication';
import type { DeviceAuth, DeviceAuthId } from './device-auth';
import type { Login, LoginId } from './login';

export interface AuthAttributes {
  IdAuth: number;
  Password: string;
  Status: number;
  IdUser: string;
  DateCreate?: Date;
  DateUpdate?: Date;
  Pw?: string;
  Username: string;
  Email: string;
}

export type AuthPk = "IdAuth";
export type AuthId = Auth[AuthPk];
export type AuthOptionalAttributes = "IdAuth" | "Status" | "DateCreate" | "DateUpdate" | "Pw";
export type AuthCreationAttributes = Optional<AuthAttributes, AuthOptionalAttributes>;

export class Auth extends Model<AuthAttributes, AuthCreationAttributes> implements AuthAttributes {
  IdAuth!: number;
  Password!: string;
  Status!: number;
  IdUser!: string;
  DateCreate?: Date;
  DateUpdate?: Date;
  Pw?: string;
  Username!: string;
  Email!: string;

  // Auth hasMany CodeAutentication via IdAuth
  CodeAutentications!: CodeAutentication[];
  getCodeAutentications!: Sequelize.HasManyGetAssociationsMixin<CodeAutentication>;
  setCodeAutentications!: Sequelize.HasManySetAssociationsMixin<CodeAutentication, CodeAutenticationId>;
  addCodeAutentication!: Sequelize.HasManyAddAssociationMixin<CodeAutentication, CodeAutenticationId>;
  addCodeAutentications!: Sequelize.HasManyAddAssociationsMixin<CodeAutentication, CodeAutenticationId>;
  createCodeAutentication!: Sequelize.HasManyCreateAssociationMixin<CodeAutentication>;
  removeCodeAutentication!: Sequelize.HasManyRemoveAssociationMixin<CodeAutentication, CodeAutenticationId>;
  removeCodeAutentications!: Sequelize.HasManyRemoveAssociationsMixin<CodeAutentication, CodeAutenticationId>;
  hasCodeAutentication!: Sequelize.HasManyHasAssociationMixin<CodeAutentication, CodeAutenticationId>;
  hasCodeAutentications!: Sequelize.HasManyHasAssociationsMixin<CodeAutentication, CodeAutenticationId>;
  countCodeAutentications!: Sequelize.HasManyCountAssociationsMixin;
  // Auth hasMany DeviceAuth via IdAuth
  DeviceAuths!: DeviceAuth[];
  getDeviceAuths!: Sequelize.HasManyGetAssociationsMixin<DeviceAuth>;
  setDeviceAuths!: Sequelize.HasManySetAssociationsMixin<DeviceAuth, DeviceAuthId>;
  addDeviceAuth!: Sequelize.HasManyAddAssociationMixin<DeviceAuth, DeviceAuthId>;
  addDeviceAuths!: Sequelize.HasManyAddAssociationsMixin<DeviceAuth, DeviceAuthId>;
  createDeviceAuth!: Sequelize.HasManyCreateAssociationMixin<DeviceAuth>;
  removeDeviceAuth!: Sequelize.HasManyRemoveAssociationMixin<DeviceAuth, DeviceAuthId>;
  removeDeviceAuths!: Sequelize.HasManyRemoveAssociationsMixin<DeviceAuth, DeviceAuthId>;
  hasDeviceAuth!: Sequelize.HasManyHasAssociationMixin<DeviceAuth, DeviceAuthId>;
  hasDeviceAuths!: Sequelize.HasManyHasAssociationsMixin<DeviceAuth, DeviceAuthId>;
  countDeviceAuths!: Sequelize.HasManyCountAssociationsMixin;
  // Auth hasMany Login via IdAuth
  Logins!: Login[];
  getLogins!: Sequelize.HasManyGetAssociationsMixin<Login>;
  setLogins!: Sequelize.HasManySetAssociationsMixin<Login, LoginId>;
  addLogin!: Sequelize.HasManyAddAssociationMixin<Login, LoginId>;
  addLogins!: Sequelize.HasManyAddAssociationsMixin<Login, LoginId>;
  createLogin!: Sequelize.HasManyCreateAssociationMixin<Login>;
  removeLogin!: Sequelize.HasManyRemoveAssociationMixin<Login, LoginId>;
  removeLogins!: Sequelize.HasManyRemoveAssociationsMixin<Login, LoginId>;
  hasLogin!: Sequelize.HasManyHasAssociationMixin<Login, LoginId>;
  hasLogins!: Sequelize.HasManyHasAssociationsMixin<Login, LoginId>;
  countLogins!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Auth {
    return Auth.init({
    IdAuth: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_auth'
    },
    Password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'password'
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'status'
    },
    IdUser: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'id_user'
    },
    DateCreate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_create'
    },
    DateUpdate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_update'
    },
    Pw: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'pw'
    },
    Username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'username'
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'email'
    }
  }, {
    sequelize,
    tableName: 'auth',
    schema: 'user',
    timestamps: false,
    indexes: [
      {
        name: "auth_pkey",
        unique: true,
        fields: [
          { name: "id_auth" },
        ]
      },
    ]
  });
  }
}
