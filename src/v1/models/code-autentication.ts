import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Auth, AuthId } from './auth';

export interface CodeAutenticationAttributes {
  IdCodeAutentication: number;
  Code: string;
  Description?: string;
  IsActive?: boolean;
  IdAuth: number;
  DateCreate?: Date;
  DateUpdate?: Date;
}

export type CodeAutenticationPk = "IdCodeAutentication";
export type CodeAutenticationId = CodeAutentication[CodeAutenticationPk];
export type CodeAutenticationOptionalAttributes = "IdCodeAutentication" | "Description" | "IsActive" | "DateCreate" | "DateUpdate";
export type CodeAutenticationCreationAttributes = Optional<CodeAutenticationAttributes, CodeAutenticationOptionalAttributes>;

export class CodeAutentication extends Model<CodeAutenticationAttributes, CodeAutenticationCreationAttributes> implements CodeAutenticationAttributes {
  IdCodeAutentication!: number;
  Code!: string;
  Description?: string;
  IsActive?: boolean;
  IdAuth!: number;
  DateCreate?: Date;
  DateUpdate?: Date;

  // CodeAutentication belongsTo Auth via IdAuth
  IdAuthAuth!: Auth;
  getIdAuthAuth!: Sequelize.BelongsToGetAssociationMixin<Auth>;
  setIdAuthAuth!: Sequelize.BelongsToSetAssociationMixin<Auth, AuthId>;
  createIdAuthAuth!: Sequelize.BelongsToCreateAssociationMixin<Auth>;

  static initModel(sequelize: Sequelize.Sequelize): typeof CodeAutentication {
    return CodeAutentication.init({
    IdCodeAutentication: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_code_autentication'
    },
    Code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'code'
    },
    Description: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'description'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'is_active'
    },
    IdAuth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'auth',
        key: 'id_auth'
      },
      field: 'id_auth'
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
    }
  }, {
    sequelize,
    tableName: 'code_autentication',
    schema: 'user',
    timestamps: true,
    createdAt: 'DateCreate',
    updatedAt: 'DateUpdate',
    hooks: {
      beforeCreate: (codes: CodeAutentication) => {
        const now = new Date();
        codes.DateCreate = now;
        codes.DateUpdate = now;
      },
      beforeUpdate: (codes: CodeAutentication) => {
        codes.DateUpdate = new Date();
      }
    },
    indexes: [
      {
        name: "code_autentication_1_pkey",
        unique: true,
        fields: [
          { name: "id_code_autentication" },
        ]
      },
      {
        name: "codigosAutentication_pkey",
        unique: true,
        fields: [
          { name: "id_code_autentication" },
        ]
      },
    ]
  });
  }
}
