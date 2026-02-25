// services/EmployeeService.js — Business logic layer.
// OOP Principles: SRP (only fetches/queries employees), Encapsulation (#employees is private).

import { fetchEmployeesRaw } from '../api/EmployeeApi';
import { Employee } from '../models/Employee';

export class EmployeeService {
    #employees = [];  // private field — external code cannot mutate this directly

    async loadAll() {
        const res = await fetchEmployeesRaw();
        const d = res.data;

        // API returns: { TABLE_DATA: { data: [[name, role, city, id, date, salary], ...] } }
        const rawList = d?.TABLE_DATA?.data || [];

        console.log('[EmployeeService] resolved', rawList.length, 'records');

        this.#employees = rawList.map(raw => new Employee(raw));
        return this.#employees;
    }

    getAll() {
        return this.#employees;
    }

    findById(id) {
        return this.#employees.find(e => String(e.id) === String(id)) || null;
    }

    search(query) {
        if (!query || !query.trim()) return this.#employees;
        const q = query.toLowerCase().trim();
        return this.#employees.filter(e =>
            e.name.toLowerCase().includes(q) ||
            e.city.toLowerCase().includes(q) ||
            e.role.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q)
        );
    }

    getTopBySalary(n = 10) {
        return [...this.#employees]
            .sort((a, b) => b.salary - a.salary)
            .slice(0, n);
    }

    getAverageSalary() {
        if (!this.#employees.length) return 0;
        return this.#employees.reduce((sum, e) => sum + e.salary, 0) / this.#employees.length;
    }
}
