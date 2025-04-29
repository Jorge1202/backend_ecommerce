import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { DeviceAuth, DeviceAuthId } from './device-auth';
import type { Login, LoginId } from './login';

export interface DevicesAttributes {
  UserAgent?: string;
  Plataform?: string;
  Token?: string;
  Mobile?: boolean;
  Ip?: string;
  Location?: string;
  DateCreate?: Date;
  DateUpdate?: Date;
  VersionPlataform?: string;
  Cpu?: string;
  Browser?: string;
  IdDevice: number;
  IsActive?: boolean;
  IdAuth: number;
}

export type DevicesPk = "IdDevice";
export type DevicesId = Devices[DevicesPk];
export type DevicesOptionalAttributes = "UserAgent" | "Plataform" | "Token" | "Mobile" | "Ip" | "Location" | "DateCreate" | "DateUpdate" | "VersionPlataform" | "Cpu" | "Browser" | "IdDevice" | "IsActive";
export type DevicesCreationAttributes = Optional<DevicesAttributes, DevicesOptionalAttributes>;

export class Devices extends Model<DevicesAttributes, DevicesCreationAttributes> implements DevicesAttributes {
  UserAgent?: string;
  Plataform?: string;
  Token?: string;
  Mobile?: boolean;
  Ip?: string;
  Location?: string;
  DateCreate?: Date;
  DateUpdate?: Date;
  VersionPlataform?: string;
  Cpu?: string;
  Browser?: string;
  IdDevice!: number;
  IsActive?: boolean;
  IdAuth!: number;

  // Devices hasMany DeviceAuth via IdDevice
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
  // Devices hasMany Login via IdDevices
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

  static initModel(sequelize: Sequelize.Sequelize): typeof Devices {
    return Devices.init({
    UserAgent: {
      type: DataTypes.STRING(160),
      allowNull: true,
      field: 'user_agent'
    },
    Plataform: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'plataform'
    },
    Token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'token'
    },
    Mobile: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'mobile '
    },
    Ip: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'ip'
    },
    Location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'location'
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
    VersionPlataform: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'version_plataform'
    },
    Cpu: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'cpu'
    },
    Browser: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'browser'
    },
    IdDevice: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_device'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'isActive'
    },
    IdAuth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_auth'
    }
  }, {
    sequelize,
    tableName: 'devices',
    schema: 'user',
    timestamps: true, // ✅ activa los timestamps
    createdAt: 'date_create', 
    updatedAt: 'date_update',
    indexes: [
      {
        name: "devices_pkey",
        unique: true,
        fields: [
          { name: "id_devices" },
        ]
      },
    ]
  });
  }
}
