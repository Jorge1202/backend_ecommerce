import { DataMail } from "../../../interfaces/mail";
import { parrafo_TR } from "./template-parrafo";

export const recoveryPass = (param:DataMail):string => `
    ${parrafo_TR({
        content: `Hola <strong>${param.name}</strong>.`,
        style: 'font-size: 16px;'
    })}  
    ${parrafo_TR({
        content: `Haz clic en el siguiente enlace para cambiar tu contraseña:`
    })} 
    ${parrafo_TR({
        content: `
            <center>
                <table>
                    <tr>
                        <td>
                            <a style='text-decoration: none; font-weight: bold;' href='${param.link}' target='_blank' data-saferedirecturl='${param.link}'>
                                <table border='0' cellpadding='14' cellspacing='0' style='background: #00916E; border-radius: 20px; width: 100%; height: 32px;'> 
                                    <tr> 
                                        <td align='center'>
                                            <font style='color:#ffffff;'>Cambiar conraseña</font>
                                        </td> 
                                    </tr>
                                </table> 
                            </a>
                        </td>
                    </tr>
                </table> 
            </center>          
        `
    })} 
    ${parrafo_TR({
        content: `Esta solicitud es válida por 15 minutos y solo puede usarse una vez.
                <br/> Una vez que la contraseña se actualice, el enlace quedará inhabilitado.`
    })} 
    ${parrafo_TR({
        content: `<strong>Importante:</strong> Si no solicitaste este cambio, puedes ignorar este correo.`
    })} 
    ${parrafo_TR({
        content: `— El equipo de ${param.company}.`
    })}     
`;


// <tr>
// <td style='text-align: justify; line-height: 22px;'>
//     Ingresa el siguiente código para restablecer la contraseña:
// </td>   
// </tr>
// <tr>
// <td style='text-align: justify; line-height: 22px;'>
//     <strong style='letter-spacing: 2pt; font-size: 17px;'>${param.code}</strong>
// </td>   
// </tr>
// <tr>
// <td>
//     <table align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; margin: 15px 0px; line-height: 22px; text-align: justify;'>  
//         <tr><td>
//             Este código es válido por 15 minutos y solo se puede usar una vez.
//         </td></tr>                           
//     </table>
// </td>
// </tr>