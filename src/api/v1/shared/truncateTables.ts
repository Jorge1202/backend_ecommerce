import { HistoryRegister } from '../models/history-register';
import { CodeAutentication } from '../models/code-autentication'; 
import { User } from '../models/user';
import { Auth } from '../models/auth'; 
import { AuthTokens } from '../models/auth-tokens'; 
import { UserPage } from '../models/user-page';
import { Login } from '../models/login'
import { DeviceAuth } from '../models/device-auth';
import { Devices } from '../models/devices';
import { RefreshToken } from '../models/refresh-token';

import { logger } from '../../../core/logger';


// Truncar primero las tablas de relación para evitar violar restricciones
// Luego truncar las tablas principales


export const truncateTables = async () => {
  
  await RefreshToken.truncate({ restartIdentity: true, cascade: true });
  await HistoryRegister.truncate({ where: {}, restartIdentity: true });
  await AuthTokens.truncate({ where: {}, restartIdentity: true });
  await CodeAutentication.truncate({ restartIdentity: true, cascade: true });
  await UserPage.truncate({ restartIdentity: true, cascade: true });
  await Login.truncate({ restartIdentity: true, cascade: true });
  await DeviceAuth.truncate({ restartIdentity: true, cascade: true });
  await Devices.truncate({ restartIdentity: true, cascade: true });
  await Auth.truncate({ restartIdentity: true, cascade: true });
  await User.truncate({ restartIdentity: true, cascade: true });


  logger.info('⚠️ Truncate tables [connectAndSyncDatabase]')
}
