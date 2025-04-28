import { db } from "../config/database.core";
import { initModels } from '../../api/v1/shared/init-models'; 

// Función para autenticar y sincronizar la base de datos
export const connectAndSyncDatabase = async () => {

    await authenticateDatabase()
    // Inicializar los modelos
    initModels(db);
    
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
        // Sincronizar la base de datos
        // force: false, elimina todo y vuelve a crear (¡no usar!).
       // { alter: true } ajusta las tablas existentes si falta alguna columna o cambio.
        await db.sync({ alter: true });
        console.log('✅  Base de datos sincronizada');
      } catch (error) {
        console.error('❌ Error al sincronizar la base de datos:', error);
      }
}


