import { HistoryRegister } from '../models/history-register';
import { Login } from '../models/login'; 
import { CodeAutentication } from '../models/code-autentication'; 
import { Devices } from '../models/devices'; 
import { DeviceAuth } from '../models/device-auth'; 
import { User } from '../models/user';
import { Auth } from '../models/auth'; 
import { UserPage } from '../models/user-page'; 
import { AuthTokens } from '../models/auth-tokens'; 

// Truncar primero las tablas de relación para evitar violar restricciones
// Luego truncar las tablas principales


export const truncateTables = async () => {
  await Login.destroy({ where: {}, truncate: true, restartIdentity: true });
  await Devices.destroy({ where: {}, truncate: true, restartIdentity: true });
  await Auth.destroy({ where: {}, truncate: true, restartIdentity: true });
  
  
  
  await DeviceAuth.destroy({ where: {}, truncate: true, restartIdentity: true });
  await CodeAutentication.destroy({ where: {}, truncate: true, restartIdentity: true });
  await HistoryRegister.destroy({ where: {}, truncate: true, restartIdentity: true });
  await User.destroy({ where: {}, truncate: true, restartIdentity: true });
  await UserPage.destroy({ where: {}, truncate: true, restartIdentity: true });

}
