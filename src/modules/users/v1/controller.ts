import { Request, Response } from 'express';
import UserService from './service';
import { UserModel } from './model';

// Obtener todos los registros
export const findAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserService.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener registros' });
    }
};

// Obtener un registro por ID
export const findByPk = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;   
    try {
        const user = await UserService.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'Registro no encontrado' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el registro' });
    }
};

// Crear un nuevo registro
export const createData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData: Omit<UserModel, 'id_user'> = req.body;
        
        //validar datos antes de pasar al service
        
        const newUser = await UserService.createData(userData);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error });
    }
};

// Actualizar un registro existente
export const updateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;
        const userData: Partial<Omit<UserModel, 'id_user'>> = req.body;
        const updatedUser = await UserService.updateById(id, userData);
        
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error actualizando el usuario:', error);
        res.status(500).json({ error: 'Error actualizando el usuario' });
    }
};

// Eliminar un registro
export const deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;
        const success = await UserService.deleteById(id);
        
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error eliminando el usuario:', error);
        res.status(500).json({ error: 'Error eliminando el usuario' });
    }
};
