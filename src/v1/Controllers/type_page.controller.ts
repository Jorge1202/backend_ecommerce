import { Request, Response } from 'express';
import { TypePageService } from '../Services/type_page.service';
import { success, error } from '../../Utils/Response/response';
import { ServiceResponse } from '../../Utils/Response/ServiceResponse';

class TypePageController extends TypePageService {

  constructor() {
    super(); 
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const {body, message, statusCode} = await this._findAll();
      success({ res, body, message, status: statusCode});  

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, statusCode} = await this._findByPk(Number(id));
      success({ res, body, message, status: statusCode});  

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const {body, message, statusCode} = await this._createTypePage(req.body); // Llamada al servicio
      success({ res, body, message, status: statusCode});  


    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, statusCode} = await this._updateTypePage(Number(id), req.body); // Llamada al servicio
      success({ res, body, message, status: statusCode});  

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, statusCode} = await this._destroyTypePage(Number(id)); // Llamada al servicio
      success({ res, body, message, status: statusCode});  

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

}

export default new TypePageController();
