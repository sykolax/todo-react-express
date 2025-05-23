import { createContext, useContext, useState } from 'react';

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    username: string;
    setUsername: (value: string) => void;
}

// Outside of the provider, you get undefined
// Use it 
const AuthContext = createContext<AuthContextType|undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, username, setUsername}}>
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