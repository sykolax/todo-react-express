import axios from 'axios';

axios.defaults.withCredentials = true;

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER_URL, 
    timeout: 2000,
});

export default instance;