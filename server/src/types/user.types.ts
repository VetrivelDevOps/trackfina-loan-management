export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreateInput {
    username: string;
    email: string;
    password: string;
}

export interface UserUpdateInput {
    username?: string;
    email?: string;
    password?: string;
}