import axios from 'axios';

// export const BASE_URL = 'http://127.0.0.1:8000/api'
export const BASE_URL = `${import.meta.env.VITE_DB_URL}`;



axios.defaults.withCredentials = true; 


export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(
    (config) => {
    const {tokens} = JSON.parse(localStorage.getItem('auth_tokens')!);
    
    if (tokens) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
}
);
