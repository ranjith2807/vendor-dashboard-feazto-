/**
 * fezuDb.ts
 * Firestore operations for FEZU riders & automatic assignment (Track A).
 *
 * Firestore collection: `riders`
 * Document structure:
 *   riderId: string
 *   name: string
 *   phone: string
 *   photoUrl: string | null
 *   vehicleNumber: string
 *   vehicleType: string
 *   rating: number
 *   status: 'online' | 'offline' | 'busy'
 *   currentLocation: { lat: number; lng: number }
 *   currentOrderId: string | null
 *   lastLocationUpdate: string (ISO string)
 */

import {
  collection,
  doc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../../../backend/firebase/config'
import { haversineKm, etaMinutes, type MockRider } from '../data/mockRiders'
import { updateOrderDeliveryStatus } from './ordersDb'

const ridersCol = collection(db, 'riders')

// ── 1. Subscribe to online & available riders ────────────────────────────────
export function subscribeAvailableRiders(
  onChange: (riders: MockRider[]) => void,
): Unsubscribe {
  const q = query(ridersCol, where('status', '==', 'online'))
  return onSnapshot(q, snap => {
    const list = snap.docs.map(d => d.data() as MockRider)
    onChange(list)
  })
}

// ── 2. Subscribe to all riders (for FEZU dashboard) ──────────────────────────
export function subscribeAllRiders(
  onChange: (riders: MockRider[]) => void,
): Unsubscribe {
  return onSnapshot(ridersCol, snap => {
    const list = snap.docs.map(d => d.data() as MockRider)
    onChange(list)
  })
}

// ── 3. Automatic nearest rider assignment ─────────────────────────────────────
export async function assignNearestRider(
  vendorEmail: string,
  orderId: string,
  kitchenLoc = { lat: 11.0200, lng: 77.0100 },
  maxRadiusKm = 5.0,
): Promise<{ success: boolean; rider?: MockRider; message: string }> {
  try {
    // Query available online riders with no active order
    const q = query(ridersCol, where('status', '==', 'online'))
    const snap = await getDocs(q)
    const available = snap.docs
      .map(d => d.data() as MockRider)
      .filter(r => !r.currentOrderId)

    if (available.length === 0) {
      // No available riders
      await updateOrderDeliveryStatus(vendorEmail, orderId, 'SEARCHING_FOR_RIDER', null)
      return { success: false, message: 'No riders currently available' }
    }

    // Compute Haversine distance and sort nearest first
    const sorted = available
      .map(r => ({
        rider: r,
        distKm: haversineKm(r.currentLocation, kitchenLoc),
      }))
      .filter(item => item.distKm <= maxRadiusKm)
      .sort((a, b) => a.distKm - b.distKm)

    if (sorted.length === 0) {
      await updateOrderDeliveryStatus(vendorEmail, orderId, 'SEARCHING_FOR_RIDER', null)
      return { success: false, message: `No riders found within ${maxRadiusKm} km` }
    }

    const nearest = sorted[0].rider
    const distKm = Math.round(sorted[0].distKm * 10) / 10
    const eta = etaMinutes(distKm)

    // Mark rider as busy in Firestore
    const riderRef = doc(db, 'riders', nearest.riderId)
    await updateDoc(riderRef, {
      status: 'busy',
      currentOrderId: orderId,
      lastLocationUpdate: new Date().toISOString(),
    })

    const assignedDetails = {
      riderId: nearest.riderId,
      name: nearest.name,
      phone: nearest.phone,
      vehicleNumber: nearest.vehicleNumber,
      vehicleType: nearest.vehicleType,
      photoUrl: nearest.photoUrl ?? undefined,
      rating: nearest.rating,
      distanceKm: distKm,
      etaMinutes: eta,
    }

    // Update order in Firestore
    await updateOrderDeliveryStatus(vendorEmail, orderId, 'RIDER_ASSIGNED', assignedDetails)

    return {
      success: true,
      rider: nearest,
      message: `Assigned rider ${nearest.name} (${distKm} km away, ${eta} min ETA)`,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Assignment error'
    return { success: false, message: msg }
  }
}

// ── 4. Release rider on delivery complete / cancellation ────────────────────
export async function releaseRider(riderId: string): Promise<void> {
  try {
    const ref = doc(db, 'riders', riderId)
    await updateDoc(ref, {
      status: 'online',
      currentOrderId: null,
      lastLocationUpdate: new Date().toISOString(),
    })
  } catch {
    // swallow error
  }
}

// ── 5. Subscribe to a specific rider's location / details ────────────────────
export function subscribeRiderForOrder(
  riderId: string,
  onChange: (rider: MockRider | null) => void,
): Unsubscribe {
  const ref = doc(db, 'riders', riderId)
  return onSnapshot(ref, snap => {
    if (snap.exists()) {
      onChange(snap.data() as MockRider)
    } else {
      onChange(null)
    }
  })
}

// ── 6. Update rider location (mock GPS / ticker handler) ──────────────────────
export async function updateRiderLocation(
  riderId: string,
  location: { lat: number; lng: number },
): Promise<void> {
  try {
    const ref = doc(db, 'riders', riderId)
    await updateDoc(ref, {
      currentLocation: location,
      lastLocationUpdate: new Date().toISOString(),
    })
  } catch {
    // swallow error
  }
}
