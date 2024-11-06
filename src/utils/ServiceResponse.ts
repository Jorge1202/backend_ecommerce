export interface ServiceResponse<T> {
    code: number, 
    isError:boolean
    message?: T | string | [] | null;
}   