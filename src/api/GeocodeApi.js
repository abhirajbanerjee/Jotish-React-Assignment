const cache = new Map();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

    cache.set(city, null);
    return null;
}

export async function geocodeCities(cities) {
    const results = new Map();
    for (const city of cities) {
        const coords = await geocodeCity(city);
        results.set(city, coords);
        await delay(1100); // Nominatim rate limit: 1 req/sec
    }
    return results;
}
