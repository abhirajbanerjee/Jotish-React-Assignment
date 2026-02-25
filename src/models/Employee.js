// models/Employee.js — ES6 class that maps raw API JSON → clean typed object.
// OOP Principles: Encapsulation (hides raw field names), Abstraction (computed methods).

// City coordinates fallback — used when API lat/lng is 0 or missing.
const CITY_COORDS = {
    Mumbai: [19.076, 72.8777],
    Delhi: [28.6139, 77.209],
    Bangalore: [12.9716, 77.5946],
    Bengaluru: [12.9716, 77.5946],
    Hyderabad: [17.385, 78.4867],
    Chennai: [13.0827, 80.2707],
    Kolkata: [22.5726, 88.3639],
    Pune: [18.5204, 73.8567],
    Ahmedabad: [23.0225, 72.5714],
    Jaipur: [26.9124, 75.7873],
    Surat: [21.1702, 72.8311],
    Lucknow: [26.8467, 80.9462],
    Kanpur: [26.4499, 80.3319],
    Nagpur: [21.1458, 79.0882],
    Indore: [22.7196, 75.8577],
    Bhopal: [23.2599, 77.4126],
    Visakhapatnam: [17.6868, 83.2185],
    Patna: [25.5941, 85.1376],
    Vadodara: [22.3072, 73.1812],
    Ghaziabad: [28.6692, 77.4538],
};

const STATUS_OPTIONS = ['Active', 'On Leave', 'Remote'];

export class Employee {
    constructor(raw) {
        // API sends each employee as an array:
        // [0] name, [1] role, [2] city, [3] id, [4] startDate, [5] salary
        const isArray = Array.isArray(raw);

        this.id = isArray ? String(raw[3]) : String(raw.id || raw.emp_id || Math.random());
        this.name = isArray ? (raw[0] || 'Unknown') : (raw.name || raw.emp_name || 'Unknown');
        this.role = isArray ? (raw[1] || 'Employee') : (raw.designation || raw.role || 'Employee');
        this.city = isArray ? (raw[2] || 'Unknown') : (raw.city || 'Unknown');
        this.startDate = isArray ? (raw[4] || '') : (raw.start_date || '');
        this.email = isArray ? '' : (raw.email || '');
        this.phone = isArray ? '' : (raw.phone || '');
        this.department = isArray ? '' : (raw.department || '');

        // Salary: API sends "$320,800" — strip currency symbols/commas before parsing
        const rawSalary = isArray ? raw[5] : (raw.salary || 0);
        this.salary = typeof rawSalary === 'string'
            ? parseFloat(rawSalary.replace(/[^0-9.]/g, '')) || 0
            : parseFloat(rawSalary) || 0;

        // Avatar from DiceBear using name as seed
        this.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.name)}&backgroundColor=6366f1,8b5cf6,06b6d4,10b981&scale=90`;

        // Lat/Lng: API doesn't provide coordinates, fall back to city lookup
        const cityKey = Object.keys(CITY_COORDS).find(
            k => k.toLowerCase() === this.city.toLowerCase()
        );
        const fallback = CITY_COORDS[cityKey] || [
            20.5937 + (this.id.charCodeAt(0) % 10 - 5),
            78.9629 + (this.id.charCodeAt(0) % 10 - 5),
        ];
        this.lat = fallback[0];
        this.lng = fallback[1];

        // Stable status derived from id
        const idNum = parseInt(this.id, 10) || this.id.charCodeAt(0) || 0;
        this.status = STATUS_OPTIONS[Math.abs(idNum) % 3];
    }

    // Abstraction: hides Intl.NumberFormat complexity from all callers.
    getDisplaySalary() {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(this.salary);
    }

    // Abstraction: map page doesn't need to know raw API shape.
    toMapMarker() {
        return {
            lat: this.lat,
            lng: this.lng,
            label: `${this.name} — ${this.getDisplaySalary()}`,
        };
    }

    getInitials() {
        return this.name
            .split(' ')
            .map(w => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }
}
