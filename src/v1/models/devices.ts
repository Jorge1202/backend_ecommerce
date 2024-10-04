import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Login, LoginId } from './login';
import type { User, UserId } from './user';

export interface DevicesAttributes {
  UserAgent?: string;
  Plataform?: string;
  IdUser?: string;
  Token?: string;
  Mobile?: boolean;
  Ip?: string;
  Location?: string;
  DateCreate?: Date;
  DateUpdate?: Date;
  VersionPlataform?: string;
  Cpu?: string;
  Browser?: string;
  IdDevices: number;
  IsActive?: boolean;
}

export type DevicesPk = "IdDevices";
export type DevicesId = Devices[DevicesPk];
export type DevicesOptionalAttributes = "UserAgent" | "Plataform" | "IdUser" | "Token" | "Mobile" | "Ip" | "Location" | "DateCreate" | "DateUpdate" | "VersionPlataform" | "Cpu" | "Browser" | "IdDevices" | "IsActive";
export type DevicesCreationAttributes = Optional<DevicesAttributes, DevicesOptionalAttributes>;

export class Devices extends Model<DevicesAttributes, DevicesCreationAttributes> implements DevicesAttributes {
  UserAgent?: string;
  Plataform?: string;
  IdUser?: string;
  Token?: string;
  Mobile?: boolean;
  Ip?: string;
  Location?: string;
  DateCreate?: Date;
  DateUpdate?: Date;
  VersionPlataform?: string;
  Cpu?: string;
  Browser?: string;
  IdDevices!: number;
  IsActive?: boolean;

  // Devices hasMany Login via IdDevice
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
  // Devices belongsTo User via IdUser
  IdUserUser!: User;
  getIdUserUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setIdUserUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createIdUserUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

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
    IdUser: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id_user'
      },
      field: 'id_user'
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
    IdDevices: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_devices'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'isActive'
    }
  }, {
    sequelize,
    tableName: 'devices',
    schema: 'user',
    timestamps: true, // Utiliza timestamps automáticos
    createdAt: 'DateCreate',
    updatedAt: 'DateUpdate',
    hooks: {
      beforeCreate: (device: Devices) => {
        const now = new Date();
        device.DateCreate = now;
        device.DateUpdate = now;
      },
      beforeUpdate: (device: Devices) => {
        device.DateUpdate = new Date();
      }
    },
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
