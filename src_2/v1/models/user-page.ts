import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PageServices, PageServicesId } from './page-services';
import type { PageStore, PageStoreId } from './page-store';
import type { Profile, ProfileId } from './profile';
import type { TypePage, TypePageId } from './type-page';

export interface UserPageAttributes {
  IdUserPage: number;
  Username?: string;
  IdTypePage: number;
  IdUser: string;
}

export type UserPagePk = "IdUserPage";
export type UserPageId = UserPage[UserPagePk];
export type UserPageOptionalAttributes = "IdUserPage" | "Username";
export type UserPageCreationAttributes = Optional<UserPageAttributes, UserPageOptionalAttributes>;

export class UserPage extends Model<UserPageAttributes, UserPageCreationAttributes> implements UserPageAttributes {
  IdUserPage!: number;
  Username?: string;
  IdTypePage!: number;
  IdUser!: string;

  // UserPage belongsTo TypePage via IdTypePage
  IdTypePageTypePage!: TypePage;
  getIdTypePageTypePage!: Sequelize.BelongsToGetAssociationMixin<TypePage>;
  setIdTypePageTypePage!: Sequelize.BelongsToSetAssociationMixin<TypePage, TypePageId>;
  createIdTypePageTypePage!: Sequelize.BelongsToCreateAssociationMixin<TypePage>;
  // UserPage hasMany PageServices via IdUserPage
  PageServices!: PageServices[];
  getPageServices!: Sequelize.HasManyGetAssociationsMixin<PageServices>;
  setPageServices!: Sequelize.HasManySetAssociationsMixin<PageServices, PageServicesId>;
  addPageService!: Sequelize.HasManyAddAssociationMixin<PageServices, PageServicesId>;
  addPageServices!: Sequelize.HasManyAddAssociationsMixin<PageServices, PageServicesId>;
  createPageService!: Sequelize.HasManyCreateAssociationMixin<PageServices>;
  removePageService!: Sequelize.HasManyRemoveAssociationMixin<PageServices, PageServicesId>;
  removePageServices!: Sequelize.HasManyRemoveAssociationsMixin<PageServices, PageServicesId>;
  hasPageService!: Sequelize.HasManyHasAssociationMixin<PageServices, PageServicesId>;
  hasPageServices!: Sequelize.HasManyHasAssociationsMixin<PageServices, PageServicesId>;
  countPageServices!: Sequelize.HasManyCountAssociationsMixin;
  // UserPage hasMany PageStore via IdUserPage
  PageStores!: PageStore[];
  getPageStores!: Sequelize.HasManyGetAssociationsMixin<PageStore>;
  setPageStores!: Sequelize.HasManySetAssociationsMixin<PageStore, PageStoreId>;
  addPageStore!: Sequelize.HasManyAddAssociationMixin<PageStore, PageStoreId>;
  addPageStores!: Sequelize.HasManyAddAssociationsMixin<PageStore, PageStoreId>;
  createPageStore!: Sequelize.HasManyCreateAssociationMixin<PageStore>;
  removePageStore!: Sequelize.HasManyRemoveAssociationMixin<PageStore, PageStoreId>;
  removePageStores!: Sequelize.HasManyRemoveAssociationsMixin<PageStore, PageStoreId>;
  hasPageStore!: Sequelize.HasManyHasAssociationMixin<PageStore, PageStoreId>;
  hasPageStores!: Sequelize.HasManyHasAssociationsMixin<PageStore, PageStoreId>;
  countPageStores!: Sequelize.HasManyCountAssociationsMixin;
  // UserPage hasMany Profile via IdUserPage
  Profiles!: Profile[];
  getProfiles!: Sequelize.HasManyGetAssociationsMixin<Profile>;
  setProfiles!: Sequelize.HasManySetAssociationsMixin<Profile, ProfileId>;
  addProfile!: Sequelize.HasManyAddAssociationMixin<Profile, ProfileId>;
  addProfiles!: Sequelize.HasManyAddAssociationsMixin<Profile, ProfileId>;
  createProfile!: Sequelize.HasManyCreateAssociationMixin<Profile>;
  removeProfile!: Sequelize.HasManyRemoveAssociationMixin<Profile, ProfileId>;
  removeProfiles!: Sequelize.HasManyRemoveAssociationsMixin<Profile, ProfileId>;
  hasProfile!: Sequelize.HasManyHasAssociationMixin<Profile, ProfileId>;
  hasProfiles!: Sequelize.HasManyHasAssociationsMixin<Profile, ProfileId>;
  countProfiles!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserPage {
    return UserPage.init({
    IdUserPage: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_user_page'
    },
    Username: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'username'
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
