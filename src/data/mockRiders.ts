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
}

// ── Fixed mock kitchen location (Anna Nagar, Coimbatore) ─────────────────────
export const KITCHEN_LOCATION = { lat: 11.0200, lng: 77.0100 }

export const MOCK_RIDERS: MockRider[] = [
  {
    riderId: 'rider_001',
    name: 'Muthu Kumar',
    phone: '+91 98001 11001',
    photoUrl: null,
    vehicleNumber: 'TN 33 AB 1234',
    vehicleType: 'Scooter',
    rating: 4.9,
    totalDeliveries: 1842,
    status: 'online',
    currentLocation: { lat: 11.0215, lng: 77.0118 },
    currentOrderId: null,
  },
  {
    riderId: 'rider_002',
    name: 'Selvam R.',
    phone: '+91 98001 11002',
    photoUrl: null,
    vehicleNumber: 'TN 33 CD 5678',
    vehicleType: 'Bike',
    rating: 4.7,
    totalDeliveries: 983,
    status: 'busy',
    currentLocation: { lat: 11.0255, lng: 77.0080 },
    currentOrderId: 'vord_ext_01',
  },
  {
    riderId: 'rider_003',
    name: 'Karthik P.',
    phone: '+91 98001 11003',
    photoUrl: null,
    vehicleNumber: 'TN 33 EF 9012',
    vehicleType: 'Scooter',
    rating: 4.8,
    totalDeliveries: 2211,
    status: 'online',
    currentLocation: { lat: 11.0188, lng: 77.0135 },
    currentOrderId: null,
  },
  {
    riderId: 'rider_004',
    name: 'Ramesh S.',
    phone: '+91 98001 11004',
    photoUrl: null,
    vehicleNumber: '—',
    vehicleType: 'Cycle',
    rating: 4.6,
    totalDeliveries: 678,
    status: 'online',
    currentLocation: { lat: 11.0230, lng: 77.0155 },
    currentOrderId: null,
  },
  {
    riderId: 'rider_005',
    name: 'Vijay M.',
    phone: '+91 98001 11005',
    photoUrl: null,
    vehicleNumber: 'TN 33 GH 3456',
    vehicleType: 'Bike',
    rating: 4.5,
    totalDeliveries: 445,
    status: 'offline',
    currentLocation: { lat: 11.0170, lng: 77.0090 },
    currentOrderId: null,
  },
  {
    riderId: 'rider_006',
    name: 'Anand T.',
    phone: '+91 98001 11006',
    photoUrl: null,
    vehicleNumber: 'TN 33 JK 7890',
    vehicleType: 'Scooter',
    rating: 4.3,
    totalDeliveries: 312,
    status: 'online',
    currentLocation: { lat: 11.0195, lng: 77.0072 },
    currentOrderId: null,
  },
]

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
