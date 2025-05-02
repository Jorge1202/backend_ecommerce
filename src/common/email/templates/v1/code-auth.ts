import { DataMail } from "../../../interfaces/mail";
import { parrafo_TR } from "./template-parrafo";

export const cedeAuth = (param:DataMail):string =>  `
    ${parrafo_TR({
        content: `Hola <strong>${param.name}</strong>.`
    })}
    ${parrafo_TR({
        content: `¡Gracias por unirte a ${param.company}! 
                Para garantizar la seguridad de tu cuenta, confirmá tu correo. Solo tienes que ingresar este código:`
    })}
    ${parrafo_TR({
        content: `<strong style='letter-spacing: 2pt; font-size: 24px;'>${param.code}</strong>`
    })}
    ${parrafo_TR({
        content: `Este código es válido por 15 minutos y solo se puede usar una vez.`
    })}
    ${parrafo_TR({
        content: `Si no has solicitado este registro, puedes ignorar este correo.`
    })}
    ${parrafo_TR({
        content: `— El equipo de ${param.company}.`
    })}      
`;

