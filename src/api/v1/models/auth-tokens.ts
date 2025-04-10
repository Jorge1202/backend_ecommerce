import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface AuthTokensAttributes {
  Id: number;
  Token: string;
  IdAuth: number;
  Status?: number;
  CreatedAt?: Date;
  TypeTokens: number;
  ExpiresIn: Date;
}

export type AuthTokensPk = "Id";
export type AuthTokensId = AuthTokens[AuthTokensPk];
export type AuthTokensOptionalAttributes = "Id" | "Status" | "CreatedAt";
export type AuthTokensCreationAttributes = Optional<AuthTokensAttributes, AuthTokensOptionalAttributes>;

export class AuthTokens extends Model<AuthTokensAttributes, AuthTokensCreationAttributes> implements AuthTokensAttributes {
  Id!: number;
  Token!: string;
  IdAuth!: number;
  Status?: number;
  CreatedAt?: Date;
  TypeTokens!: number;
  ExpiresIn!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof AuthTokens {
    return AuthTokens.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    Token: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'token'
    },
    IdAuth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idAuth'
    },
    Status: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 1,
      field: 'status'
    },
    TypeTokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'typeTokens'
    },
    ExpiresIn: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expiresIn'
    }
  }, {
    sequelize,
    tableName: 'authTokens',
    schema: 'user',
    timestamps: true,
    indexes: [
      {
        name: "AuthTokens_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
