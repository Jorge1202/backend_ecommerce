import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Multimedia, MultimediaId } from './multimedia';

export interface TypeMultimediaAttributes {
  IdTypeMultimedia: number;
  Descripcion: string;
}

export type TypeMultimediaPk = "IdTypeMultimedia";
export type TypeMultimediaId = TypeMultimedia[TypeMultimediaPk];
export type TypeMultimediaOptionalAttributes = "IdTypeMultimedia";
export type TypeMultimediaCreationAttributes = Optional<TypeMultimediaAttributes, TypeMultimediaOptionalAttributes>;

export class TypeMultimedia extends Model<TypeMultimediaAttributes, TypeMultimediaCreationAttributes> implements TypeMultimediaAttributes {
  IdTypeMultimedia!: number;
  Descripcion!: string;

  // TypeMultimedia hasMany Multimedia via IdTipoMultimedia
  Multimedia!: Multimedia[];
  getMultimedia!: Sequelize.HasManyGetAssociationsMixin<Multimedia>;
  setMultimedia!: Sequelize.HasManySetAssociationsMixin<Multimedia, MultimediaId>;
  addMultimedium!: Sequelize.HasManyAddAssociationMixin<Multimedia, MultimediaId>;
  addMultimedia!: Sequelize.HasManyAddAssociationsMixin<Multimedia, MultimediaId>;
  createMultimedium!: Sequelize.HasManyCreateAssociationMixin<Multimedia>;
  removeMultimedium!: Sequelize.HasManyRemoveAssociationMixin<Multimedia, MultimediaId>;
  removeMultimedia!: Sequelize.HasManyRemoveAssociationsMixin<Multimedia, MultimediaId>;
  hasMultimedium!: Sequelize.HasManyHasAssociationMixin<Multimedia, MultimediaId>;
  hasMultimedia!: Sequelize.HasManyHasAssociationsMixin<Multimedia, MultimediaId>;
  countMultimedia!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof TypeMultimedia {
    return TypeMultimedia.init({
    IdTypeMultimedia: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_type_multimedia'
    },
    Descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'descripcion'
    }
  }, {
    sequelize,
    tableName: 'type_multimedia',
    schema: 'multimedia',
    timestamps: false,
    indexes: [
      {
        name: "tipoMultimedia_pkey",
        unique: true,
        fields: [
          { name: "id_type_multimedia" },
        ]
      },
    ]
  });
  }
}
