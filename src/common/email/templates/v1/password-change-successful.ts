import { DataMail } from "../../../interfaces/mail";
import { parrafo_TR } from "./template-parrafo";

export const PasswordChangeSuccessful = (param:DataMail):string => `
    ${parrafo_TR({
        content: `¡Hola <strong>${param.name}</strong>!`,
        style: 'font-size: 16px;'
    })} 
    ${parrafo_TR({
        content: `Tu contraseña ha sido actualizada correctamente.`
    })} 
    ${parrafo_TR({
        content: `Si no realizaste esta acción, restablécela de inmediato y contacta a nuestro soporte.`
    })} 
    ${parrafo_TR({
        content: `Para tu seguridad, usa una contraseña fuerte y única.`
    })} 
    ${parrafo_TR({
        content: `— El equipo de ${param.company}.`
    })}    
`;