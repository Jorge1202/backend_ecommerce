import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { TypeMultimedia, TypeMultimediaId } from './type-multimedia';

export interface MultimediaAttributes {
  IdMultimedia: string;
  Url: string;
  Modelight?: boolean;
  UrlImgLight?: string;
  IdTipoMultimedia?: number;
  DateCreate: string;
  DateUpdate?: string;
  UserCreate: string;
  UserUpdate?: string;
}

export type MultimediaPk = "IdMultimedia";
export type MultimediaId = Multimedia[MultimediaPk];
export type MultimediaOptionalAttributes = "Modelight" | "UrlImgLight" | "IdTipoMultimedia" | "DateUpdate" | "UserUpdate";
export type MultimediaCreationAttributes = Optional<MultimediaAttributes, MultimediaOptionalAttributes>;

export class Multimedia extends Model<MultimediaAttributes, MultimediaCreationAttributes> implements MultimediaAttributes {
  IdMultimedia!: string;
  Url!: string;
  Modelight?: boolean;
  UrlImgLight?: string;
  IdTipoMultimedia?: number;
  DateCreate!: string;
  DateUpdate?: string;
  UserCreate!: string;
  UserUpdate?: string;

  // Multimedia belongsTo TypeMultimedia via IdTipoMultimedia
  IdTipoMultimediaTypeMultimedium!: TypeMultimedia;
  getIdTipoMultimediaTypeMultimedium!: Sequelize.BelongsToGetAssociationMixin<TypeMultimedia>;
  setIdTipoMultimediaTypeMultimedium!: Sequelize.BelongsToSetAssociationMixin<TypeMultimedia, TypeMultimediaId>;
  createIdTipoMultimediaTypeMultimedium!: Sequelize.BelongsToCreateAssociationMixin<TypeMultimedia>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Multimedia {
    return Multimedia.init({
    IdMultimedia: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      field: 'id_multimedia'
    },
    Url: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'url'
    },
    Modelight: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'modelight'
    },
    UrlImgLight: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'url_img_light'
    },
    IdTipoMultimedia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'type_multimedia',
        key: 'id_type_multimedia'
      },
      field: 'id_tipo_multimedia'
    },
    DateCreate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_create'
    },
    DateUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_update'
    },
    UserCreate: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'user_create'
    },
    UserUpdate: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'user_update'
    }
  }, {
    sequelize,
    tableName: 'multimedia',
    schema: 'multimedia',
    timestamps: true, // ✅ activa los timestamps
    createdAt: 'DateCreate', 
    updatedAt: 'DateUpdate', 
    indexes: [
      {
        name: "multimedia_pkey",
        unique: true,
        fields: [
          { name: "id_multimedia" },
        ]
      },
    ]
  });
  }
}
