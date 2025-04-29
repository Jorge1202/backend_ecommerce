import { TokenData } from "../../common/interfaces/tokens"; // o tu tipo personalizado

declare global {
  namespace Express {
    interface Request {
      dataToken?: string | TokenData; // o el tipo que estés usando
    }
  }
}

export {};
