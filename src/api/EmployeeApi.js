import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

export const fetchEmployeesRaw = () =>
    apiClient.post('/gettabledata.php', { username: 'test', password: '123456' });
