import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PostMultimedia, PostMultimediaId } from './post-multimedia';
import type { TypeModePost, TypeModePostId } from './type-mode-post';

export interface PostsAttributes {
  Id: number;
  IdUserPage: number;
  ContentHtml?: string;
  Tags?: string;
  IdModePost?: number;
  DateCreate: string;
  DateUpdate?: string;
  UserCreate: string;
  UserUpdate?: string;
  IsActive?: boolean;
  IsEdit?: boolean;
}

export type PostsPk = "Id";
export type PostsId = Posts[PostsPk];
export type PostsOptionalAttributes = "Id" | "ContentHtml" | "Tags" | "IdModePost" | "DateUpdate" | "UserUpdate" | "IsActive" | "IsEdit";
export type PostsCreationAttributes = Optional<PostsAttributes, PostsOptionalAttributes>;

export class Posts extends Model<PostsAttributes, PostsCreationAttributes> implements PostsAttributes {
  Id!: number;
  IdUserPage!: number;
  ContentHtml?: string;
  Tags?: string;
  IdModePost?: number;
  DateCreate!: string;
  DateUpdate?: string;
  UserCreate!: string;
  UserUpdate?: string;
  IsActive?: boolean;
  IsEdit?: boolean;

  // Posts hasMany PostMultimedia via IdPost
  PostMultimedia!: PostMultimedia[];
  getPostMultimedia!: Sequelize.HasManyGetAssociationsMixin<PostMultimedia>;
  setPostMultimedia!: Sequelize.HasManySetAssociationsMixin<PostMultimedia, PostMultimediaId>;
  addPostMultimedium!: Sequelize.HasManyAddAssociationMixin<PostMultimedia, PostMultimediaId>;
  addPostMultimedia!: Sequelize.HasManyAddAssociationsMixin<PostMultimedia, PostMultimediaId>;
  createPostMultimedium!: Sequelize.HasManyCreateAssociationMixin<PostMultimedia>;
  removePostMultimedium!: Sequelize.HasManyRemoveAssociationMixin<PostMultimedia, PostMultimediaId>;
  removePostMultimedia!: Sequelize.HasManyRemoveAssociationsMixin<PostMultimedia, PostMultimediaId>;
  hasPostMultimedium!: Sequelize.HasManyHasAssociationMixin<PostMultimedia, PostMultimediaId>;
  hasPostMultimedia!: Sequelize.HasManyHasAssociationsMixin<PostMultimedia, PostMultimediaId>;
  countPostMultimedia!: Sequelize.HasManyCountAssociationsMixin;
  // Posts belongsTo TypeModePost via IdModePost
  IdModePostTypeModePost!: TypeModePost;
  getIdModePostTypeModePost!: Sequelize.BelongsToGetAssociationMixin<TypeModePost>;
  setIdModePostTypeModePost!: Sequelize.BelongsToSetAssociationMixin<TypeModePost, TypeModePostId>;
  createIdModePostTypeModePost!: Sequelize.BelongsToCreateAssociationMixin<TypeModePost>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Posts {
    return Posts.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    IdUserPage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_user_page'
    },
    ContentHtml: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'content_html'
    },
    Tags: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'tags'
    },
    IdModePost: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'typeModePost',
        key: 'id'
      },
      field: 'id_mode_post'
    },
    DateCreate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'data_create'
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
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'is_active'
    },
    IsEdit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'is_edit'
    }
  }, {
    sequelize,
    tableName: 'posts',
    schema: 'post',
    timestamps: true, // ✅ activa los timestamps
    createdAt: 'DateCreate', 
    updatedAt: 'DateUpdate', 
    indexes: [
      {
        name: "posts_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
