import { db } from "../config/database.core";
import { initModel } from '../../api/shared/models/initModels'; 

// Función para autenticar y sincronizar la base de datos
export const connectAndSyncDatabase = async () => {

    await authenticateDatabase()
    // Inicializar los modelos
    initModel(db);
    
    await syncDatabase()
};

const authenticateDatabase = async () => {
    try {
        // Conexión a la base de datos
        await db.authenticate();
        console.log(db.models); // Verifica si los modelos están siendo importados correctamente

        console.log('✅  Conexión a la base de datos exitosa');
      } catch (error) {
        console.error('🙁 No se pudo conectar a la base de datos:', error);
        return; // Detener ejecución si no se puede conectar
      }

}

const syncDatabase = async () => {
    try {
        // Sincronizar la base de datos (crear tablas o aplicar cambios)
        await db.sync({ force: true });
        console.log('✅  Base de datos sincronizada');
      } catch (error) {
        console.error('❌ Error al sincronizar la base de datos:', error);
      }
}


