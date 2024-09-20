import { Request, Response } from 'express';
import { AuthService } from './service';
import { success, error } from '../../../middlewares/response';
import { Transaction } from 'sequelize';

const bcrypt = require("bcrypt");
class AuthController extends AuthService {

  constructor() {
    super(); 
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const findList = await this._findAll();
      
      success({ req, res, data: findList, status: 200 });
    } catch (err) {
      error({ req, res, data: 'Error fetching record ', details: err, status: 500 });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const findData = await this._findByPk(Number(id));
      if (findData) {
        success({ req, res, data: findData, status: 200 });
      } else {
        success({ req, res, data: 'Record not found', status: 204 });            
      }
    } catch (err) {
      error({ req, res, data: 'Error fetching record ', status: 500, details: err });
    }
  }

  public create = async (req: Request, res: Response, transaction: Transaction): Promise<any> => {
    try {
        // const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
        const data = req.body;
        let { auth } = data;
        const {Password, IdUser} = auth;
        const hashedPassword = await bcrypt.hash(Password, 10); // Asume que tienes un método para encriptar

        const authHas = {...auth, Password:hashedPassword, Pw:Password}
        const newRecord = await this._create(authHas, transaction);
        return newRecord; // Retorna el nuevo registro

    } catch (err) {
      throw new Error(`Error creating Auth record: ${err}`);
      // error({ req, res, data: 'Error creating record... ', status: 500, details: err });
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedRecord = await this._update(Number(id), req.body); // Llamada al servicio
      if (updatedRecord) {
        success({ req, res, data: updatedRecord, status: 200 });
      } else {
        error({ req, res, data: 'Record  not found', status: 204, });
      }
    } catch (err) {
      error({ req, res, data: 'Error updating record ', status: 500, details: err });
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this._destroy(Number(id)); // Llamada al servicio
      if (result) {
        success({ req, res, data: 'Record  deleted successfully', status: 200 });
      } else {
        error({ req, res, data: 'Record not found', status: 204, });
      }
    } catch (err) {
      error({ req, res, data: 'Error deleting record ', status: 500, details: err });
    }
  }

}

export default new AuthController();
