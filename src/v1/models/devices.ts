import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './user';

export interface DevicesAttributes {
  IdDevices: number;
  Status?: number;
  OperatingSystem?: string;
  SoVersion?: string;
  Navegador?: string;
  IdUser: string;
}

export type DevicesPk = "IdDevices";
export type DevicesId = Devices[DevicesPk];
export type DevicesOptionalAttributes = "Status" | "OperatingSystem" | "SoVersion" | "Navegador";
export type DevicesCreationAttributes = Optional<DevicesAttributes, DevicesOptionalAttributes>;

export class Devices extends Model<DevicesAttributes, DevicesCreationAttributes> implements DevicesAttributes {
  IdDevices!: number;
  Status?: number;
  OperatingSystem?: string;
  SoVersion?: string;
  Navegador?: string;
  IdUser!: string;

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
    Status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status'
    },
    OperatingSystem: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'operating_system'
    },
    SoVersion: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'so_version'
    },
    Navegador: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'navegador'
    },
    IdUser: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id_user'
      },
      field: 'id_user'
    }
  }, {
    sequelize,
    tableName: 'devices',
    schema: 'user',
    timestamps: false,
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
