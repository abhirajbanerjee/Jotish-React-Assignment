// hooks/useEmployees.js — Custom hook: triggers fetch, exposes loading/error state.
import { useEffect } from 'react';
import { useEmployeeStore } from '../store/useEmployeeStore';

export function useEmployees() {
    const { employees, status, error, fetchEmployees } = useEmployeeStore();
    useEffect(() => { fetchEmployees(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return {
        employees,
        isLoading: status === 'loading' || status === 'idle',
        isError: status === 'error',
        error,
    };
}
