import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Publications, PublicationsId } from './publications';

export interface TypePublicationAttributes {
  IdTypePublication: number;
  Type?: string;
}

export type TypePublicationPk = "IdTypePublication";
export type TypePublicationId = TypePublication[TypePublicationPk];
export type TypePublicationOptionalAttributes = "IdTypePublication" | "Type";
export type TypePublicationCreationAttributes = Optional<TypePublicationAttributes, TypePublicationOptionalAttributes>;

export class TypePublication extends Model<TypePublicationAttributes, TypePublicationCreationAttributes> implements TypePublicationAttributes {
  IdTypePublication!: number;
  Type?: string;

  // TypePublication hasMany Publications via IdTypePublication
  Publications!: Publications[];
  getPublications!: Sequelize.HasManyGetAssociationsMixin<Publications>;
  setPublications!: Sequelize.HasManySetAssociationsMixin<Publications, PublicationsId>;
  addPublication!: Sequelize.HasManyAddAssociationMixin<Publications, PublicationsId>;
  addPublications!: Sequelize.HasManyAddAssociationsMixin<Publications, PublicationsId>;
  createPublication!: Sequelize.HasManyCreateAssociationMixin<Publications>;
  removePublication!: Sequelize.HasManyRemoveAssociationMixin<Publications, PublicationsId>;
  removePublications!: Sequelize.HasManyRemoveAssociationsMixin<Publications, PublicationsId>;
  hasPublication!: Sequelize.HasManyHasAssociationMixin<Publications, PublicationsId>;
  hasPublications!: Sequelize.HasManyHasAssociationsMixin<Publications, PublicationsId>;
  countPublications!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof TypePublication {
    return TypePublication.init({
    IdTypePublication: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_type_publication'
    },
    Type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'type'
    }
  }, {
    sequelize,
    tableName: 'type_publication',
    schema: 'publication',
    timestamps: false,
    indexes: [
      {
        name: "typePublication_pkey",
        unique: true,
        fields: [
          { name: "id_type_publication" },
        ]
      },
    ]
  });
  }
}
