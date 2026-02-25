// api/GeocodeApi.js — Geocodes city names to lat/lng using Nominatim (OpenStreetMap).
// Used as a fallback when a city is not in our static lookup table.

const cache = new Map(); // in-memory cache: city → { lat, lng }

// Nominatim requires max 1 request/second — we stagger requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Geocode a single city name → { lat, lng } using Nominatim.
 * Returns null if the city cannot be resolved.
 */
export async function geocodeCity(city) {
    if (cache.has(city)) return cache.get(city);

    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
        const res = await fetch(url, {
            headers: { 'Accept-Language': 'en', 'User-Agent': 'EmployeeDirectoryApp/1.0' },
        });
        const data = await res.json();
        if (data && data.length > 0) {
            const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            cache.set(city, coords);
            return coords;
        }
    } catch (err) {
        console.warn(`[GeocodeApi] Failed to geocode "${city}":`, err.message);
    }

    cache.set(city, null); // cache misses to avoid repeated failed calls
    return null;
}

/**
 * Geocode an array of unique city names with rate limiting (1 req/sec).
 * Returns a Map<city, { lat, lng } | null>.
 */
export async function geocodeCities(cities) {
    const results = new Map();
    for (const city of cities) {
        const coords = await geocodeCity(city);
        results.set(city, coords);
        await delay(1100); // Nominatim rate limit: 1 req/sec
    }
    return results;
}
