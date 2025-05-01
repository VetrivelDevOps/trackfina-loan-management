import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api'; // Your API service

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  company: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    website: string;
    industry: string;
  };
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in (e.g., by checking token in localStorage)
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set auth token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get current user
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (err) {
          // If token is invalid, clear it
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store token
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Set user
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      // For development or if your backend is not ready, you can mock this
      // const response = await api.post('/auth/register', data);
      
      // For now, let's just mock a successful registration
      console.log('Registration data:', data);
      
      // In a real app, you would send this data to your backend
      // const response = await api.post('/auth/register', data);
      
      // Success message or redirect can be handled in the component
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};