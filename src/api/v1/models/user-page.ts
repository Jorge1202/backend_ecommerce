import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { TypePage, TypePageId } from './type-page';

export interface UserPageAttributes {
  IdUserPage: number;
  IdTypePage: number;
  IdUser: string;
}

export type UserPagePk = "IdUserPage";
export type UserPageId = UserPage[UserPagePk];
export type UserPageOptionalAttributes = "IdUserPage";
export type UserPageCreationAttributes = Optional<UserPageAttributes, UserPageOptionalAttributes>;

export class UserPage extends Model<UserPageAttributes, UserPageCreationAttributes> implements UserPageAttributes {
  IdUserPage!: number;
  IdTypePage!: number;
  IdUser!: string;

  // UserPage belongsTo TypePage via IdTypePage
  IdTypePageTypePage!: TypePage;
  getIdTypePageTypePage!: Sequelize.BelongsToGetAssociationMixin<TypePage>;
  setIdTypePageTypePage!: Sequelize.BelongsToSetAssociationMixin<TypePage, TypePageId>;
  createIdTypePageTypePage!: Sequelize.BelongsToCreateAssociationMixin<TypePage>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserPage {
    return UserPage.init({
    IdUserPage: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_user_page'
    },
    IdTypePage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'type_page',
        key: 'id_type_page'
      },
      field: 'id_type_page'
    },
    IdUser: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'id_user'
    }
  }, {
    sequelize,
    tableName: 'user_page',
    schema: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "userPage_pkey",
        unique: true,
        fields: [
          { name: "id_user_page" },
        ]
      },
      {
        name: "user_page_pkey",
        unique: true,
        fields: [
          { name: "id_user_page" },
        ]
      },
    ]
  });
  }
}
