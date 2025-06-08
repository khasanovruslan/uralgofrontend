// src/utils/geocode.js

/**
 * Ищет координаты города через Nominatim (OpenStreetMap).
 * @param {string} city — название города на русском
 * @returns {Promise<{lat: number, lng: number}>}
 */
// src/utils/geocode.js
export async function geocodeCity(city) {
  const base = import.meta.env.VITE_API_URL; // например, "http://localhost:3000"
  const res = await fetch(`${base}/api/geocode?city=${encodeURIComponent(city)}`);
  if (!res.ok) {
    throw new Error(`Geocode failed: ${res.status}`);
  }
  return await res.json(); // { lat, lng }
}
