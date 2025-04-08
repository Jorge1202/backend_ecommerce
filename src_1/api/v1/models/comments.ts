import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Publications, PublicationsId } from './publications';
import type { Reactions, ReactionsId } from './reactions';

export interface CommentsAttributes {
  IdComments: number;
  IdUser: string;
  IdPublication?: number;
  IdParentComment?: number;
  Content?: string;
  IdStatus?: number;
  IsEdit: boolean;
  DataCreate?: string;
  DataUpdate?: string;
}

export type CommentsPk = "IdComments";
export type CommentsId = Comments[CommentsPk];
export type CommentsOptionalAttributes = "IdComments" | "IdPublication" | "IdParentComment" | "Content" | "IdStatus" | "DataCreate" | "DataUpdate";
export type CommentsCreationAttributes = Optional<CommentsAttributes, CommentsOptionalAttributes>;

export class Comments extends Model<CommentsAttributes, CommentsCreationAttributes> implements CommentsAttributes {
  IdComments!: number;
  IdUser!: string;
  IdPublication?: number;
  IdParentComment?: number;
  Content?: string;
  IdStatus?: number;
  IsEdit!: boolean;
  DataCreate?: string;
  DataUpdate?: string;

  // Comments hasMany Reactions via IdComment
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
  // Comments belongsTo Publications via IdPublication
  IdPublicationPublication!: Publications;
  getIdPublicationPublication!: Sequelize.BelongsToGetAssociationMixin<Publications>;
  setIdPublicationPublication!: Sequelize.BelongsToSetAssociationMixin<Publications, PublicationsId>;
  createIdPublicationPublication!: Sequelize.BelongsToCreateAssociationMixin<Publications>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Comments {
    return Comments.init({
    IdComments: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_comments'
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
    IdParentComment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_parent_comment'
    },
    Content: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'content'
    },
    IdStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_status'
    },
    IsEdit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_edit'
    },
    DataCreate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'data_create'
    },
    DataUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'data_update'
    }
  }, {
    sequelize,
    tableName: 'comments',
    schema: 'publication',
    timestamps: false,
    indexes: [
      {
        name: "comments_pkey",
        unique: true,
        fields: [
          { name: "id_comments" },
        ]
      },
    ]
  });
  }
}
