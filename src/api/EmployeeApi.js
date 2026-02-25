// api/EmployeeApi.js — Isolates all HTTP concerns. No business logic here.
// baseURL points to the Vite proxy (/api → https://backend.jotish.in/backend_dev)
// which bypasses browser CORS restrictions during development.
import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',   // proxied by vite.config.js → backend.jotish.in/backend_dev
    timeout: 10000,
});

export const fetchEmployeesRaw = () =>
    apiClient.post('/gettabledata.php', { username: 'test', password: '123456' })
        .then(res => {
            // 🔍 Log raw API response so you can see its shape in DevTools Console
            console.log('[EmployeeApi] raw response:', res.data);
            return res;
        });
