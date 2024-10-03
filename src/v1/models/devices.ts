import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './user';

export interface DevicesAttributes {
  IdDevices: number;
  IsActive?: number;
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
}

export type DevicesPk = "IdDevices";
export type DevicesId = Devices[DevicesPk];
export type DevicesOptionalAttributes = "IdDevices" | "IsActive" | "UserAgent" | "Plataform" | "IdUser" | "Token" | "Mobile" | "Ip" | "Location" | "DateCreate" | "DateUpdate" | "VersionPlataform" | "Cpu" | "Browser";
export type DevicesCreationAttributes = Optional<DevicesAttributes, DevicesOptionalAttributes>;

export class Devices extends Model<DevicesAttributes, DevicesCreationAttributes> implements DevicesAttributes {
  IdDevices!: number;
  IsActive?: number;
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

  // Devices belongsTo User via IdUser
  IdUserUser!: User;
  getIdUserUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setIdUserUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createIdUserUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Devices {
    return Devices.init({
    IdDevices: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_devices'
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
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'token'
    },
    IsActive: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'isActive'
    },
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
    VersionPlataform: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'version_plataform'
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
        name: "dispositivos_pkey",
        unique: true,
        fields: [
          { name: "id_devices" },
        ]
      },
    ]
  });
  }
}
