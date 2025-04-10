import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Auth, AuthId } from './auth';
import type { DeviceAuth, DeviceAuthId } from './device-auth';

export interface RefreshTokenAttributes {
  IdRefreshToken: number;
  Token: string;
  ExpiresAt?: Date;
  IsActive: boolean;
  IdAuth?: number;
  IdDeviceAuth?: number;
  LastUsedAt?: Date;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type RefreshTokenPk = "IdRefreshToken";
export type RefreshTokenId = RefreshToken[RefreshTokenPk];
export type RefreshTokenOptionalAttributes = "IdRefreshToken" | "ExpiresAt" | "IsActive" | "IdAuth" | "IdDeviceAuth" | "LastUsedAt" | "CreatedAt" | "UpdatedAt";
export type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, RefreshTokenOptionalAttributes>;

export class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
  IdRefreshToken!: number;
  Token!: string;
  ExpiresAt?: Date;
  IsActive!: boolean;
  IdAuth?: number;
  IdDeviceAuth?: number;
  LastUsedAt?: Date;
  CreatedAt?: Date;
  UpdatedAt?: Date;

  // RefreshToken belongsTo Auth via IdAuth
  IdAuthAuth!: Auth;
  getIdAuthAuth!: Sequelize.BelongsToGetAssociationMixin<Auth>;
  setIdAuthAuth!: Sequelize.BelongsToSetAssociationMixin<Auth, AuthId>;
  createIdAuthAuth!: Sequelize.BelongsToCreateAssociationMixin<Auth>;
  // RefreshToken belongsTo DeviceAuth via IdDeviceAuth
  IdDeviceAuthDeviceAuth!: DeviceAuth;
  getIdDeviceAuthDeviceAuth!: Sequelize.BelongsToGetAssociationMixin<DeviceAuth>;
  setIdDeviceAuthDeviceAuth!: Sequelize.BelongsToSetAssociationMixin<DeviceAuth, DeviceAuthId>;
  createIdDeviceAuthDeviceAuth!: Sequelize.BelongsToCreateAssociationMixin<DeviceAuth>;

  static initModel(sequelize: Sequelize.Sequelize): typeof RefreshToken {
    return RefreshToken.init({
    IdRefreshToken: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_refresh_token'
    },
    Token: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'token'
    },
    ExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    IdAuth: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'auth',
        key: 'id_auth'
      },
      field: 'id_auth'
    },
    IdDeviceAuth: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'device_auth',
        key: 'id_device_auth'
      },
      field: 'id_device_auth'
    },
    LastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_used_at'
    }
  }, {
    sequelize,
    tableName: 'refresh_token',
    schema: 'user',
    timestamps: true,
    indexes: [
      {
        name: "refresh_token_pkey",
        unique: true,
        fields: [
          { name: "id_refresh_token" },
        ]
      },
    ]
  });
  }
}
