import { DataMail } from "../../../interfaces/mail";

export const PasswordChangeSuccessful = (param:DataMail):string => `
    <tr>
        <td>
            <table style='width: 100%; padding: 25px 50px;'>
                <tr>
                    <td style='font-size:18px; line-height: 22px; font-weight: bold; text-align: center; text-align: center;'>
                        Cambio de Contraseña Exitoso
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>
            <table style='width: 100%; padding: 0px 60px 25px 60px;'>
                <tbody>
                    <tr>
                        <td style='font-size:12px; line-height: 40px;'>
                            ¡Hola ${param.name} ${param.firstname}!
                        </td> 
                    </tr>
                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            Hemos recibido una solicitud para cambiar la contraseña de tu cuenta asociada a este correo.
                        </td>   
                    </tr>
                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            Nos complace informarte que tu contraseña ha sido cambiada exitosamente.
                        </td>   
                    </tr>

                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                           Si no realizaste este cambio, te recomendamos que restablezcas tu contraseña inmediatamente 
                           y te pongas en contacto con nuestro soporte técnico.
                        </td>   
                    </tr>

                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            Para mayor seguridad, asegúrate de utilizar una contraseña fuerte y única.
                        </td>   
                    </tr>

                    <tr>
                        <td>
                            <table align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; margin: 2px 0px 6px 0px; line-height: 22px; font-size: 12px;'>  
                                <tr><td>
                                    Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
                                </td> </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; margin: 15px 0px; line-height: 22px; font-size: 12px;'>                            
                                <tr><td>El equipo de ${param.company}.</td></tr>
                            </table>
                        </td>
                    </tr>                    
                </tbody>
            </table>
        </td>
    </tr>
`;