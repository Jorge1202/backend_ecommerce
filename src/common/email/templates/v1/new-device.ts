import { DataMail } from "../../../interfaces/mail";
import { parrafo_TR } from "./template-parrafo";

export const newDevice = (param:DataMail):string =>  `
    ${parrafo_TR({
        content: `Hola <strong>${param.name}</strong>.`,
        style: 'font-size: 16px;'
    })}   
    ${parrafo_TR({
        content: `Hemos detectado un intento de inicio de sesión desde un nuevo dispositivo.`
    })}   
    ${parrafo_TR({
        content: `Por seguridad, necesitamos que verifiques este acceso ingresando el siguiente código en ${param.company}:`
    })}   
    ${parrafo_TR({
        content: `<strong style='letter-spacing: 2pt; font-size: 24px;'>${param.code}</strong>`
    })}   
    ${parrafo_TR({
        content: `Este código es válido por 15 minutos y solo se puede usar una vez.`
    })}   
    ${parrafo_TR({
        content: `<strong>Importante:</strong> Si no has solicitado este registro, puedes ignorar este correo.`
    })}   
    ${parrafo_TR({
        content: `— El equipo de ${param.company}.`
    })}    
`;

