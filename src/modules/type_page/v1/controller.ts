import { Request, Response } from 'express';
import TypePageService from './service';
import { TypePageModel } from './model';

// Obtener todos los registros
export const findAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const pages = await TypePageService.findAll();
        res.status(200).json(pages);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener registros' });
    }
};

// Obtener un registro por ID
export const findByPk = async (req: Request, res: Response): Promise<void> => {
    const pageId = req.params.id;
    try {
        const page = await TypePageService.findByPk(pageId);
        if (!page) {
            res.status(404).json({ message: 'Registro no encontrado' });
        } else {
            res.status(200).json(page);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el registro' });
    }
};

// Crear un nuevo registro
export const createData = async (req: Request, res: Response): Promise<void> => {
    try {
        const pageData: Omit<TypePageModel, 'id_type_page'> = req.body;
        const newPage = await TypePageService.createData(pageData);
        res.status(201).json(newPage);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el registro' });
    }
};

// Actualizar un registro existente
export const updateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;
        const pageData: Partial<Omit<TypePageModel, 'id_type_page'>> = req.body;
        const updatedPage = await TypePageService.updateById(id, pageData);
        if (updatedPage) {
            res.status(200).json(updatedPage);
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el registro' });
    }
};

// Eliminar un registro
export const deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;
        const success = await TypePageService.deleteById(id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el registro' });
    }
};
