import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { User } from '../types/user.types';

class UserController {
    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users: User[] = await UserService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving users', error });
        }
    }

    async getUserById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const user: User | null = await UserService.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving user', error });
        }
    }

    async createUser(req: Request, res: Response): Promise<Response> {
        const newUser: User = req.body;
        try {
            const createdUser: User = await UserService.createUser(newUser);
            return res.status(201).json(createdUser);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating user', error });
        }
    }

    async updateUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const updatedUser: User = req.body;
        try {
            const user: User | null = await UserService.updateUser(id, updatedUser);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating user', error });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const deleted = await UserService.deleteUser(id);
            if (!deleted) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting user', error });
        }
    }
}

export default new UserController();