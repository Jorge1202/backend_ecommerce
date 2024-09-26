interface Params {
    name:string
    firstname:string
    username:string
    code:string
    company:string
    link:string
}

export const welcomeNewUser = (param:Params):string => `
    <tr>
        <td>
            <table style='width: 100%; padding: 25px 50px;'>
                <tr>
                    <td style='font-size:18px; line-height: 22px; font-weight: bold; text-align: center; text-align: center;'>
                        BIENVENIDO
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
                            ¡Estamos emocionados de darte la bienvenida a  ${param.company}! 
                            Tu cuenta ha sido activada y ahora puedes iniciar sesión para disfrutar de todos los beneficios que nuestra plataforma tiene para ofrecerte.
                        </td>   
                    </tr>

                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            En ${param.company}, no solo puedes comprar productos de manera rápida y segura, 
                            sino que también puedes compartir tu propio contenido y construir tu comunidad. 
                            Ya sea que quieras descubrir nuevos artículos a través de videos o mostrar tus propias experiencias, 
                            aquí encontrarás un espacio donde tanto compradores como vendedores pueden interactuar y crecer juntos.
                        </td>   
                    </tr>

                    <tr>
                        <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                            ¡Estamos aquí para hacer tu experiencia de compra y venta lo más agradable posible!
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