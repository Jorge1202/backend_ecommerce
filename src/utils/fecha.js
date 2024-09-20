/**
 * Para almacenar fechas y horas en una base de datos de manera que sean consistentes sin importar la zona horaria, 
 * es una buena práctica usar la hora UTC (Tiempo Universal Coordinado). 
 * UTC es una zona horaria estándar que no cambia con el horario de verano 
 * y es comúnmente utilizada para almacenar fechas y horas en sistemas que requieren una consistencia global.
 * 
 * new Date().toISOString()
 */


export const fechaLocal = (isoDate) => {
    // const isoDate = "2024-09-13T00:23:00.802Z";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    // Crear un objeto Date en UTC
    const date = new Date(isoDate);
    
    // Convertir a la zona horaria deseada
    const options = { timeZone: timeZone, hour12: false };
    const newDateString = date.toLocaleString(locale, options);
    
    // console.log(date.toISOString());
    // console.log(newDateString);

    return newDateString
}
