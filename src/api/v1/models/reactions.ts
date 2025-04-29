import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Comments, CommentsId } from './comments';
import type { Publications, PublicationsId } from './publications';
import type { TypeReaction, TypeReactionId } from './type-reaction';

export interface ReactionsAttributes {
  IdReactions: number;
  IdUser: string;
  IdPublication?: number;
  IdComment?: number;
  IdTypeReaction: number;
  DateCreate?: string;
  DateUpdate?: string;
}

export type ReactionsPk = "IdReactions";
export type ReactionsId = Reactions[ReactionsPk];
export type ReactionsOptionalAttributes = "IdReactions" | "IdPublication" | "IdComment" | "DateCreate" | "DateUpdate";
export type ReactionsCreationAttributes = Optional<ReactionsAttributes, ReactionsOptionalAttributes>;

export class Reactions extends Model<ReactionsAttributes, ReactionsCreationAttributes> implements ReactionsAttributes {
  IdReactions!: number;
  IdUser!: string;
  IdPublication?: number;
  IdComment?: number;
  IdTypeReaction!: number;
  DateCreate?: string;
  DateUpdate?: string;

  // Reactions belongsTo Comments via IdComment
  IdCommentComment!: Comments;
  getIdCommentComment!: Sequelize.BelongsToGetAssociationMixin<Comments>;
  setIdCommentComment!: Sequelize.BelongsToSetAssociationMixin<Comments, CommentsId>;
  createIdCommentComment!: Sequelize.BelongsToCreateAssociationMixin<Comments>;
  // Reactions belongsTo Publications via IdPublication
  IdPublicationPublication!: Publications;
  getIdPublicationPublication!: Sequelize.BelongsToGetAssociationMixin<Publications>;
  setIdPublicationPublication!: Sequelize.BelongsToSetAssociationMixin<Publications, PublicationsId>;
  createIdPublicationPublication!: Sequelize.BelongsToCreateAssociationMixin<Publications>;
  // Reactions belongsTo TypeReaction via IdTypeReaction
  IdTypeReactionTypeReaction!: TypeReaction;
  getIdTypeReactionTypeReaction!: Sequelize.BelongsToGetAssociationMixin<TypeReaction>;
  setIdTypeReactionTypeReaction!: Sequelize.BelongsToSetAssociationMixin<TypeReaction, TypeReactionId>;
  createIdTypeReactionTypeReaction!: Sequelize.BelongsToCreateAssociationMixin<TypeReaction>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Reactions {
    return Reactions.init({
    IdReactions: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_reactions'
    },
    IdUser: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'id_user'
    },
    IdPublication: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'publications',
        key: 'id_publications'
      },
      field: 'id_publication'
    },
    IdComment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id_comments'
      },
      field: 'id_comment'
    },
    IdTypeReaction: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'type_reaction',
        key: 'id_type_reaction'
      },
      field: 'id_type_reaction'
    },
    DateCreate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_create'
    },
    DateUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_update'
    }
  }, {
    sequelize,
    tableName: 'reactions',
    schema: 'publication',
    timestamps: true, // ✅ activa los timestamps
    createdAt: 'DateCreate', 
    updatedAt: 'DateUpdate', 
    indexes: [
      {
        name: "reactions_pkey",
        unique: true,
        fields: [
          { name: "id_reactions" },
        ]
      },
    ]
  });
  }
}
