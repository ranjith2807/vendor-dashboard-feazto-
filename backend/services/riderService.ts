/**
 * riderService.ts
 * Firestore operations for FEZU riders and delivery history.
 *
 * Rider collection:          riders/{riderId}
 * Delivery history:          vendors/{email}/delivery_history/{entryId}
 *
 * History entries are written automatically when a delivery completes —
 * there is no seeding or static data.
 */

import {
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy, limit,
  type Unsubscribe, type DocumentData,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { MockRider } from '../../frontend/src/data/mockRiders'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DeliveryHistoryEntry {
  id: string
  orderId: string
  customerName: string
  riderName: string
  amount: number
  status: 'delivered' | 'cancelled'
  time: string        // formatted display time e.g. "9:12 AM"
  duration: string    // formatted display duration e.g. "18 min" or "—"
  createdAt: string   // ISO timestamp for sorting
}

const ridersCol = collection(db, 'riders')
const historyCol = (email: string) =>
  collection(db, 'vendors', email.toLowerCase(), 'delivery_history')

// ── Clear all riders from Firestore (removes stale seeded data) ──────────────

export async function clearAllRiders(): Promise<void> {
  try {
    const snap = await getDocs(ridersCol)
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))
  } catch {
    // Non-fatal
  }
}

// ── Subscribe to all riders (real-time) ──────────────────────────────────────

export function subscribeAllRiders(
  onChange: (riders: MockRider[]) => void,
): Unsubscribe {
  return onSnapshot(ridersCol, snap => {
    const riders = snap.docs.map(d => d.data() as MockRider)
    onChange(riders)   // always update — empty array clears the UI
  })
}

// ── Subscribe to online riders only ──────────────────────────────────────────

export function subscribeOnlineRiders(
  onChange: (riders: MockRider[]) => void,
): Unsubscribe {
  const q = query(ridersCol, where('status', '==', 'online'))
  return onSnapshot(q, snap => {
    onChange(snap.docs.map(d => d.data() as MockRider))
  })
}

// ── Update a rider's status / location ───────────────────────────────────────

export async function updateRiderStatus(
  riderId: string,
  updates: Partial<Pick<MockRider, 'status' | 'currentLocation' | 'currentOrderId'>>
): Promise<void> {
  try {
    const ref = doc(ridersCol, riderId)
    await updateDoc(ref, {
      ...(updates as DocumentData),
      lastLocationUpdate: new Date().toISOString(),
    })
  } catch {
    // swallow — local state already updated
  }
}

// ── Delivery history — real-time listener ─────────────────────────────────────

export function subscribeDeliveryHistory(
  email: string,
  onChange: (entries: DeliveryHistoryEntry[]) => void,
  maxEntries = 100,
): Unsubscribe {
  const q = query(
    historyCol(email),
    orderBy('createdAt', 'desc'),
    limit(maxEntries),
  )
  return onSnapshot(q, snap => {
    onChange(snap.docs.map(d => d.data() as DeliveryHistoryEntry))
  })
}

// ── Write a single history entry (called on DELIVERED or CANCELLED) ───────────

export async function addDeliveryHistoryEntry(
  email: string,
  entry: DeliveryHistoryEntry,
): Promise<void> {
  try {
    await setDoc(doc(historyCol(email), entry.id), entry)
  } catch {
    // swallow — not critical
  }
}
