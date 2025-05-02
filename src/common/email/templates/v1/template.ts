export const template = (content: string, empresa: string): string =>  `
  <html xmlns='http://www.w3.org/1999/xhtml'>
    <head>
      <meta http-equiv='Content-Type' content='text/html; charset=utf-8' /> 
      <title></title>
    </head>
    <body bgcolor='#f6f8f1' style='margin: 0; padding: 0; min-width: 100%!important;'>
      <table style='width: 100%; max-width: 600px; background-color: #fff;' align='center' cellpadding='0' cellspacing='0' border='0'>
      ${header(empresa)}
        <tr>
          <td>
            <table style='width: 100%; padding: 0 10px; font-size: 14px;'>
              ${content}
            </table>
          </td>
        </tr>
        ${footer(empresa)}
      </table>
    </body>
  </html>
`;

const header = (empresa: string): string => `
  <tr>
    <td>
      <table style='width: 100%; padding: 25px 50px; font-size: 14px;'>
        <tr>
          <td>
            <img style='width: 10rem;' alt='${empresa}' src="cid:logoUnuspat@1.ee"/>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

const footer = (empresa: string): string => `
  <tr>
    <td style='background-color: #f0f2f2; color: #000000;'>
      <center>
        <table style='padding: 25px 0;'>
          <tr>
            <td style='text-align: center;'>
              <img style='width: 10rem;' alt='${empresa}' src="cid:logoUnuspat@2.ee"/>
            </td>
          </tr>
          <tr align='center'>
            <td>
              <table align='center' border='0' cellpadding='0' cellspacing='0' style='width: 100%; margin: 5px 0px; line-height: 22px; font-size: 14px;'>  
                <tr style='text-align: center;'><td> ${new Date().getFullYear()} ${empresa} ®  </td> </tr>
               
              </table>
            </td>
          </tr>
        </table>
      </center>
    </td>
  </tr>
`;

//© ® 
