import { DataMail } from "../../../interfaces/mail";
import { parrafo_TR } from "./template-parrafo";

export const welcomeNewUser = (param:DataMail):string => `
    ${parrafo_TR({
        content: `¡Bienvenido a ${param.company}!`,
        style: 'font-size: 16px;'
    })} 
    ${parrafo_TR({
        content: `¡Estamos emocionados de que te hayas unido! 
            Ahora puedes comenzar a disfrutar de todo lo que nuestra plataforma tiene para ofrecerte.`
    })} 
    ${parrafo_TR({
        content: `En ${param.company}, podrás comprar de forma rápida y segura, compartir contenido y conectar con otros. ¡Es tu espacio para interactuar y crecer!`
    })} 
    ${parrafo_TR({
        content: `Si tienes alguna duda o necesitas ayuda, estamos aquí para asistirte.`
    })} 
    ${parrafo_TR({
        content: `¡Disfruta de tu experiencia en ${param.company}!`
    })} 
    ${parrafo_TR({
        content: `— El equipo de ${param.company}.`
    })}   
`;