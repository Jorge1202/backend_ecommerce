import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Auth, AuthId } from './auth';

export interface CodeAutenticationAttributes {
  IdCodeAutentication: number;
  Codigo: string;
  Descripcion?: string;
  Status?: number;
  DateCreate: string;
  IdAuth: number;
}

export type CodeAutenticationPk = "IdCodeAutentication";
export type CodeAutenticationId = CodeAutentication[CodeAutenticationPk];
export type CodeAutenticationOptionalAttributes = "Descripcion" | "Status";
export type CodeAutenticationCreationAttributes = Optional<CodeAutenticationAttributes, CodeAutenticationOptionalAttributes>;

export class CodeAutentication extends Model<CodeAutenticationAttributes, CodeAutenticationCreationAttributes> implements CodeAutenticationAttributes {
  IdCodeAutentication!: number;
  Codigo!: string;
  Descripcion?: string;
  Status?: number;
  DateCreate!: string;
  IdAuth!: number;

  // CodeAutentication belongsTo Auth via IdAuth
  IdAuthAuth!: Auth;
  getIdAuthAuth!: Sequelize.BelongsToGetAssociationMixin<Auth>;
  setIdAuthAuth!: Sequelize.BelongsToSetAssociationMixin<Auth, AuthId>;
  createIdAuthAuth!: Sequelize.BelongsToCreateAssociationMixin<Auth>;

  static initModel(sequelize: Sequelize.Sequelize): typeof CodeAutentication {
    return CodeAutentication.init({
    IdCodeAutentication: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_code_autentication'
    },
    Codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'codigo'
    },
    Descripcion: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'descripcion'
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status'
    },
    DateCreate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_create'
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
    tableName: 'code_autentication',
    schema: 'user',
    timestamps: false,
    indexes: [
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
