import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Posts, PostsId } from './posts';

export interface TypeModePostAttributes {
  Id: number;
  Name?: string;
}

export type TypeModePostPk = "Id";
export type TypeModePostId = TypeModePost[TypeModePostPk];
export type TypeModePostOptionalAttributes = "Id" | "Name";
export type TypeModePostCreationAttributes = Optional<TypeModePostAttributes, TypeModePostOptionalAttributes>;

export class TypeModePost extends Model<TypeModePostAttributes, TypeModePostCreationAttributes> implements TypeModePostAttributes {
  Id!: number;
  Name?: string;

  // TypeModePost hasMany Posts via IdModePost
  Posts!: Posts[];
  getPosts!: Sequelize.HasManyGetAssociationsMixin<Posts>;
  setPosts!: Sequelize.HasManySetAssociationsMixin<Posts, PostsId>;
  addPost!: Sequelize.HasManyAddAssociationMixin<Posts, PostsId>;
  addPosts!: Sequelize.HasManyAddAssociationsMixin<Posts, PostsId>;
  createPost!: Sequelize.HasManyCreateAssociationMixin<Posts>;
  removePost!: Sequelize.HasManyRemoveAssociationMixin<Posts, PostsId>;
  removePosts!: Sequelize.HasManyRemoveAssociationsMixin<Posts, PostsId>;
  hasPost!: Sequelize.HasManyHasAssociationMixin<Posts, PostsId>;
  hasPosts!: Sequelize.HasManyHasAssociationsMixin<Posts, PostsId>;
  countPosts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof TypeModePost {
    return TypeModePost.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'name'
    }
  }, {
    sequelize,
    tableName: 'typeModePost',
    schema: 'post',
    timestamps: false,
    indexes: [
      {
        name: "typeModePost_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
