export interface CityDot {
  slug: string;
  name: string;
  coordinates: [number, number];
  region: "americas" | "europe" | "africa" | "asia" | "oceania";
  hub?: boolean;
}

export const CITY_DOTS: CityDot[] = [
  { slug: "new-york", name: "New York", coordinates: [-74.006, 40.7128], region: "americas", hub: true },
  { slug: "los-angeles", name: "Los Angeles", coordinates: [-118.2437, 34.0522], region: "americas" },
  { slug: "chicago", name: "Chicago", coordinates: [-87.6298, 41.8781], region: "americas" },
  { slug: "toronto", name: "Toronto", coordinates: [-79.3832, 43.6532], region: "americas" },
  { slug: "mexico-city", name: "Mexico City", coordinates: [-99.1332, 19.4326], region: "americas" },
  { slug: "sao-paulo", name: "São Paulo", coordinates: [-46.6333, -23.5505], region: "americas", hub: true },
  { slug: "buenos-aires", name: "Buenos Aires", coordinates: [-58.3816, -34.6037], region: "americas" },
  { slug: "london", name: "London", coordinates: [-0.1276, 51.5074], region: "europe", hub: true },
  { slug: "paris", name: "Paris", coordinates: [2.3522, 48.8566], region: "europe" },
  { slug: "berlin", name: "Berlin", coordinates: [13.405, 52.52], region: "europe" },
  { slug: "madrid", name: "Madrid", coordinates: [-3.7038, 40.4168], region: "europe" },
  { slug: "rome", name: "Rome", coordinates: [12.4964, 41.9028], region: "europe" },
  { slug: "lagos", name: "Lagos", coordinates: [3.3792, 6.5244], region: "africa" },
  { slug: "cairo", name: "Cairo", coordinates: [31.2357, 30.0444], region: "africa" },
  { slug: "johannesburg", name: "Johannesburg", coordinates: [28.0473, -26.2041], region: "africa" },
  { slug: "mumbai", name: "Mumbai", coordinates: [72.8777, 19.076], region: "asia" },
  { slug: "manila", name: "Manila", coordinates: [120.9842, 14.5995], region: "asia", hub: true },
  { slug: "singapore", name: "Singapore", coordinates: [103.8198, 1.3521], region: "asia" },
  { slug: "bangkok", name: "Bangkok", coordinates: [100.5018, 13.7563], region: "asia" },
  { slug: "jakarta", name: "Jakarta", coordinates: [106.8456, -6.2088], region: "asia" },
  { slug: "hong-kong", name: "Hong Kong", coordinates: [114.1694, 22.3193], region: "asia" },
  { slug: "taipei", name: "Taipei", coordinates: [121.5654, 25.033], region: "asia" },
  { slug: "beijing", name: "Beijing", coordinates: [116.4074, 39.9042], region: "asia" },
  { slug: "seoul", name: "Seoul", coordinates: [126.978, 37.5665], region: "asia" },
  { slug: "tokyo", name: "Tokyo", coordinates: [139.6917, 35.6895], region: "asia", hub: true },
  { slug: "sydney", name: "Sydney", coordinates: [151.2093, -33.8688], region: "oceania" },
  { slug: "melbourne", name: "Melbourne", coordinates: [144.9631, -37.8136], region: "oceania" },
];

export const CLUSTERS: { coordinates: [number, number]; radius: number }[] = [
  { coordinates: [-95, 38], radius: 28 },
  { coordinates: [10, 50], radius: 22 },
  { coordinates: [105, 35], radius: 30 },
  { coordinates: [121, 14], radius: 18 },
];

export const SIGNAL_PATHS: [number, number][][] = [
  [[-95, 38], [10, 50]],
  [[10, 50], [105, 35]],
  [[121, 14], [139.69, 35.69]],
];

export const WORLD_GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/** Max distance (km) before we still pick nearest hub but UI can warn */
export const NEAREST_CITY_MAX_KM = 800;

export function cityBySlug(slug: string): CityDot | undefined {
  return CITY_DOTS.find((c) => c.slug === slug);
}

function haversineKm(lng1: number, lat1: number, lng2: number, lat2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nearestCity(lng: number, lat: number): CityDot {
  let best = CITY_DOTS[0];
  let bestDist = Infinity;
  for (const city of CITY_DOTS) {
    const [clng, clat] = city.coordinates;
    const d = haversineKm(lng, lat, clng, clat);
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  }
  return best;
}

export function nearestCityWithDistance(
  lng: number,
  lat: number
): { city: CityDot; distanceKm: number } {
  const city = nearestCity(lng, lat);
  const [clng, clat] = city.coordinates;
  return { city, distanceKm: haversineKm(lng, lat, clng, clat) };
}

export function drifterAlias(userId: string): string {
  const n = parseInt(userId.replace(/\D/g, "").slice(-4) || "0", 10) % 9999;
  return `Drifter #${n.toString().padStart(4, "0")}`;
}
