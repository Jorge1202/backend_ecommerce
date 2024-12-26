import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Auth, AuthId } from './auth';
import type { Devices, DevicesId } from './devices';
import type { RefreshToken, RefreshTokenId } from './refresh-token';

export interface DeviceAuthAttributes {
  IdDeviceAuth: number;
  IdDevice: number;
  IdAuth: number;
}

export type DeviceAuthPk = "IdDeviceAuth";
export type DeviceAuthId = DeviceAuth[DeviceAuthPk];
export type DeviceAuthOptionalAttributes = "IdDeviceAuth";
export type DeviceAuthCreationAttributes = Optional<DeviceAuthAttributes, DeviceAuthOptionalAttributes>;

export class DeviceAuth extends Model<DeviceAuthAttributes, DeviceAuthCreationAttributes> implements DeviceAuthAttributes {
  IdDeviceAuth!: number;
  IdDevice!: number;
  IdAuth!: number;

  // DeviceAuth belongsTo Auth via IdAuth
  IdAuthAuth!: Auth;
  getIdAuthAuth!: Sequelize.BelongsToGetAssociationMixin<Auth>;
  setIdAuthAuth!: Sequelize.BelongsToSetAssociationMixin<Auth, AuthId>;
  createIdAuthAuth!: Sequelize.BelongsToCreateAssociationMixin<Auth>;
  // DeviceAuth hasMany RefreshToken via IdDeviceAuth
  RefreshTokens!: RefreshToken[];
  getRefreshTokens!: Sequelize.HasManyGetAssociationsMixin<RefreshToken>;
  setRefreshTokens!: Sequelize.HasManySetAssociationsMixin<RefreshToken, RefreshTokenId>;
  addRefreshToken!: Sequelize.HasManyAddAssociationMixin<RefreshToken, RefreshTokenId>;
  addRefreshTokens!: Sequelize.HasManyAddAssociationsMixin<RefreshToken, RefreshTokenId>;
  createRefreshToken!: Sequelize.HasManyCreateAssociationMixin<RefreshToken>;
  removeRefreshToken!: Sequelize.HasManyRemoveAssociationMixin<RefreshToken, RefreshTokenId>;
  removeRefreshTokens!: Sequelize.HasManyRemoveAssociationsMixin<RefreshToken, RefreshTokenId>;
  hasRefreshToken!: Sequelize.HasManyHasAssociationMixin<RefreshToken, RefreshTokenId>;
  hasRefreshTokens!: Sequelize.HasManyHasAssociationsMixin<RefreshToken, RefreshTokenId>;
  countRefreshTokens!: Sequelize.HasManyCountAssociationsMixin;
  // DeviceAuth belongsTo Devices via IdDevice
  IdDeviceDevice!: Devices;
  getIdDeviceDevice!: Sequelize.BelongsToGetAssociationMixin<Devices>;
  setIdDeviceDevice!: Sequelize.BelongsToSetAssociationMixin<Devices, DevicesId>;
  createIdDeviceDevice!: Sequelize.BelongsToCreateAssociationMixin<Devices>;

  static initModel(sequelize: Sequelize.Sequelize): typeof DeviceAuth {
    return DeviceAuth.init({
    IdDeviceAuth: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_device_auth'
    },
    IdDevice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'devices',
        key: 'id_devices'
      },
      field: 'id_device'
    },
    IdAuth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'auth',
        key: 'id_auth'
      },
      field: 'id_auth'
    }
  }, {
    sequelize,
    tableName: 'device_auth',
    schema: 'user',
    timestamps: false,
    indexes: [
      {
        name: "user_device_pkey",
        unique: true,
        fields: [
          { name: "id_device_auth" },
        ]
      },
    ]
  });
  }
}
