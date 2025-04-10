import { DataMail } from "../../../interfaces/mail";

export const cedeAuth = (param:DataMail):string =>  `
    <tr>
        <td>
            <table style='width: 100%; padding: 25px 50px;'>
                <tr>
                    <td style='font-size:18px; line-height: 22px; font-weight: bold; text-align: center; text-align: center;'>
                        Verifica tu correo 
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>
            <table style='width: 100%; padding: 0px 60px 25px 60px;'>
                <tr>
                    <td style='font-size:12px; line-height: 40px;'>
                        Hola <strong>${param.name} ${param.firstname}</strong>.
                    </td> 
                </tr>
                <tr>
                    <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                        ¡Bienvenido a ${param.company}! Estamos emocionados de que te hayas registrado.
                    </td>   
                </tr>
                <tr>
                    <td>
                        <table align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; margin: 15px 0px; line-height: 22px; font-size: 12px; text-align: justify;'>  
                            <tr><td>
                                Para completar tu registro en ${param.company} y garantizar la seguridad de tu cuenta, necesitamos que verifiques tu correo. 
                                Utiliza el siguiente código para hacerlo.
                            </td></tr>                           
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; margin: 15px 0px; line-height: 22px; font-size: 12px; text-align: justify;'>  
                            <tr><td>
                                Código de Verificación: <strong style='letter-spacing: 2pt; font-size: 15px;'>${param.code}</strong>
                            </td></tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; margin: 15px 0px; line-height: 22px; font-size: 12px; text-align: justify;'>  
                            <tr><td>
                                Ingresa este código en nuestra plataforma para activar tu cuenta. 
                                Esta medida nos ayuda a mantener la seguridad y proteger tus datos.
                            </td></tr>
                        </table>
                    </td>
                </tr>
                
                <tr>
                    <td style='font:15px/1.25em Helvetica Neue,Arial,Helvetica; font-size: 12px; text-align: justify; line-height: 22px;'>
                        Si no has solicitado este registro, puedes ignorar este correo.
                    </td>   
                </tr>
                <tr>
                    <td style='font:15px/1.25em Helvetica Neue,Arial,Helvetica; font-size: 12px; text-align: justify; line-height: 22px;'>
                        Si tienes alguna duda o necesitas ayuda, no dudes en contactarnos.
                    </td>   
                </tr>
                <tr>
                    <td>
                        <table align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; margin: 15px 0px; line-height: 22px; font-size: 12px;'>                              
                            <tr><td>El equipo ${param.company}.</td></tr>
                        </table>
                    </td>
                </tr>                
            </table>
        </td>
    </tr>
`;

