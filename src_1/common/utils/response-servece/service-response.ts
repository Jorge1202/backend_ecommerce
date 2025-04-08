// common/utils/serviceResponse.ts
import { ServiceResponse, SuccessParams, ErrorParams, CriticalErrorParams } from "../../interfaces/service-response";

export function SuccessResult<T>({body = null, message, status = 200}: SuccessParams<T>): ServiceResponse<T> {
  return {
    error: false,
    body,
    message,
    status
  };
}

export function ErrorResult({ message, status = 400 }: ErrorParams) {
  return {
    error: true,
    body: null,
    message,
    status
  };
}

export function CriticalError({ message, status = 500, error }: CriticalErrorParams): never {
  throw {
    error: true,
    body: null,
    message,
    status,
    details: error || null
  };
}
