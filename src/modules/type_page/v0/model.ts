import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../config/database/sequelizeORM';

class TypePageModel extends Model {
    public id_type_page!: number;
    public description!: string; // Revisa el nombre del campo, anteriormente estaba como 'descripction'
}

TypePageModel.init(
    {
        id_type_page: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        description: {  // Cambié el nombre del campo a 'description'
            type: DataTypes.STRING(50),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'type_page',
        schema: 'pages',
        timestamps: false
    }
);

export { TypePageModel };
