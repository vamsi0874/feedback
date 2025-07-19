

import {
  createContext,
  useContext,
  useState,

  
} from 'react';
// import toast from 'react-hot-toast';
import {  useNavigate } from 'react-router-dom';
import { api, BASE_URL } from '../api';
import { jwtDecode } from 'jwt-decode';

import axios from 'axios';


interface User {
  _id?: string;
  name: string;
  role: string;
  email: string;

}

interface AuthContextType {
  user: User | null;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateToken: () => Promise<void>;
 
  signup: (credentials: { name: string; email: string; password: string; role?: string }) => Promise<void>;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<User | null>(() => {
    const tokens = localStorage.getItem('auth_tokens');
    if (tokens) {
      try {
        const parsed = JSON.parse(tokens);
        // console.log('Parsed tokens:', parsed);
        return jwtDecode(parsed.tokens.access);
      } catch {
        return null;
      }
    }
    return null;
  });
  let [authTokens, setAuthTokens] = useState<{access: string; refresh: string} | null>(() => {
    const tokens = localStorage.getItem('auth_tokens');
    return tokens ? JSON.parse(tokens) : null;
  });
 
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const updateToken = async () => {
    
    const res = await api.post('/token/refresh/', {
      refresh: authTokens?.refresh,
    })
    if(res.status === 200){
      setAuthTokens(res.data);
      setUser(jwtDecode(res.data.access));
      
      localStorage.setItem('auth_tokens', JSON.stringify(res.data));

    } else {
      logout()
    }


  };


  const signup = async ({
    name,
    email,
    password,
    role = 'employee',
  }: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {

    try {
    const response = await axios.post(`${BASE_URL}/register/`, {
      name,
      email,
      password,
      role,
    });
  
    const { tokens } = response.data;
    setAuthTokens(tokens);
      setUser(jwtDecode(tokens.access));
    if(tokens){

           if(tokens){
          localStorage.setItem('auth_tokens', JSON.stringify(response.data));
 
        } 
      
    const role = (jwtDecode(tokens.access) as { role?: string })?.role;
    if (role === 'Manager') {
        navigate('/dashboard');
    }
    else {
        navigate('/dashboard');
    } 
    }

  } catch (error) {

    throw error;
  }

  }

  const login = async ({
   
    email,
    password,
  
  }:{
    email: string;
    password: string;
  }) => {
    try {
      const res = await axios.post(`${BASE_URL}/login/`, {
        email,
        password,
      });
      setLoading(false);

 
      const { tokens } = res.data;
     
      setAuthTokens(tokens);
      setUser(jwtDecode(tokens.access));

      
      
     if(tokens){
          localStorage.setItem('auth_tokens', JSON.stringify(res.data));
          navigate('/dashboard');
 
        }else {
          navigate('/signup');
        }
      
 
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_tokens');
    setUser(null);
    setAuthTokens(null);
    navigate('/login');
  };


// useEffect(()=>{
//   let interval = setInterval(() => {
//     if(authTokens){
//      updateToken();
//     }
//   }, 2000);
//   return () => clearInterval(interval);
// },[authTokens])


  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, updateToken, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth must be used within an AuthProvider');
  return context;
};


