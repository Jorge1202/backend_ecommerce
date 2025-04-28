export interface NewUser {
    IdHistoryRegister: number;
    Email: string;
    Password?: string;

    Username: string;
    Name: string;
    Firstname: string;
    Lastname?: string;
    
    Genero?: string;
    Phone?: string;
} 

export interface RegisterResult {
    Token: string;
    maskedEmail: string;
}