/**
 * mockRiders.ts
 * Static mock rider data for FEZU automatic assignment simulation.
 * Shape mirrors the intended FezuRider Firestore document.
 * Swap data source in useFezuStore to plug in real backend.
 */

export type RiderStatus = 'online' | 'offline' | 'busy'

export interface MockRider {
  riderId: string
  name: string
  phone: string
  photoUrl: string | null   // null = show initials avatar
  vehicleNumber: string
  vehicleType: string
  rating: number
  totalDeliveries: number
  status: RiderStatus
  currentLocation: { lat: number; lng: number }
  currentOrderId: string | null
  lastLocationUpdate?: string
}

// ── Fixed mock kitchen location (Anna Nagar, Coimbatore) ─────────────────────
export const KITCHEN_LOCATION = { lat: 11.0200, lng: 77.0100 }

export const MOCK_RIDERS: MockRider[] = []

// ── Haversine distance (km) ───────────────────────────────────────────────────
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const sin2 =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
    Math.cos((b.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(sin2))
}

// ETA estimate: assume avg speed 20 km/h in city
export function etaMinutes(distKm: number): number {
  return Math.max(3, Math.round((distKm / 20) * 60))
}
