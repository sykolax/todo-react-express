interface CreateUser {
    email: string;
    password: string;
    name: string;
};

interface FindUserByCredentials {
    email: string;
    password: string;
};

interface FindUserById {
    id: number;
};

interface UpdateUser {
    id: number;
    newPassword: string;
};