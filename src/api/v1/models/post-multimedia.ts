import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Multimedia, MultimediaId } from './multimedia';
import type { Posts, PostsId } from './posts';

export interface PostMultimediaAttributes {
  Id: number;
  IdPost: number;
  IdMultimedia: string;
}

export type PostMultimediaPk = "Id";
export type PostMultimediaId = PostMultimedia[PostMultimediaPk];
export type PostMultimediaOptionalAttributes = "Id";
export type PostMultimediaCreationAttributes = Optional<PostMultimediaAttributes, PostMultimediaOptionalAttributes>;

export class PostMultimedia extends Model<PostMultimediaAttributes, PostMultimediaCreationAttributes> implements PostMultimediaAttributes {
  Id!: number;
  IdPost!: number;
  IdMultimedia!: string;

  // PostMultimedia belongsTo Multimedia via IdMultimedia
  IdMultimediaMultimedium!: Multimedia;
  getIdMultimediaMultimedium!: Sequelize.BelongsToGetAssociationMixin<Multimedia>;
  setIdMultimediaMultimedium!: Sequelize.BelongsToSetAssociationMixin<Multimedia, MultimediaId>;
  createIdMultimediaMultimedium!: Sequelize.BelongsToCreateAssociationMixin<Multimedia>;
  // PostMultimedia belongsTo Posts via IdPost
  IdPostPost!: Posts;
  getIdPostPost!: Sequelize.BelongsToGetAssociationMixin<Posts>;
  setIdPostPost!: Sequelize.BelongsToSetAssociationMixin<Posts, PostsId>;
  createIdPostPost!: Sequelize.BelongsToCreateAssociationMixin<Posts>;

  static initModel(sequelize: Sequelize.Sequelize): typeof PostMultimedia {
    return PostMultimedia.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    IdPost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'posts',
          schema: 'post'
        },
        key: 'id'
      },
      field: 'id_post'
    },
    IdMultimedia: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: {
          tableName: 'multimedia',
          schema: 'multimedia'
        },
        key: 'id_multimedia'
      },
      field: 'id_multimedia'
    }
  }, {
    sequelize,
    tableName: 'post_multimedia',
    schema: 'post',
    timestamps: false,
    indexes: [
      {
        name: "post_multimedia_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
