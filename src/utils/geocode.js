// src/utils/geocode.js
export async function geocode(city) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  const list = await res.json();
  if (!list.length) throw new Error(`Не удалось геокодировать ${city}`);
  return [ parseFloat(list[0].lat), parseFloat(list[0].lon) ];
}
