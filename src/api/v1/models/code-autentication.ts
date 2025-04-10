import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Auth, AuthId } from './auth';
import type { TypeCode, TypeCodeId } from './type-code';

export interface CodeAutenticationAttributes {
  IdCodeAutentication: number;
  Code?: string;
  IsActive?: boolean;
  IdAuth: number;
  DateCreate?: Date;
  DateUpdate?: Date;
  IdTypeCode?: number;
  Description?: string;
}

export type CodeAutenticationPk = "IdCodeAutentication";
export type CodeAutenticationId = CodeAutentication[CodeAutenticationPk];
export type CodeAutenticationOptionalAttributes = "IdCodeAutentication" | "Code" | "IsActive" | "DateCreate" | "DateUpdate" | "IdTypeCode" | "Description";
export type CodeAutenticationCreationAttributes = Optional<CodeAutenticationAttributes, CodeAutenticationOptionalAttributes>;

export class CodeAutentication extends Model<CodeAutenticationAttributes, CodeAutenticationCreationAttributes> implements CodeAutenticationAttributes {
  IdCodeAutentication!: number;
  Code?: string;
  IsActive?: boolean;
  IdAuth!: number;
  DateCreate?: Date;
  DateUpdate?: Date;
  IdTypeCode?: number;
  Description?: string;

  // CodeAutentication belongsTo Auth via IdAuth
  IdAuthAuth!: Auth;
  getIdAuthAuth!: Sequelize.BelongsToGetAssociationMixin<Auth>;
  setIdAuthAuth!: Sequelize.BelongsToSetAssociationMixin<Auth, AuthId>;
  createIdAuthAuth!: Sequelize.BelongsToCreateAssociationMixin<Auth>;
  // CodeAutentication belongsTo TypeCode via IdTypeCode
  IdTypeCodeTypeCode!: TypeCode;
  getIdTypeCodeTypeCode!: Sequelize.BelongsToGetAssociationMixin<TypeCode>;
  setIdTypeCodeTypeCode!: Sequelize.BelongsToSetAssociationMixin<TypeCode, TypeCodeId>;
  createIdTypeCodeTypeCode!: Sequelize.BelongsToCreateAssociationMixin<TypeCode>;

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
      allowNull: true,
      field: 'code'
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
    },
    IdTypeCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'type_code',
        key: 'id'
      },
      field: 'id_type_code'
    },
    Description: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'description'
    }
  }, {
    sequelize,
    tableName: 'code_autentication',
    schema: 'user',
    timestamps: false,
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
