import { Request, Response } from 'express';
import { TypePageService } from '../Services/type_page.service';
import { success, error } from '../../middlewares/response';

class TypePageController extends TypePageService {

  constructor() {
    super(); 
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const findList = await this._ProtectedFindAll();
      success({ req, res, data: findList, status: 200 });
    } catch (err) {
      error({ req, res, data: 'Error fetching user ', details: err, status: 500 });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const findData = await this._ProtectedFindByPk(Number(id));
      if (findData) {
        success({ req, res, data: findData, status: 200 });
      } else {
        error({ req, res, data: 'Record not found', status: 204 });
      }
    } catch (err) {
      error({ req, res, data: 'Error fetching record ', status: 500, details: err });
    }
  }

  public  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newRecord = await this._ProtectedCreate(req.body); // Llamada al servicio
      success({ req, res, data: newRecord, status: 201 });
    } catch (err) {
      error({ req, res, data: 'Error creating record ', status: 500, details: err });
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedRecord = await this._ProtectedUpdate(Number(id), req.body); // Llamada al servicio
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
      const result = await this._ProtectedDestroy(Number(id)); // Llamada al servicio
      if (result) {
        success({ req, res, data: 'Record  deleted successfully', status: 200 });
      } else {
        error({ req, res, data: 'Record  not found', status: 204, });
      }
    } catch (err) {
      error({ req, res, data: 'Error deleting record ', status: 500, details: err });
    }
  }

}

export default new TypePageController();
