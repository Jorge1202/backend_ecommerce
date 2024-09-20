import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { CodeAutentication, CodeAutenticationId } from './code-autentication';
import type { Login, LoginId } from './login';
import type { User, UserId } from './user';

export interface AuthAttributes {
  IdAuth: number;
  Password: string;
  Status?: number;
  IdUser: string;
  DataCreate: Date;
  DataUpdate?: Date;
} 

export type AuthPk = "IdAuth";
export type AuthId = Auth[AuthPk];
export type AuthOptionalAttributes = "IdAuth" | "Status" | "DataUpdate";
export type AuthCreationAttributes = Optional<AuthAttributes, AuthOptionalAttributes>;

export class Auth extends Model<AuthAttributes, AuthCreationAttributes> implements AuthAttributes {
  IdAuth!: number;
  Password!: string;
  Status?: number;
  IdUser!: string;
  DataCreate!: Date;
  DataUpdate?: Date;

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
  // Auth belongsTo User via IdUser
  IdUserUser!: User;
  getIdUserUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setIdUserUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createIdUserUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

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
      references: {
        model: 'user',
        key: 'id_user'
      },
      field: 'id_user'
    },
    DataCreate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Establece fecha y hora actuales
      field: 'date_create'
    },
    DataUpdate: {
      type: DataTypes.DATE, // Tipo DATE para fecha y hora
      allowNull: true,      
      field: 'date_update',
    }
  }, {
    sequelize,
    tableName: 'auth',
    schema: 'user',
    timestamps: true, // Utiliza timestamps automáticos
    createdAt: 'DataCreate',
    updatedAt: 'DataUpdate',
    hooks: {
      beforeCreate: (auth: Auth) => {
        const now = new Date();
        auth.DataCreate = now;
        auth.DataUpdate = now;
      },
      beforeUpdate: (auth: Auth) => {
        auth.DataUpdate = new Date();
      }
    },
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
