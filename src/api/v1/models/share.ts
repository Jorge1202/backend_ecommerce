import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Publications, PublicationsId } from './publications';

export interface ShareAttributes {
  IdShare: number;
  IdPublication?: number;
  IdUser: string;
  DataCreate?: string;
}

export type SharePk = "IdShare";
export type ShareId = Share[SharePk];
export type ShareOptionalAttributes = "IdShare" | "IdPublication" | "DataCreate";
export type ShareCreationAttributes = Optional<ShareAttributes, ShareOptionalAttributes>;

export class Share extends Model<ShareAttributes, ShareCreationAttributes> implements ShareAttributes {
  IdShare!: number;
  IdPublication?: number;
  IdUser!: string;
  DataCreate?: string;

  // Share belongsTo Publications via IdPublication
  IdPublicationPublication!: Publications;
  getIdPublicationPublication!: Sequelize.BelongsToGetAssociationMixin<Publications>;
  setIdPublicationPublication!: Sequelize.BelongsToSetAssociationMixin<Publications, PublicationsId>;
  createIdPublicationPublication!: Sequelize.BelongsToCreateAssociationMixin<Publications>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Share {
    return Share.init({
    IdShare: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_share'
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
    IdUser: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'id_user'
    },
    DataCreate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'data_create'
    }
  }, {
    sequelize,
    tableName: 'share',
    schema: 'publication',
    timestamps: false,
    indexes: [
      {
        name: "share_pkey",
        unique: true,
        fields: [
          { name: "id_share" },
        ]
      },
    ]
  });
  }
}
