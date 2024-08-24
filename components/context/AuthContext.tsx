import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '@/config/config';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenNavigationProp } from '@/types';

interface AuthContextProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  isLoggedIn: boolean;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${config.BASE_URL}/login/`, 
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const data = response.data;
      if (response.status === 200) {
        setUser(data.user);
        setToken(data.token);
        setIsLoggedIn(true);
        navigation.navigate('Tabs');
        await AsyncStorage.setItem('authToken', data.token);
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    // Remove token from AsyncStorage
    await AsyncStorage.removeItem('authToken');
  };

  // Retrieve token from AsyncStorage on initial load
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, token, isLoggedIn, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
