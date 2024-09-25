import { Request, Response } from 'express';
import { CodeAutenticationService } from '../Services/code_autentication.service';
import { success, error } from '../../middlewares/response';
import { Transaction } from 'sequelize';

import { User } from '../models/user';
class CodeController extends CodeAutenticationService {

  constructor() {
    super();  
    
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const userPages = await this._findAll();
      success({ req, res, data: userPages, status: 200 });
    } catch (err) {
      error({ req, res, data: 'Error fetching user pages', details: err, status: 500 });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userPage = await this._findByPk(Number(id));
      
      if (userPage) {
        success({ req, res, data: userPage, status: 200 });
      } else {
    
        success({ req, res, data: 'Record not found', status: 204});
      }
    } catch (err) {
      error({ req, res, data: 'Error fetching record', status: 500, details: err });
    }
  }

  public create = async (req: Request, res: Response, transaction: Transaction ): Promise<any> => {
    // const { customAlphabet } = await import('nanoid'); // Si puedes usar "await" con top-level.
    
    try {
      // const { customAlphabet } = require('nanoid/async');

      const {code_autentication, IdUser, user } = req.body
      const customNanoid = '2536'
      const code = {
        isActive: true,
        Code: customNanoid
      }
      const codeData = {...code_autentication, ...code};
      await this._create(codeData, transaction);      

      await this.sendEmail(user)      
      await this.sendSMS(user)
      
      return 'Codigo enviado'
    } catch (err) {
      throw new Error(`Error creating Auth record: ${err}`);
    }
  }

  private sendEmail = async (user:User) => {
    if(!user.Email) return

    console.log('se envio un correo', user.Email);    
  }
  private sendSMS = async (user:User) => {
    if(!user.Phone) return
    
    console.log('se envio un sms', user.Phone);
    
  }



  


  // public updateById = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { id } = req.params;
  //     const updatedUserPage = await this._update(Number(id), req.body); // Llamada al servicio
  //     if (updatedUserPage) {
  //       success({ req, res, data: updatedUserPage, status: 200 });
  //     } else {
  //       error({ req, res, data: 'Record not found', status: 204, });
  //     }
  //   } catch (err) {
  //     error({ req, res, data: 'Error updating record', status: 500, details: err });
  //   }
  // }

  // public deleteById = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { id } = req.params;
  //     const result = await this._destroy(Number(id)); // Llamada al servicio
  //     if (result) {
  //       success({ req, res, data: 'User page deleted successfully', status: 200 });
  //     } else {
  //       error({ req, res, data: 'User page not found', status: 204, });
  //     }
  //   } catch (err) {
  //     error({ req, res, data: 'Error deleting user page', status: 500, details: err });
  //   }
  // }

}

export default new CodeController();
