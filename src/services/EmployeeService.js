// services/EmployeeService.js — Business logic layer.
// OOP Principles: SRP (only fetches/queries employees), Encapsulation (#employees is private).

import { fetchEmployeesRaw } from '../api/EmployeeApi';
import { geocodeCity } from '../api/GeocodeApi';
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

        // Geocode any cities that weren't found in the static table (lat/lng = 0)
        await this.#geocodeUnknownCities();

        return this.#employees;
    }

    // Private: find employees with fallback coords (lat=0) and geocode their cities
    async #geocodeUnknownCities() {
        // Collect unique cities that still have placeholder coords
        const unknownCities = [
            ...new Set(
                this.#employees
                    .filter(e => e.lat === 0 && e.lng === 0)
                    .map(e => e.city)
            ),
        ];

        if (unknownCities.length === 0) return;

        console.log('[EmployeeService] geocoding unknown cities:', unknownCities);

        for (const city of unknownCities) {
            const coords = await geocodeCity(city);
            if (coords) {
                // Apply to all employees in this city
                this.#employees
                    .filter(e => e.city === city)
                    .forEach(e => { e.lat = coords.lat; e.lng = coords.lng; });
            }
        }
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
