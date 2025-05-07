import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(Cookies.get('token') || null); // Load from cookies
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error("Token verification failed or expired:", error);
                    Cookies.remove('token');
                    setToken(null);
                    setUser(null);
                    delete api.defaults.headers.common['Authorization'];
                }
            } else {
                delete api.defaults.headers.common['Authorization'];
            }
            setLoading(false);
        };

        verifyToken();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const newToken = response.data.token;
            Cookies.set( 'token', newToken, { expires: 7, secure: true, sameSite: 'Strict' } );
            console.log("Login successful:", newToken);
            setToken( newToken );
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            const userResponse = await api.get('/auth/me');
            setUser(userResponse.data);
            return true;
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            Cookies.remove('token');
            setToken(null);
            setUser(null);
            delete api.defaults.headers.common['Authorization'];
            return false;
        }
    };

    const logout = async () =>
    {
        const response  = await api.post('/auth/logout');
        Cookies.remove('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
