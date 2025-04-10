/**
 * 
 * @param email prueba_dos@gmail.com
 * @returns pru.....@g....com
 */
function maskEmail(email: string): string {
    const [localPart, domainPart] = email.split('@');
    
    // Enmascarar parte del localPart (antes del @)
    const visibleLocal = localPart.slice(0, 3);
    const maskedLocal = `${visibleLocal}.....`;

    // Enmascarar parte del domainPart (después del @)
    const [domainName, domainExtension] = domainPart.split('.');
    const visibleDomain = domainName.slice(0, 1);
    const maskedDomain = `${visibleDomain}...`;

    return `${maskedLocal}@${maskedDomain}.${domainExtension}`;
}

export {maskEmail}
