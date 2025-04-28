import type { Sequelize } from "sequelize";
import { AttributeValues as _AttributeValues } from "../models/attribute-values";
import type { AttributeValuesAttributes, AttributeValuesCreationAttributes } from "../models/attribute-values";
import { Attributes as _Attributes } from "../models/attributes";
import type { AttributesAttributes, AttributesCreationAttributes } from "../models/attributes";
import { Auth as _Auth } from "../models/auth";
import type { AuthAttributes, AuthCreationAttributes } from "../models/auth";
import { AuthTokens as _AuthTokens } from "../models/auth-tokens";
import type { AuthTokensAttributes, AuthTokensCreationAttributes } from "../models/auth-tokens";
import { BannersProfile as _BannersProfile } from "../models/banners-profile";
import type { BannersProfileAttributes, BannersProfileCreationAttributes } from "../models/banners-profile";
import { BannersServices as _BannersServices } from "../models/banners-services";
import type { BannersServicesAttributes, BannersServicesCreationAttributes } from "../models/banners-services";
import { BannersStore as _BannersStore } from "../models/banners-store";
import type { BannersStoreAttributes, BannersStoreCreationAttributes } from "../models/banners-store";
import { Categories as _Categories } from "../models/categories";
import type { CategoriesAttributes, CategoriesCreationAttributes } from "../models/categories";
import { CategoryAttributeValues as _CategoryAttributeValues } from "../models/category-attribute-values";
import type { CategoryAttributeValuesAttributes, CategoryAttributeValuesCreationAttributes } from "../models/category-attribute-values";
import { CodeAutentication as _CodeAutentication } from "../models/code-autentication";
import type { CodeAutenticationAttributes, CodeAutenticationCreationAttributes } from "../models/code-autentication";
import { Comments as _Comments } from "../models/comments";
import type { CommentsAttributes, CommentsCreationAttributes } from "../models/comments";
import { Condition as _Condition } from "../models/condition";
import type { ConditionAttributes, ConditionCreationAttributes } from "../models/condition";
import { CustomAttributeValues as _CustomAttributeValues } from "../models/custom-attribute-values";
import type { CustomAttributeValuesAttributes, CustomAttributeValuesCreationAttributes } from "../models/custom-attribute-values";
import { CustomAttributes as _CustomAttributes } from "../models/custom-attributes";
import type { CustomAttributesAttributes, CustomAttributesCreationAttributes } from "../models/custom-attributes";
import { Descripction as _Descripction } from "../models/descripction";
import type { DescripctionAttributes, DescripctionCreationAttributes } from "../models/descripction";
import { DeviceAuth as _DeviceAuth } from "../models/device-auth";
import type { DeviceAuthAttributes, DeviceAuthCreationAttributes } from "../models/device-auth";
import { Devices as _Devices } from "../models/devices";
import type { DevicesAttributes, DevicesCreationAttributes } from "../models/devices";
import { HistoryRegister as _HistoryRegister } from "../models/history-register";
import type { HistoryRegisterAttributes, HistoryRegisterCreationAttributes } from "../models/history-register";
import { Login as _Login } from "../models/login";
import type { LoginAttributes, LoginCreationAttributes } from "../models/login";
import { Multimedia as _Multimedia } from "../models/multimedia";
import type { MultimediaAttributes, MultimediaCreationAttributes } from "../models/multimedia";
import { PageServices as _PageServices } from "../models/page-services";
import type { PageServicesAttributes, PageServicesCreationAttributes } from "../models/page-services";
import { PageStore as _PageStore } from "../models/page-store";
import type { PageStoreAttributes, PageStoreCreationAttributes } from "../models/page-store";
import { PostMultimedia as _PostMultimedia } from "../models/post-multimedia";
import type { PostMultimediaAttributes, PostMultimediaCreationAttributes } from "../models/post-multimedia";
import { Posts as _Posts } from "../models/posts";
import type { PostsAttributes, PostsCreationAttributes } from "../models/posts";
import { ProductAttributeValues as _ProductAttributeValues } from "../models/product-attribute-values";
import type { ProductAttributeValuesAttributes, ProductAttributeValuesCreationAttributes } from "../models/product-attribute-values";
import { ProductMultimedia as _ProductMultimedia } from "../models/product-multimedia";
import type { ProductMultimediaAttributes, ProductMultimediaCreationAttributes } from "../models/product-multimedia";
import { ProductVariation as _ProductVariation } from "../models/product-variation";
import type { ProductVariationAttributes, ProductVariationCreationAttributes } from "../models/product-variation";
import { Products as _Products } from "../models/products";
import type { ProductsAttributes, ProductsCreationAttributes } from "../models/products";
import { Profile as _Profile } from "../models/profile";
import type { ProfileAttributes, ProfileCreationAttributes } from "../models/profile";
import { Publications as _Publications } from "../models/publications";
import type { PublicationsAttributes, PublicationsCreationAttributes } from "../models/publications";
import { Reactions as _Reactions } from "../models/reactions";
import type { ReactionsAttributes, ReactionsCreationAttributes } from "../models/reactions";
import { RefreshToken as _RefreshToken } from "../models/refresh-token";
import type { RefreshTokenAttributes, RefreshTokenCreationAttributes } from "../models/refresh-token";
import { Share as _Share } from "../models/share";
import type { ShareAttributes, ShareCreationAttributes } from "../models/share";
import { StaticsService as _StaticsService } from "../models/statics-service";
import type { StaticsServiceAttributes, StaticsServiceCreationAttributes } from "../models/statics-service";
import { StatisticsProfile as _StatisticsProfile } from "../models/statistics-profile";
import type { StatisticsProfileAttributes, StatisticsProfileCreationAttributes } from "../models/statistics-profile";
import { StatisticsStore as _StatisticsStore } from "../models/statistics-store";
import type { StatisticsStoreAttributes, StatisticsStoreCreationAttributes } from "../models/statistics-store";
import { StatusAuth as _StatusAuth } from "../models/status-auth";
import type { StatusAuthAttributes, StatusAuthCreationAttributes } from "../models/status-auth";
import { StatusRegister as _StatusRegister } from "../models/status-register";
import type { StatusRegisterAttributes, StatusRegisterCreationAttributes } from "../models/status-register";
import { TypeModePost as _TypeModePost } from "../models/type-mode-post";
import type { TypeModePostAttributes, TypeModePostCreationAttributes } from "../models/type-mode-post";
import { TypeTokens as _TypeTokens } from "../models/type-tokens";
import type { TypeTokensAttributes, TypeTokensCreationAttributes } from "../models/type-tokens";
import { TypeCode as _TypeCode } from "../models/type-code";
import type { TypeCodeAttributes, TypeCodeCreationAttributes } from "../models/type-code";
import { TypeMultimedia as _TypeMultimedia } from "../models/type-multimedia";
import type { TypeMultimediaAttributes, TypeMultimediaCreationAttributes } from "../models/type-multimedia";
import { TypePage as _TypePage } from "../models/type-page";
import type { TypePageAttributes, TypePageCreationAttributes } from "../models/type-page";
import { TypePrestige as _TypePrestige } from "../models/type-prestige";
import type { TypePrestigeAttributes, TypePrestigeCreationAttributes } from "../models/type-prestige";
import { TypePublication as _TypePublication } from "../models/type-publication";
import type { TypePublicationAttributes, TypePublicationCreationAttributes } from "../models/type-publication";
import { TypeReaction as _TypeReaction } from "../models/type-reaction";
import type { TypeReactionAttributes, TypeReactionCreationAttributes } from "../models/type-reaction";
import { User as _User } from "../models/user";
import type { UserAttributes, UserCreationAttributes } from "../models/user";
import { UserPage as _UserPage } from "../models/user-page";
import type { UserPageAttributes, UserPageCreationAttributes } from "../models/user-page";

