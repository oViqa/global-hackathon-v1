/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if coordinates are within Germany bounds (approximate)
 */
export function isInGermany(lat: number, lng: number): boolean {
  const GERMANY_BOUNDS = {
    north: 55.1,
    south: 47.3,
    east: 15.0,
    west: 5.9
  };

  return (
    lat >= GERMANY_BOUNDS.south &&
    lat <= GERMANY_BOUNDS.north &&
    lng >= GERMANY_BOUNDS.west &&
    lng <= GERMANY_BOUNDS.east
  );
}
