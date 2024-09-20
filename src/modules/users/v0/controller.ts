// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import UserService from './service';

// Obtener todos los usuarios
export const findAll = async (req: Request, res: Response): Promise<void> => {    
    try {
        const users = await UserService.findAll();        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Obtener un usuario por ID
export const findByPk = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    try {
        const user = await UserService.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Crear un nuevo usuario
// export const createUser = async (req: Request, res: Response): Promise<void> => {
//     const { name, email } = req.body;
//     try {
//         const newUser = await UserService.createUser({ name, email });
//         res.status(201).json(newUser);
//     } catch (error) {
//         res.status(500).json({ message: 'Error al crear usuario' });
//     }
// };
