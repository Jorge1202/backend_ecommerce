import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Reactions, ReactionsId } from './reactions';

export interface TypeReactionAttributes {
  IdTypeReaction: number;
  Type?: string;
}

export type TypeReactionPk = "IdTypeReaction";
export type TypeReactionId = TypeReaction[TypeReactionPk];
export type TypeReactionOptionalAttributes = "IdTypeReaction" | "Type";
export type TypeReactionCreationAttributes = Optional<TypeReactionAttributes, TypeReactionOptionalAttributes>;

export class TypeReaction extends Model<TypeReactionAttributes, TypeReactionCreationAttributes> implements TypeReactionAttributes {
  IdTypeReaction!: number;
  Type?: string;

  // TypeReaction hasMany Reactions via IdTypeReaction
  Reactions!: Reactions[];
  getReactions!: Sequelize.HasManyGetAssociationsMixin<Reactions>;
  setReactions!: Sequelize.HasManySetAssociationsMixin<Reactions, ReactionsId>;
  addReaction!: Sequelize.HasManyAddAssociationMixin<Reactions, ReactionsId>;
  addReactions!: Sequelize.HasManyAddAssociationsMixin<Reactions, ReactionsId>;
  createReaction!: Sequelize.HasManyCreateAssociationMixin<Reactions>;
  removeReaction!: Sequelize.HasManyRemoveAssociationMixin<Reactions, ReactionsId>;
  removeReactions!: Sequelize.HasManyRemoveAssociationsMixin<Reactions, ReactionsId>;
  hasReaction!: Sequelize.HasManyHasAssociationMixin<Reactions, ReactionsId>;
  hasReactions!: Sequelize.HasManyHasAssociationsMixin<Reactions, ReactionsId>;
  countReactions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof TypeReaction {
    return TypeReaction.init({
    IdTypeReaction: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_type_reaction'
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'type'
    }
  }, {
    sequelize,
    tableName: 'type_reaction',
    schema: 'publication',
    timestamps: false,
    indexes: [
      {
        name: "typeReaction_pkey",
        unique: true,
        fields: [
          { name: "id_type_reaction" },
        ]
      },
    ]
  });
  }
}
