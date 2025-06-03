import { createContext, useContext, useState } from 'react';
import api from '@/lib/axios';

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    username: string;
    setUsername: (value: string) => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    logout: () => void;
}

// Outside of the provider, you get undefined
const AuthContext = createContext<AuthContextType|undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const logout = async () => {
        try {
            setIsLoading(true);
            const response = api.post('auth/logout');
            console.log(response);
            setIsLoggedIn(false);
            setUsername('');

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername, isLoading, setIsLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Auth context not defined, outside of provider?");
    }
    return context;
}