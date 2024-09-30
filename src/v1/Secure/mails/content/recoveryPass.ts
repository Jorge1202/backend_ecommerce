import { DataMail } from "../mail";

export const recoveryPass = (param:DataMail):string => `
    <tr>
        <td>
            <table style='width: 100%; padding: 25px 50px;'>
                <tr>
                    <td style='font-size:18px; line-height: 22px; font-weight: bold; text-align: center; text-align: center;'>
                        Solicitud de Restablecimiento de Contraseña
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
                            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. 
                        </td>   
                    </tr>

                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            <strong>Restablecer mi contraseña</strong>
                        </td>   
                    </tr>

                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            Este enlace es válido durante los próximos <strong>30 minutos por razones de seguridad.</strong>. 
                            Si no restableces tu contraseña dentro de este tiempo, deberás solicitar un nuevo enlace.
                        </td>   
                    </tr>
                    <tr>
                        <td>
                            <center>
                                <table style='margin: 35px 0 0 0;'>
                                    <tr>
                                        <td>
                                            <a style='text-decoration: none; font-weight: bold;' href='${param.link}' target='_blank' data-saferedirecturl='${param.link}'>
                                                <table border='0' cellpadding='14' cellspacing='0' style='background: #00916E; border-radius: 20px; width: 230px; height: 32px;'> 
                                                    <tr> 
                                                        <td align='center'>
                                                            <font style='color:#ffffff;'>Restablecer mi conraseña</font>
                                                        </td> 
                                                    </tr>
                                                </table> 
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </center>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                        ${param.link}
                        </td>   
                    </tr>
                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            Si no has solicitado el restablecimiento de tu contraseña, 
                            no te preocupes, simplemente ignora este correo. Tu cuenta sigue segura y no se realizarán cambios.
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