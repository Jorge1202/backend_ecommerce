import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Comments, CommentsId } from './comments';
import type { Posts, PostsId } from './posts';
import type { Reactions, ReactionsId } from './reactions';
import type { Share, ShareId } from './share';
import type { TypePublication, TypePublicationId } from './type-publication';

export interface PublicationsAttributes {
  IdPublications: number;
  IdPostProduct?: number;
  IdTypePublication?: number;
  Active?: boolean;
  DataCreate?: string;
  DataUpdate?: string;
}

export type PublicationsPk = "IdPublications";
export type PublicationsId = Publications[PublicationsPk];
export type PublicationsOptionalAttributes = "IdPublications" | "IdPostProduct" | "IdTypePublication" | "Active" | "DataCreate" | "DataUpdate";
export type PublicationsCreationAttributes = Optional<PublicationsAttributes, PublicationsOptionalAttributes>;

export class Publications extends Model<PublicationsAttributes, PublicationsCreationAttributes> implements PublicationsAttributes {
  IdPublications!: number;
  IdPostProduct?: number;
  IdTypePublication?: number;
  Active?: boolean;
  DataCreate?: string;
  DataUpdate?: string;

  // Publications belongsTo Posts via IdPostProduct
  IdPostProductPost!: Posts;
  getIdPostProductPost!: Sequelize.BelongsToGetAssociationMixin<Posts>;
  setIdPostProductPost!: Sequelize.BelongsToSetAssociationMixin<Posts, PostsId>;
  createIdPostProductPost!: Sequelize.BelongsToCreateAssociationMixin<Posts>;
  // Publications hasMany Comments via IdPublication
  Comments!: Comments[];
  getComments!: Sequelize.HasManyGetAssociationsMixin<Comments>;
  setComments!: Sequelize.HasManySetAssociationsMixin<Comments, CommentsId>;
  addComment!: Sequelize.HasManyAddAssociationMixin<Comments, CommentsId>;
  addComments!: Sequelize.HasManyAddAssociationsMixin<Comments, CommentsId>;
  createComment!: Sequelize.HasManyCreateAssociationMixin<Comments>;
  removeComment!: Sequelize.HasManyRemoveAssociationMixin<Comments, CommentsId>;
  removeComments!: Sequelize.HasManyRemoveAssociationsMixin<Comments, CommentsId>;
  hasComment!: Sequelize.HasManyHasAssociationMixin<Comments, CommentsId>;
  hasComments!: Sequelize.HasManyHasAssociationsMixin<Comments, CommentsId>;
  countComments!: Sequelize.HasManyCountAssociationsMixin;
  // Publications hasMany Reactions via IdPublication
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
  // Publications hasMany Share via IdPublication
  Shares!: Share[];
  getShares!: Sequelize.HasManyGetAssociationsMixin<Share>;
  setShares!: Sequelize.HasManySetAssociationsMixin<Share, ShareId>;
  addShare!: Sequelize.HasManyAddAssociationMixin<Share, ShareId>;
  addShares!: Sequelize.HasManyAddAssociationsMixin<Share, ShareId>;
  createShare!: Sequelize.HasManyCreateAssociationMixin<Share>;
  removeShare!: Sequelize.HasManyRemoveAssociationMixin<Share, ShareId>;
  removeShares!: Sequelize.HasManyRemoveAssociationsMixin<Share, ShareId>;
  hasShare!: Sequelize.HasManyHasAssociationMixin<Share, ShareId>;
  hasShares!: Sequelize.HasManyHasAssociationsMixin<Share, ShareId>;
  countShares!: Sequelize.HasManyCountAssociationsMixin;
  // Publications belongsTo TypePublication via IdTypePublication
  IdTypePublicationTypePublication!: TypePublication;
  getIdTypePublicationTypePublication!: Sequelize.BelongsToGetAssociationMixin<TypePublication>;
  setIdTypePublicationTypePublication!: Sequelize.BelongsToSetAssociationMixin<TypePublication, TypePublicationId>;
  createIdTypePublicationTypePublication!: Sequelize.BelongsToCreateAssociationMixin<TypePublication>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Publications {
    return Publications.init({
    IdPublications: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_publications'
    },
    IdPostProduct: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'posts',
          schema: 'post'
        },
        key: 'id'
      },
      field: 'id_post_product'
    },
    IdTypePublication: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'type_publication',
        key: 'id_type_publication'
      },
      field: 'id_type_publication'
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'active'
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
    tableName: 'publications',
    schema: 'publication',
    timestamps: false,
    indexes: [
      {
        name: "publications_pkey",
        unique: true,
        fields: [
          { name: "id_publications" },
        ]
      },
    ]
  });
  }
}