export {
  _AttributeValues as AttributeValues,
  _Attributes as Attributes,
  _Auth as Auth,
  _AuthTokens as AuthTokens,
  _BannersProfile as BannersProfile,
  _BannersServices as BannersServices,
  _BannersStore as BannersStore,
  _Categories as Categories,
  _CategoryAttributeValues as CategoryAttributeValues,
  _CodeAutentication as CodeAutentication,
  _Comments as Comments,
  _Condition as Condition,
  _CustomAttributeValues as CustomAttributeValues,
  _CustomAttributes as CustomAttributes,
  _Descripction as Descripction,
  _DeviceAuth as DeviceAuth,
  _Devices as Devices,
  _HistoryRegister as HistoryRegister,
  _Login as Login,
  _Multimedia as Multimedia,
  _PageServices as PageServices,
  _PageStore as PageStore,
  _PostMultimedia as PostMultimedia,
  _Posts as Posts,
  _ProductAttributeValues as ProductAttributeValues,
  _ProductMultimedia as ProductMultimedia,
  _ProductVariation as ProductVariation,
  _Products as Products,
  _Profile as Profile,
  _Publications as Publications,
  _Reactions as Reactions,
  _RefreshToken as RefreshToken,
  _Share as Share,
  _StaticsService as StaticsService,
  _StatisticsProfile as StatisticsProfile,
  _StatisticsStore as StatisticsStore,
  _StatusAuth as StatusAuth,
  _StatusRegister as StatusRegister,
  _TypeModePost as TypeModePost,
  _TypeTokens as TypeTokens,
  _TypeCode as TypeCode,
  _TypeMultimedia as TypeMultimedia,
  _TypePage as TypePage,
  _TypePrestige as TypePrestige,
  _TypePublication as TypePublication,
  _TypeReaction as TypeReaction,
  _User as User,
  _UserPage as UserPage,
};

