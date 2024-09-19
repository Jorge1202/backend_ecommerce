import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { UserPage, UserPageId } from './user-page';

export interface TypePageAttributes {
  IdTypePage: number;
  Description: string;
}

export type TypePagePk = "IdTypePage";
export type TypePageId = TypePage[TypePagePk];
export type TypePageOptionalAttributes = "IdTypePage";
export type TypePageCreationAttributes = Optional<TypePageAttributes, TypePageOptionalAttributes>;

export class TypePage extends Model<TypePageAttributes, TypePageCreationAttributes> implements TypePageAttributes {
  IdTypePage!: number;
  Description!: string;

  // TypePage hasMany UserPage via IdTypePage
  UserPages!: UserPage[];
  getUserPages!: Sequelize.HasManyGetAssociationsMixin<UserPage>;
  setUserPages!: Sequelize.HasManySetAssociationsMixin<UserPage, UserPageId>;
  addUserPage!: Sequelize.HasManyAddAssociationMixin<UserPage, UserPageId>;
  addUserPages!: Sequelize.HasManyAddAssociationsMixin<UserPage, UserPageId>;
  createUserPage!: Sequelize.HasManyCreateAssociationMixin<UserPage>;
  removeUserPage!: Sequelize.HasManyRemoveAssociationMixin<UserPage, UserPageId>;
  removeUserPages!: Sequelize.HasManyRemoveAssociationsMixin<UserPage, UserPageId>;
  hasUserPage!: Sequelize.HasManyHasAssociationMixin<UserPage, UserPageId>;
  hasUserPages!: Sequelize.HasManyHasAssociationsMixin<UserPage, UserPageId>;
  countUserPages!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof TypePage {
    return TypePage.init({
    IdTypePage: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_type_page'
    },
    Description: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'description'
    }
  }, {
    sequelize,
    tableName: 'type_page',
    schema: 'pages',
    timestamps: false,
    indexes: [
      {
        name: "typePage_pkey",
        unique: true,
        fields: [
          { name: "id_type_page" },
        ]
      },
    ]
  });
  }
}
