import { Request, Response } from 'express';
import { CodeAutenticationService } from '../Services/code_autentication.service';
import { success, error } from '../../middlewares/response';
import { Transaction } from 'sequelize';

import { User } from '../models/user';
class CodeController extends CodeAutenticationService {

  constructor() {
    super();  
    
  }


}

export default new CodeController();
