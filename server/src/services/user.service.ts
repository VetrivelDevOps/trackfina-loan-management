import { User } from '../models/user.model';
import { UserType } from '../types/user.types';

export const createUser = async (userData: UserType): Promise<User> => {
    const user = await User.create(userData);
    return user;
};

export const getUserById = async (userId: string): Promise<User | null> => {
    const user = await User.findByPk(userId);
    return user;
};

export const updateUser = async (userId: string, userData: Partial<UserType>): Promise<User | null> => {
    const user = await getUserById(userId);
    if (user) {
        await user.update(userData);
        return user;
    }
    return null;
};

export const deleteUser = async (userId: string): Promise<boolean> => {
    const user = await getUserById(userId);
    if (user) {
        await user.destroy();
        return true;
    }
    return false;
};

export const getAllUsers = async (): Promise<User[]> => {
    const users = await User.findAll();
    return users;
};