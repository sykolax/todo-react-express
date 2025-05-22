import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER_URL, 
    timeout: 2000,
});

export default instance;