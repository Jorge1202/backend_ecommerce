import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface RefreshTokenAttributes {
  IdRefreshToken: number;
  Token: string;
  ExpiresAt?: Date;
  IdAuth: number;
  IdDevice: number;
  LastUsedAt?: Date;
  CreatedAt: Date;
  UpdatedAt: Date;
  IsActive: boolean;
}

export type RefreshTokenPk = "IdRefreshToken";
export type RefreshTokenId = RefreshToken[RefreshTokenPk];
export type RefreshTokenOptionalAttributes = "IdRefreshToken" | "ExpiresAt" | "LastUsedAt" | "CreatedAt" | "UpdatedAt" | "IsActive";
export type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, RefreshTokenOptionalAttributes>;

export class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
  IdRefreshToken!: number;
  Token!: string;
  ExpiresAt?: Date;
  IdAuth!: number;
  IdDevice!: number;
  LastUsedAt?: Date;
  CreatedAt!: Date;
  UpdatedAt!: Date;
  IsActive!: boolean;


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
    IdAuth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_auth'
    },
    IdDevice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_device'
    },
    LastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_used_at'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
      field: 'created_at'
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'refresh_token',
    schema: 'user',
    timestamps: true, // ✅ activa los timestamps
    createdAt: 'CreatedAt', 
    updatedAt: 'UpdatedAt', 
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
