import axios from 'axios';
import cookieParser from 'cookie-parser';

const API_URL = 'http://localhost:3000/appointments';

const getAuthToken = () => cookieParser('access_token');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
});

export const getMyAppointments = async () => api.get('/me')