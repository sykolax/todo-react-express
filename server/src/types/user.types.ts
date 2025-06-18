export interface CreateUser {
    email: string;
    password: string;
    name: string;
};

export interface FindUserByCredentials {
    email: string;
    password: string;
};

export interface FindUserById {
    id: number;
};

export interface UpdateUser {
    id: number;
    newPassword: string;
};