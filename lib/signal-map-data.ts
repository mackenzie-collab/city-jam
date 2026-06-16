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
  { slug: "beijing", name: "Beijing", coordinates: [116.4074, 39.9042], region: "asia" },
  { slug: "seoul", name: "Seoul", coordinates: [126.978, 37.5665], region: "asia" },
  { slug: "tokyo", name: "Tokyo", coordinates: [139.6917, 35.6895], region: "asia", hub: true },
  { slug: "sydney", name: "Sydney", coordinates: [151.2093, -33.8688], region: "oceania" },
];

export const CLUSTERS: { coordinates: [number, number]; radius: number }[] = [
  { coordinates: [-95, 38], radius: 28 },
  { coordinates: [10, 50], radius: 22 },
  { coordinates: [105, 35], radius: 30 },
];

export const SIGNAL_PATHS: [number, number][][] = [
  [[-95, 38], [10, 50]],
  [[10, 50], [105, 35]],
];

export const WORLD_GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function cityBySlug(slug: string): CityDot | undefined {
  return CITY_DOTS.find((c) => c.slug === slug);
}

export function nearestCity(lng: number, lat: number): CityDot {
  let best = CITY_DOTS[0];
  let bestDist = Infinity;
  for (const city of CITY_DOTS) {
    const [clng, clat] = city.coordinates;
    const d = (lng - clng) ** 2 + (lat - clat) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  }
  return best;
}

export function drifterAlias(userId: string): string {
  const n = parseInt(userId.replace(/\D/g, "").slice(-4) || "0", 10) % 9999;
  return `Drifter #${n.toString().padStart(4, "0")}`;
}
