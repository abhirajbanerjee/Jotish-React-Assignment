import { create } from 'zustand';
import { EmployeeService } from '../services/EmployeeService';

const service = new EmployeeService();

export const useEmployeeStore = create((set, get) => ({
    employees: [],
    status: 'idle',   // 'idle' | 'loading' | 'success' | 'error'
    error: null,
    service,

    fetchEmployees: async () => {
        if (get().status === 'success') return;
        set({ status: 'loading' });
        try {
            const data = await service.loadAll();
            set({ employees: data, status: 'success' });
        } catch (err) {
            set({ status: 'error', error: err.message });
        }
    },
}));
