import { DataMail } from "../../../interfaces/mail";

export const recoveryPass = (param:DataMail):string => `
    <tr>
        <td>
            <table style='width: 100%; padding: 25px 50px;'>
                <tr>
                    <td style='font-size:18px; line-height: 22px; font-weight: bold; text-align: center; text-align: center;'>
                        Solicitud de cambio de Contraseña
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
                            Ingresa el siguiente código para restablecer la contraseña:
                        </td>                       
                    </tr>

                    <tr>
                        <td>
                            <table align='left' border='0' cellpadding='0' cellspacing='0' style='margin: 15px 0px; line-height: 22px; font-size: 12px; text-align: justify;'>  
                                <tr>
                                    <td style='font-size: 11px; padding: 14px 32px 14px 32px; border-radius: 7px; display: block; border: 1px solid #E28000; background: #fff4e6;'>
                                        <strong style='letter-spacing: 2pt; font-size: 17px;'>${param.code}</strong>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            También puedes cambiar la contraseña directamente con el siguiente enlance.
                        </td>                       
                    </tr>
            
                    <tr>
                        <td>
                            <center>
                                <table style='margin: 35px 0 0 0;'>
                                    <tr>
                                        <td style='font-size: 12px; text-align: center; line-height: 22px;'>
                                            Da click en el siguinte enlace para cambiar tu contraseña.
                                        </td>   
                                    </tr>
                                    <tr>
                                        <td>
                                            <a style='text-decoration: none; font-weight: bold;' href='${param.link}' target='_blank' data-saferedirecturl='${param.link}'>
                                                <table border='0' cellpadding='14' cellspacing='0' style='background: #00916E; border-radius: 20px; width: 100%; height: 32px;'> 
                                                    <tr> 
                                                        <td align='center'>
                                                            <font style='color:#ffffff;'>Cambiar mi conraseña</font>
                                                        </td> 
                                                    </tr>
                                                </table> 
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </cenetr>
                        </td>
                    </tr>

                    <tr style='margin: 35px 0 0 0; display: block;'>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            Este enlace es válido durante los próximos <strong>30 minutos por razones de seguridad.</strong>. 
                            Si no cambias tu contraseña dentro de este tiempo, deberás solicitarlo nuevanete.
                        </td>   
                    </tr>
        
                    <tr style='margin: 35px 0 0 0; display: block;'>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            Si no has solicitado el restablecimiento de tu contraseña, 
                            no te preocupes, simplemente ignora este correo. Tu cuenta sigue segura y no se realizarán cambios.
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