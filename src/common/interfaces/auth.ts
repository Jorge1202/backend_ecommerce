import { DevicesCreationAttributes } from '../../api/v1/models/devices';


interface body {
  newDevice: boolean,
  firstLogin: boolean,
  TOKEN_ACCESS:string
}

export interface ResponseLogin {
  body:body, 
  tokens:{
      TOKEN_REFRESH:string
  }
}
export interface ResponseDeviceLogin {
  body:body,  
  tokens:{
      TOKEN_DEVICE:string,
      TOKEN_REFRESH:string
  }
}
