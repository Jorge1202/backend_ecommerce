import { Request, Response } from 'express';
import { TypePageService } from '../Services/type_page.service';
import { success, error } from '../../middlewares/response';
import { ServiceResponse } from '../../Utils/ServiceResponse';

class TypePageController extends TypePageService {

  constructor() {
    super(); 
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._findAll();
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});



    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this._findByPk(Number(id));
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  public  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._createTypePage(req.body); // Llamada al servicio
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});


    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this._updateTypePage(Number(id), req.body); // Llamada al servicio
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this._destroyTypePage(Number(id)); // Llamada al servicio
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

}

export default new TypePageController();