export type {
  AttributeValuesAttributes,
  AttributeValuesCreationAttributes,
  AttributesAttributes,
  AttributesCreationAttributes,
  AuthAttributes,
  AuthCreationAttributes,
  AuthTokensAttributes,
  AuthTokensCreationAttributes,
  BannersProfileAttributes,
  BannersProfileCreationAttributes,
  BannersServicesAttributes,
  BannersServicesCreationAttributes,
  BannersStoreAttributes,
  BannersStoreCreationAttributes,
  CategoriesAttributes,
  CategoriesCreationAttributes,
  CategoryAttributeValuesAttributes,
  CategoryAttributeValuesCreationAttributes,
  CodeAutenticationAttributes,
  CodeAutenticationCreationAttributes,
  CommentsAttributes,
  CommentsCreationAttributes,
  ConditionAttributes,
  ConditionCreationAttributes,
  CustomAttributeValuesAttributes,
  CustomAttributeValuesCreationAttributes,
  CustomAttributesAttributes,
  CustomAttributesCreationAttributes,
  DescripctionAttributes,
  DescripctionCreationAttributes,
  DeviceAuthAttributes,
  DeviceAuthCreationAttributes,
  DevicesAttributes,
  DevicesCreationAttributes,
  HistoryRegisterAttributes,
  HistoryRegisterCreationAttributes,
  LoginAttributes,
  LoginCreationAttributes,
  MultimediaAttributes,
  MultimediaCreationAttributes,
  PageServicesAttributes,
  PageServicesCreationAttributes,
  PageStoreAttributes,
  PageStoreCreationAttributes,
  PostMultimediaAttributes,
  PostMultimediaCreationAttributes,
  PostsAttributes,
  PostsCreationAttributes,
  ProductAttributeValuesAttributes,
  ProductAttributeValuesCreationAttributes,
  ProductMultimediaAttributes,
  ProductMultimediaCreationAttributes,
  ProductVariationAttributes,
  ProductVariationCreationAttributes,
  ProductsAttributes,
  ProductsCreationAttributes,
  ProfileAttributes,
  ProfileCreationAttributes,
  PublicationsAttributes,
  PublicationsCreationAttributes,
  ReactionsAttributes,
  ReactionsCreationAttributes,
  RefreshTokenAttributes,
  RefreshTokenCreationAttributes,
  ShareAttributes,
  ShareCreationAttributes,
  StaticsServiceAttributes,
  StaticsServiceCreationAttributes,
  StatisticsProfileAttributes,
  StatisticsProfileCreationAttributes,
  StatisticsStoreAttributes,
  StatisticsStoreCreationAttributes,
  StatusAuthAttributes,
  StatusAuthCreationAttributes,
  StatusRegisterAttributes,
  StatusRegisterCreationAttributes,
  TypeModePostAttributes,
  TypeModePostCreationAttributes,
  TypeTokensAttributes,
  TypeTokensCreationAttributes,
  TypeCodeAttributes,
  TypeCodeCreationAttributes,
  TypeMultimediaAttributes,
  TypeMultimediaCreationAttributes,
  TypePageAttributes,
  TypePageCreationAttributes,
  TypePrestigeAttributes,
  TypePrestigeCreationAttributes,
  TypePublicationAttributes,
  TypePublicationCreationAttributes,
  TypeReactionAttributes,
  TypeReactionCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
  UserPageAttributes,
  UserPageCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const AttributeValues = _AttributeValues.initModel(sequelize);
  const Attributes = _Attributes.initModel(sequelize);
  const Auth = _Auth.initModel(sequelize);
  const AuthTokens = _AuthTokens.initModel(sequelize);
  const BannersProfile = _BannersProfile.initModel(sequelize);
  const BannersServices = _BannersServices.initModel(sequelize);
  const BannersStore = _BannersStore.initModel(sequelize);
  const Categories = _Categories.initModel(sequelize);
  const CategoryAttributeValues = _CategoryAttributeValues.initModel(sequelize);
  const CodeAutentication = _CodeAutentication.initModel(sequelize);
  const Comments = _Comments.initModel(sequelize);
  const Condition = _Condition.initModel(sequelize);
  const CustomAttributeValues = _CustomAttributeValues.initModel(sequelize);
  const CustomAttributes = _CustomAttributes.initModel(sequelize);
  const Descripction = _Descripction.initModel(sequelize);
  const DeviceAuth = _DeviceAuth.initModel(sequelize);
  const Devices = _Devices.initModel(sequelize);
  const HistoryRegister = _HistoryRegister.initModel(sequelize);
  const Login = _Login.initModel(sequelize);
  const Multimedia = _Multimedia.initModel(sequelize);
  const PageServices = _PageServices.initModel(sequelize);
  const PageStore = _PageStore.initModel(sequelize);
  const PostMultimedia = _PostMultimedia.initModel(sequelize);
  const Posts = _Posts.initModel(sequelize);
  const ProductAttributeValues = _ProductAttributeValues.initModel(sequelize);
  const ProductMultimedia = _ProductMultimedia.initModel(sequelize);
  const ProductVariation = _ProductVariation.initModel(sequelize);
  const Products = _Products.initModel(sequelize);
  const Profile = _Profile.initModel(sequelize);
  const Publications = _Publications.initModel(sequelize);
  const Reactions = _Reactions.initModel(sequelize);
  const RefreshToken = _RefreshToken.initModel(sequelize);
  const Share = _Share.initModel(sequelize);
  const StaticsService = _StaticsService.initModel(sequelize);
  const StatisticsProfile = _StatisticsProfile.initModel(sequelize);
  const StatisticsStore = _StatisticsStore.initModel(sequelize);
  const StatusAuth = _StatusAuth.initModel(sequelize);
  const StatusRegister = _StatusRegister.initModel(sequelize);
  const TypeModePost = _TypeModePost.initModel(sequelize);
  const TypeTokens = _TypeTokens.initModel(sequelize);
  const TypeCode = _TypeCode.initModel(sequelize);
  const TypeMultimedia = _TypeMultimedia.initModel(sequelize);
  const TypePage = _TypePage.initModel(sequelize);
  const TypePrestige = _TypePrestige.initModel(sequelize);
  const TypePublication = _TypePublication.initModel(sequelize);
  const TypeReaction = _TypeReaction.initModel(sequelize);
  const User = _User.initModel(sequelize);
  const UserPage = _UserPage.initModel(sequelize);

  Multimedia.belongsTo(TypeMultimedia, { as: "IdTipoMultimediaTypeMultimedium", foreignKey: "IdTipoMultimedia"});
  TypeMultimedia.hasMany(Multimedia, { as: "Multimedia", foreignKey: "IdTipoMultimedia"});
  StaticsService.belongsTo(PageServices, { as: "IdPageServicePageService", foreignKey: "IdPageService"});
  PageServices.hasMany(StaticsService, { as: "StaticsServices", foreignKey: "IdPageService"});
  StatisticsStore.belongsTo(PageStore, { as: "IdPageStorePageStore", foreignKey: "IdPageStore"});
  PageStore.hasMany(StatisticsStore, { as: "StatisticsStores", foreignKey: "IdPageStore"});
  StatisticsProfile.belongsTo(Profile, { as: "IdProfileProfile", foreignKey: "IdProfile"});
  Profile.hasMany(StatisticsProfile, { as: "StatisticsProfiles", foreignKey: "IdProfile"});
  UserPage.belongsTo(TypePage, { as: "IdTypePageTypePage", foreignKey: "IdTypePage"});
  TypePage.hasMany(UserPage, { as: "UserPages", foreignKey: "IdTypePage"});
  StatisticsStore.belongsTo(TypePrestige, { as: "IdTypePrestigeTypePrestige", foreignKey: "IdTypePrestige"});
  TypePrestige.hasMany(StatisticsStore, { as: "StatisticsStores", foreignKey: "IdTypePrestige"});
  PostMultimedia.belongsTo(Multimedia, { as: "IdMultimediaMultimedium", foreignKey: "IdMultimedia"});
  Multimedia.hasMany(PostMultimedia, { as: "PostMultimedia", foreignKey: "IdMultimedia"});
  PostMultimedia.belongsTo(Posts, { as: "IdPostPost", foreignKey: "IdPost"});
  Posts.hasMany(PostMultimedia, { as: "PostMultimedia", foreignKey: "IdPost"});
  Posts.belongsTo(TypeModePost, { as: "IdModePostTypeModePost", foreignKey: "IdModePost"});
  TypeModePost.hasMany(Posts, { as: "Posts", foreignKey: "IdModePost"});
  CategoryAttributeValues.belongsTo(AttributeValues, { as: "IdAttributeValueAttributeValues", foreignKey: "IdAttributeValue"});
  AttributeValues.hasMany(CategoryAttributeValues, { as: "CategoryAttributeValues", foreignKey: "IdAttributeValue"});
  Categories.belongsTo(Categories, { as: "Parent", foreignKey: "ParentId"});
  Categories.hasMany(Categories, { as: "Categories", foreignKey: "ParentId"});
  CategoryAttributeValues.belongsTo(Categories, { as: "IdCategoryCategory", foreignKey: "IdCategory"});
  Categories.hasMany(CategoryAttributeValues, { as: "CategoryAttributeValues", foreignKey: "IdCategory"});
  Products.belongsTo(Categories, { as: "IdCategoryCategory", foreignKey: "IdCategory"});
  Categories.hasMany(Products, { as: "Products", foreignKey: "IdCategory"});
  ProductAttributeValues.belongsTo(CategoryAttributeValues, { as: "IdValueCategoryAttributeValue", foreignKey: "IdValue"});
  CategoryAttributeValues.hasMany(ProductAttributeValues, { as: "ProductAttributeValues", foreignKey: "IdValue"});
  Products.belongsTo(Condition, { as: "IdConditionCondition", foreignKey: "IdCondition"});
  Condition.hasMany(Products, { as: "Products", foreignKey: "IdCondition"});
  AttributeValues.belongsTo(CustomAttributes, { as: "IdAttributeCustomAttribute", foreignKey: "IdAttribute"});
  CustomAttributes.hasMany(AttributeValues, { as: "AttributeValues", foreignKey: "IdAttribute"});
  CustomAttributeValues.belongsTo(CustomAttributes, { as: "IdAttributeCustomAttribute", foreignKey: "IdAttribute"});
  CustomAttributes.hasMany(CustomAttributeValues, { as: "CustomAttributeValues", foreignKey: "IdAttribute"});
  ProductMultimedia.belongsTo(Multimedia, { as: "IdMultimediaMultimedium", foreignKey: "IdMultimedia"});
  Multimedia.hasMany(ProductMultimedia, { as: "ProductMultimedia", foreignKey: "IdMultimedia"});
  Products.belongsTo(PageStore, { as: "IdStorePageStore", foreignKey: "IdStore"});
  PageStore.hasMany(Products, { as: "Products", foreignKey: "IdStore"});
  CustomAttributeValues.belongsTo(Products, { as: "IdProductProduct", foreignKey: "IdProduct"});
  Products.hasMany(CustomAttributeValues, { as: "CustomAttributeValues", foreignKey: "IdProduct"});
  Descripction.belongsTo(Products, { as: "IdProductProduct", foreignKey: "IdProduct"});
  Products.hasMany(Descripction, { as: "Descripctions", foreignKey: "IdProduct"});
  ProductAttributeValues.belongsTo(Products, { as: "IdProductoProduct", foreignKey: "IdProducto"});
  Products.hasMany(ProductAttributeValues, { as: "ProductAttributeValues", foreignKey: "IdProducto"});
  ProductMultimedia.belongsTo(Products, { as: "IdProductProduct", foreignKey: "IdProduct"});
  Products.hasMany(ProductMultimedia, { as: "ProductMultimedia", foreignKey: "IdProduct"});
  ProductVariation.belongsTo(Products, { as: "IdProductProduct", foreignKey: "IdProduct"});
  Products.hasMany(ProductVariation, { as: "ProductVariations", foreignKey: "IdProduct"});
  Reactions.belongsTo(Comments, { as: "IdCommentComment", foreignKey: "IdComment"});
  Comments.hasMany(Reactions, { as: "Reactions", foreignKey: "IdComment"});
  Publications.belongsTo(Posts, { as: "IdPostProductPost", foreignKey: "IdPostProduct"});
  Posts.hasMany(Publications, { as: "Publications", foreignKey: "IdPostProduct"});
  Comments.belongsTo(Publications, { as: "IdPublicationPublication", foreignKey: "IdPublication"});
  Publications.hasMany(Comments, { as: "Comments", foreignKey: "IdPublication"});
  Reactions.belongsTo(Publications, { as: "IdPublicationPublication", foreignKey: "IdPublication"});
  Publications.hasMany(Reactions, { as: "Reactions", foreignKey: "IdPublication"});
  Share.belongsTo(Publications, { as: "IdPublicationPublication", foreignKey: "IdPublication"});
  Publications.hasMany(Share, { as: "Shares", foreignKey: "IdPublication"});
  Publications.belongsTo(TypePublication, { as: "IdTypePublicationTypePublication", foreignKey: "IdTypePublication"});
  TypePublication.hasMany(Publications, { as: "Publications", foreignKey: "IdTypePublication"});
  Reactions.belongsTo(TypeReaction, { as: "IdTypeReactionTypeReaction", foreignKey: "IdTypeReaction"});
  TypeReaction.hasMany(Reactions, { as: "Reactions", foreignKey: "IdTypeReaction"});
  CodeAutentication.belongsTo(Auth, { as: "IdAuthAuth", foreignKey: "IdAuth"});
  Auth.hasMany(CodeAutentication, { as: "CodeAutentications", foreignKey: "IdAuth"});
  DeviceAuth.belongsTo(Auth, { as: "IdAuthAuth", foreignKey: "IdAuth"});
  Auth.hasMany(DeviceAuth, { as: "DeviceAuths", foreignKey: "IdAuth"});
  Login.belongsTo(Auth, { as: "IdAuthAuth", foreignKey: "IdAuth"});
  Auth.hasMany(Login, { as: "Logins", foreignKey: "IdAuth"});
  DeviceAuth.belongsTo(Devices, { as: "IdDeviceDevice", foreignKey: "IdDevice"});
  Devices.hasMany(DeviceAuth, { as: "DeviceAuths", foreignKey: "IdDevice"});
  Login.belongsTo(Devices, { as: "IdDevicesDevice", foreignKey: "IdDevices"});
  Devices.hasMany(Login, { as: "Logins", foreignKey: "IdDevices"});
  CodeAutentication.belongsTo(TypeCode, { as: "IdTypeCodeTypeCode", foreignKey: "IdTypeCode"});
  TypeCode.hasMany(CodeAutentication, { as: "CodeAutentications", foreignKey: "IdTypeCode"});

  return {
    AttributeValues: AttributeValues,
    Attributes: Attributes,
    Auth: Auth,
    AuthTokens: AuthTokens,
    BannersProfile: BannersProfile,
    BannersServices: BannersServices,
    BannersStore: BannersStore,
    Categories: Categories,
    CategoryAttributeValues: CategoryAttributeValues,
    CodeAutentication: CodeAutentication,
    Comments: Comments,
    Condition: Condition,
    CustomAttributeValues: CustomAttributeValues,
    CustomAttributes: CustomAttributes,
    Descripction: Descripction,
    DeviceAuth: DeviceAuth,
    Devices: Devices,
    HistoryRegister: HistoryRegister,
    Login: Login,
    Multimedia: Multimedia,
    PageServices: PageServices,
    PageStore: PageStore,
    PostMultimedia: PostMultimedia,
    Posts: Posts,
    ProductAttributeValues: ProductAttributeValues,
    ProductMultimedia: ProductMultimedia,
    ProductVariation: ProductVariation,
    Products: Products,
    Profile: Profile,
    Publications: Publications,
    Reactions: Reactions,
    RefreshToken: RefreshToken,
    Share: Share,
    StaticsService: StaticsService,
    StatisticsProfile: StatisticsProfile,
    StatisticsStore: StatisticsStore,
    StatusAuth: StatusAuth,
    StatusRegister: StatusRegister,
    TypeModePost: TypeModePost,
    TypeTokens: TypeTokens,
    TypeCode: TypeCode,
    TypeMultimedia: TypeMultimedia,
    TypePage: TypePage,
    TypePrestige: TypePrestige,
    TypePublication: TypePublication,
    TypeReaction: TypeReaction,
    User: User,
    UserPage: UserPage,
  };
}
