// store/useEmployeeStore.js — Single source of truth for all employee data.
// The singleton EmployeeService instance is created here and shared via the store.

import { create } from 'zustand';
import { EmployeeService } from '../services/EmployeeService';

const service = new EmployeeService();  // Singleton pattern — one instance shared across the app

export const useEmployeeStore = create((set, get) => ({
    employees: [],
    status: 'idle',   // 'idle' | 'loading' | 'success' | 'error'
    error: null,
    service,          // expose service for ChartPage, MapPage etc. to call derived queries

    fetchEmployees: async () => {
        // KEY GUARD: The API is called exactly ONCE no matter how many pages mount.
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
