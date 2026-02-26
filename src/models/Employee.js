// Static coordinate lookup for mapping employees to cities
const CITY_COORDS = {
    // Global (datatables sample)
    'Edinburgh': [55.9533, -3.1883],
    'Tokyo': [35.6762, 139.6503],
    'San Francisco': [37.7749, -122.4194],
    'New York': [40.7128, -74.006],
    'London': [51.5074, -0.1278],
    'Singapore': [1.3521, 103.8198],
    'Sydney': [-33.8688, 151.2093],
    'São Paulo': [-23.5505, -46.6333],
    'Sao Paulo': [-23.5505, -46.6333],
    'Austin': [30.2672, -97.7431],
    'Zurich': [47.3769, 8.5417],
    'Amsterdam': [52.3676, 4.9041],
    'Paris': [48.8566, 2.3522],
    'Miami': [25.7617, -80.1918],
    'Seoul': [37.5665, 126.978],
    'Melbourne': [-37.8136, 144.9631],
    'Dublin': [53.3498, -6.2603],
    'Bangalore': [12.9716, 77.5946],
    'Cape Town': [-33.9249, 18.4241],
    'Shanghai': [31.2304, 121.4737],
    'Berlin': [52.52, 13.405],
    'Rome': [41.9028, 12.4964],
    'Toronto': [43.6532, -79.3832],
    'Chicago': [41.8781, -87.6298],
    'Los Angeles': [34.0522, -118.2437],
    'Jakarta': [-6.2088, 106.8456],
    'Bangkok': [13.7563, 100.5018],
    'Moscow': [55.7558, 37.6176],
    'Buenos Aires': [-34.6037, -58.3816],
    'Cairo': [30.0444, 31.2357],
    'Lagos': [6.5244, 3.3792],
    'Nairobi': [-1.286389, 36.817223],
    'Kuala Lumpur': [3.139, 101.6869],
    'Manila': [14.5995, 120.9842],
    'Hong Kong': [22.3193, 114.1694],
    'Oslo': [59.9139, 10.7522],
    'Stockholm': [59.3293, 18.0686],
    'Copenhagen': [55.6761, 12.5683],
    'Helsinki': [60.1699, 24.9384],
    'Brussels': [50.8503, 4.3517],
    'Vienna': [48.2082, 16.3738],
    'Warsaw': [52.2297, 21.0122],
    'Athens': [37.9838, 23.7275],
    'Prague': [50.0755, 14.4378],
    'Budapest': [47.4979, 19.0402],
    'Bucharest': [44.4268, 26.1025],
    'Madrid': [40.4168, -3.7038],
    'Barcelona': [41.3851, 2.1734],
    'Lisbon': [38.7223, -9.1393],
    // Indian cities
    'Mumbai': [19.076, 72.8777],
    'Delhi': [28.6139, 77.209],
    'Bengaluru': [12.9716, 77.5946],
    'Hyderabad': [17.385, 78.4867],
    'Chennai': [13.0827, 80.2707],
    'Kolkata': [22.5726, 88.3639],
    'Pune': [18.5204, 73.8567],
    'Ahmedabad': [23.0225, 72.5714],
    'Jaipur': [26.9124, 75.7873],
    'Surat': [21.1702, 72.8311],
    'Lucknow': [26.8467, 80.9462],
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

        // Salary: strip currency symbols/commas before parsing
        const rawSalary = isArray ? raw[5] : (raw.salary || 0);
        this.salary = typeof rawSalary === 'string'
            ? parseFloat(rawSalary.replace(/[^0-9.]/g, '')) || 0
            : parseFloat(rawSalary) || 0;

        this.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.name)}&backgroundColor=6366f1,8b5cf6,06b6d4,10b981&scale=90`;

        const cityKey = Object.keys(CITY_COORDS).find(
            k => k.toLowerCase() === this.city.toLowerCase()
        );
        const fallback = CITY_COORDS[cityKey] || [
            20.5937 + (this.id.charCodeAt(0) % 10 - 5),
            78.9629 + (this.id.charCodeAt(0) % 10 - 5),
        ];
        this.lat = fallback[0];
        this.lng = fallback[1];

        const idNum = parseInt(this.id, 10) || this.id.charCodeAt(0) || 0;
        this.status = STATUS_OPTIONS[Math.abs(idNum) % 3];
    }

    getDisplaySalary() {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(this.salary);
    }

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
