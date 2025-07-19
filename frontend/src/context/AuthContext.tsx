

// import {
//   createContext,
//   useContext,
//   useState,

  
// } from 'react';
// // import toast from 'react-hot-toast';
// import {  useNavigate } from 'react-router-dom';
// import { api, BASE_URL } from '../api';
// import { jwtDecode } from 'jwt-decode';

// import axios from 'axios';


// interface User {
//   _id?: string;
//   name: string;
//   role: string;
//   email: string;

// }

// interface AuthContextType {
//   user: User | null;
//   login: (credentials: {
//     email: string;
//     password: string;
//   }) => Promise<void>;
//   logout: () => void;
//   loading: boolean;
//   updateToken: () => Promise<void>;
 
//   signup: (credentials: { name: string; email: string; password: string; role?: string }) => Promise<void>;

// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

//   const [user, setUser] = useState<User | null>(() => {
//     const tokens = localStorage.getItem('auth_tokens');
//     if (tokens) {
//       try {
//         const parsed = JSON.parse(tokens);
        
//         return jwtDecode(parsed.tokens.access);
//       } catch {
//         return null;
//       }
//     }
//     return null;
//   });
//   let [authTokens, setAuthTokens] = useState<{access: string; refresh: string} | null>(() => {
//     const tokens = localStorage.getItem('auth_tokens');
//     return tokens ? JSON.parse(tokens) : null;
//   });
 
//   const [loading, setLoading] = useState(true);
  
//   const navigate = useNavigate();

//   const updateToken = async () => {
    
//     const res = await api.post('/token/refresh/', {
//       refresh: authTokens?.refresh,
//     })
//     if(res.status === 200){
//       setAuthTokens(res.data);
//       setUser(jwtDecode(res.data.access));
      
//       localStorage.setItem('auth_tokens', JSON.stringify(res.data));

//     } else {
//       logout()
//     }


//   };


//   const signup = async ({
//     name,
//     email,
//     password,
//     role = 'employee',
//   }: {
//     name: string;
//     email: string;
//     password: string;
//     role?: string;
//   }) => {

//     try {
//     const response = await axios.post(`${BASE_URL}/register/`, {
//       name,
//       email,
//       password,
//       role,
//     });
  
//     const { tokens } = response.data;
//     setAuthTokens(tokens);
//       setUser(jwtDecode(tokens.access));
//     if(tokens){

//            if(tokens){
//           localStorage.setItem('auth_tokens', JSON.stringify(response.data));
 
//         } 
      
//     const role = (jwtDecode(tokens.access) as { role?: string })?.role;
//     if (role === 'Manager') {
//         navigate('/dashboard');
//     }
//     else {
//         navigate('/dashboard');
//     } 
//     }

//   } catch (error) {

//     throw error;
//   }

//   }

//   const login = async ({
   
//     email,
//     password,
  
//   }:{
//     email: string;
//     password: string;
//   }) => {
//     try {
//       const res = await axios.post(`${BASE_URL}/login/`, {
//         email,
//         password,
//       });
//       setLoading(false);

 
//       const { tokens } = res.data;
     
//       setAuthTokens(tokens);
//       setUser(jwtDecode(tokens.access));

      
      
//      if(tokens){
//           localStorage.setItem('auth_tokens', JSON.stringify(res.data));
//           navigate('/');
 
//         }else {
//           navigate('/signup');
//         }
      
 
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('auth_tokens');
//     setUser(null);
//     setAuthTokens(null);
//     navigate('/login');
//   };


// // useEffect(()=>{
// //   let interval = setInterval(() => {
// //     if(authTokens){
// //      updateToken();
// //     }
// //   }, 2000);
// //   return () => clearInterval(interval);
// // },[authTokens])


//   return (
//     <AuthContext.Provider
//       value={{ user, login, logout, loading, updateToken, signup }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context)
//     throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// };

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, BASE_URL } from '../api';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id?: string;
  name: string;
  role: string;
  email: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored)?.tokens : null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return jwtDecode(parsed.tokens.access) as User;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Utility to persist and update state
  const saveAuth = (tokens: AuthTokens) => {
    setAuthTokens(tokens);
    const decoded = jwtDecode(tokens.access);
    setUser(decoded as User);
    localStorage.setItem('auth_tokens', JSON.stringify({ tokens }));
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/login/`, { email, password });
      const { tokens } = res.data;
      saveAuth(tokens);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ name, email, password, role = 'employee' }: { name: string; email: string; password: string; role?: string }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/register/`, { name, email, password, role });
      const { tokens } = res.data;
      saveAuth(tokens);
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateToken = async () => {
    if (!authTokens?.refresh) return;

    try {
      const res = await api.post('/token/refresh/', { refresh: authTokens.refresh });
      if (res.status === 200) {
        saveAuth(res.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem('auth_tokens');
    navigate('/login');
  };

  
  useEffect(() => {
    const interval = setInterval(() => {
      if (authTokens) updateToken();
    }, 1000 * 60 * 4); 

    return () => clearInterval(interval);
  }, [authTokens]);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateToken, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

