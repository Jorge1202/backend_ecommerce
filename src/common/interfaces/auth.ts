import { DevicesCreationAttributes } from '../../api/v1/models/devices';

export enum SuccessResponseLogin {
  DeviceVerification = 'device_verification',
  LoginSuccess = 'login_success',
}

interface body {
  // HashDevice?: string; // cuando aún no se ha validado el dispositivo
  newDevice: boolean;
  firstLogin: boolean;
  TOKEN_ACCESS: string;
}
// Caso 1: requiere verificación de dispositivo
// export interface ResponseLoginDeviceVerification {
//   type: 'device_verification';
//   body: {
//     TokenDevice: string;
//   };
//   tokens: null;
// }

// Caso 2: login exitoso
export interface ResponseLogin {
  body: body;
  tokens: {
    TOKEN_REFRESH: string;
  };
}

// Unión de ambos tipos posibles
// export type ResponseLogin = ResponseLoginDeviceVerification | ResponseLoginSuccess;

export interface ResponseDeviceLogin {
  body:body,  
  tokens:{
      TOKEN_DEVICE:string,
      TOKEN_REFRESH:string
  }
}

