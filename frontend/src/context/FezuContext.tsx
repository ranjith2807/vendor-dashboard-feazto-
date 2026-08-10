/**
 * FezuContext — FEZU automatic rider assignment store.
 *
 * Riders and delivery history are loaded from Firestore.
 * Falls back to MOCK_RIDERS if Firestore is unreachable.
 *
 * Public API (useFezuStore):
 *   riders              — live rider list with jittered locations
 *   deliveryHistory     — past deliveries from Firestore
 *   getOrderDelivery    — delivery state for a given orderId
 *   triggerAssignment   — called when order reaches READY_FOR_PICKUP
 *   retryAssignment     — manual retry for "no rider found" case
 *   allDeliveries       — full map of orderId → DeliveryEntry
 */

import React, {
  createContext, useContext, useState,
  useEffect, useRef, useCallback,
} from 'react'
import {
  MOCK_RIDERS, KITCHEN_LOCATION, haversineKm, etaMinutes,
  type MockRider,
} from '../data/mockRiders'
import type { DeliveryStatus } from '../data/menuStore'
import {
  clearAllRiders,
  subscribeAllRiders,
  updateRiderStatus,
  subscribeDeliveryHistory,
  addDeliveryHistoryEntry,
  type DeliveryHistoryEntry,
} from '../../../backend/services/riderService'
import { useVendor } from './VendorContext'
import type { VendorOrder } from '../data/menuStore'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AssignedRiderDetails {
  riderId: string
  name: string
  phone: string
  vehicleNumber: string
  vehicleType: string
  photoUrl: string | null
  rating: number
  distanceKm: number
  etaMinutes: number
}

export interface DeliveryEntry {
  orderId: string
  deliveryStatus: DeliveryStatus | 'NO_RIDER' | 'IDLE'
  assignedRiderDetails: AssignedRiderDetails | null
  riderAssignedAt: string | null
  searchStartedAt: string | null
}

interface FezuContextValue {
  riders: MockRider[]
  deliveryHistory: DeliveryHistoryEntry[]
  allDeliveries: Record<string, DeliveryEntry>
  simulateNoRiders: boolean
  setSimulateNoRiders: (val: boolean | ((prev: boolean) => boolean)) => void
  getOrderDelivery: (orderId: string) => DeliveryEntry
  triggerAssignment: (orderId: string) => void
  retryAssignment: (orderId: string) => void
  /** Call this from App.tsx to keep the context's order reference in sync */
  setVendorOrdersRef: (orders: VendorOrder[]) => void
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const IDLE_ENTRY: DeliveryEntry = {
  orderId: '',
  deliveryStatus: 'IDLE',
  assignedRiderDetails: null,
  riderAssignedAt: null,
  searchStartedAt: null,
}

// ── Delivery progression steps after assignment ───────────────────────────────
// Each step fires after the delay (ms) from the previous one

const PROGRESSION: Array<{ status: DeliveryStatus; delayMs: number }> = [
  { status: 'RIDER_ARRIVED_AT_KITCHEN', delayMs: 8_000  },
  { status: 'PICKED_UP',               delayMs: 6_000  },
  { status: 'ON_THE_WAY',              delayMs: 4_000  },
  { status: 'DELIVERED',               delayMs: 18_000 },
]

// ── Context ───────────────────────────────────────────────────────────────────

const FezuContext = createContext<FezuContextValue>({
  riders: MOCK_RIDERS,
  deliveryHistory: [],
  allDeliveries: {},
  simulateNoRiders: false,
  setSimulateNoRiders: () => {},
  getOrderDelivery: () => IDLE_ENTRY,
  triggerAssignment: () => {},
  retryAssignment: () => {},
  setVendorOrdersRef: () => {},
})

export function FezuProvider({ children }: { children: React.ReactNode }) {
  const [riders, setRiders] = useState<MockRider[]>(MOCK_RIDERS)
  const [deliveries, setDeliveries] = useState<Record<string, DeliveryEntry>>({})
  const [deliveryHistory, setDeliveryHistory] = useState<DeliveryHistoryEntry[]>([])
  const [simulateNoRiders, setSimulateNoRiders] = useState<boolean>(false)
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>[]>>({})
  const { vendor } = useVendor()
  const email = vendor?.email ?? ''

  // Ref to latest vendorOrders — updated by App.tsx via setVendorOrdersRef
  const vendorOrdersRef = useRef<VendorOrder[]>([])
  const setVendorOrdersRef = useCallback((orders: VendorOrder[]) => {
    vendorOrdersRef.current = orders
  }, [])

  // ── Clear stale Firestore riders & subscribe on mount ────────────────────
  useEffect(() => {
    clearAllRiders()   // wipes any old seeded documents from Firestore
    const unsub = subscribeAllRiders(liveRiders => {
      setRiders(liveRiders)
    })
    return unsub
  }, [])

  // ── Subscribe to delivery history once vendor email is known ──────────────
  useEffect(() => {
    if (!email) return
    const unsub = subscribeDeliveryHistory(email, entries => {
      setDeliveryHistory(entries)
    })
    return unsub
  }, [email])

  // ── Core assignment logic ─────────────────────────────────────────────────

  const runAssignment = useCallback((orderId: string) => {
    // Mark as searching
    setDeliveries(prev => ({
      ...prev,
      [orderId]: {
        orderId,
        deliveryStatus: 'SEARCHING_FOR_RIDER',
        assignedRiderDetails: null,
        riderAssignedAt: null,
        searchStartedAt: new Date().toISOString(),
      },
    }))

    // Simulate search delay (2–3.5s)
    const searchDelay = 2000 + Math.random() * 1500

    const searchTimer = setTimeout(() => {
      setRiders(currentRiders => {
        // If simulateNoRiders flag is ON, simulate no available rider
        const available = simulateNoRiders
          ? []
          : currentRiders.filter(r => r.status === 'online' && !r.currentOrderId)

        if (available.length === 0) {
          // No rider available
          setDeliveries(prev => ({
            ...prev,
            [orderId]: {
              ...prev[orderId],
              deliveryStatus: 'NO_RIDER',
            },
          }))
          return currentRiders
        }

        // Sort by Haversine distance to kitchen
        const sorted = [...available].sort((a, b) =>
          haversineKm(a.currentLocation, KITCHEN_LOCATION) -
          haversineKm(b.currentLocation, KITCHEN_LOCATION),
        )
        const nearest = sorted[0]
        const distKm  = haversineKm(nearest.currentLocation, KITCHEN_LOCATION)
        const eta     = etaMinutes(distKm)

        const details: AssignedRiderDetails = {
          riderId:       nearest.riderId,
          name:          nearest.name,
          phone:         nearest.phone,
          vehicleNumber: nearest.vehicleNumber,
          vehicleType:   nearest.vehicleType,
          photoUrl:      nearest.photoUrl,
          rating:        nearest.rating,
          distanceKm:    Math.round(distKm * 10) / 10,
          etaMinutes:    eta,
        }

        setDeliveries(prev => ({
          ...prev,
          [orderId]: {
            orderId,
            deliveryStatus: 'RIDER_ASSIGNED',
            assignedRiderDetails: details,
            riderAssignedAt: new Date().toISOString(),
            searchStartedAt: prev[orderId]?.searchStartedAt ?? null,
          },
        }))

        // Mark rider as busy
        const updatedRiders = currentRiders.map(r =>
          r.riderId === nearest.riderId
            ? { ...r, status: 'busy' as const, currentOrderId: orderId }
            : r,
        )

        // Sync rider status to Firestore
        updateRiderStatus(nearest.riderId, { status: 'busy', currentOrderId: orderId })

        // Schedule delivery progression
        let cumulative = 0
        const orderTimers: ReturnType<typeof setTimeout>[] = []

        PROGRESSION.forEach(({ status, delayMs }) => {
          cumulative += delayMs
          const t = setTimeout(() => {
            setDeliveries(prev => {
              const entry = prev[orderId]
              if (!entry || entry.deliveryStatus === 'IDLE') return prev
              return { ...prev, [orderId]: { ...entry, deliveryStatus: status } }
            })

            // On DELIVERED, release rider and write history entry
            if (status === 'DELIVERED') {
              setRiders(r => r.map(rx =>
                rx.riderId === nearest.riderId
                  ? { ...rx, status: 'online' as const, currentOrderId: null }
                  : rx,
              ))
              // Sync release back to Firestore
              updateRiderStatus(nearest.riderId, { status: 'online', currentOrderId: null })

              // Write real delivery history entry from actual order data
              if (email) {
                const order = vendorOrdersRef.current.find(o => o.id === orderId)
                const now = new Date()
                const historyEntry: DeliveryHistoryEntry = {
                  id: `del_${orderId}_${now.getTime()}`,
                  orderId,
                  customerName: order?.customerName ?? 'Customer',
                  riderName: nearest.name,
                  amount: order?.total ?? 0,
                  status: 'delivered',
                  time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                  duration: `${Math.round((PROGRESSION.reduce((s, p) => s + p.delayMs, 0)) / 60000)} min`,
                  createdAt: now.toISOString(),
                }
                addDeliveryHistoryEntry(email, historyEntry)
              }
            }
          }, cumulative)
          orderTimers.push(t)
        })

        timersRef.current[orderId] = orderTimers
        return updatedRiders
      })
    }, searchDelay)

    // Track search timer too so we can clear on retry
    timersRef.current[orderId] = [searchTimer]
  }, [])

  // ── Public: trigger (called when order becomes READY_FOR_PICKUP) ──────────
  const triggerAssignment = useCallback((orderId: string) => {
    setDeliveries(prev => {
      const existing = prev[orderId]
      // Don't re-trigger if already in progress or assigned
      if (existing && existing.deliveryStatus !== 'IDLE' && existing.deliveryStatus !== 'NO_RIDER') {
        return prev
      }
      return prev
    })
    runAssignment(orderId)
  }, [runAssignment])

  // ── Public: retry after NO_RIDER ─────────────────────────────────────────
  const retryAssignment = useCallback((orderId: string) => {
    // Clear any lingering timers
    timersRef.current[orderId]?.forEach(t => clearTimeout(t))
    runAssignment(orderId)
  }, [runAssignment])

  // ── Live ETA update — recalculates distance/ETA from current location ─────
  useEffect(() => {
    const id = setInterval(() => {
      setDeliveries(prev => {
        const updated = { ...prev }
        let changed = false
        for (const [orderId, entry] of Object.entries(updated)) {
          if (entry.deliveryStatus !== 'RIDER_ASSIGNED') continue
          const riderId = entry.assignedRiderDetails?.riderId
          if (!riderId) continue
          const rider = riders.find(r => r.riderId === riderId)
          if (!rider) continue
          const distKm = haversineKm(rider.currentLocation, KITCHEN_LOCATION)
          const eta    = etaMinutes(distKm)
          const rounded = Math.round(distKm * 10) / 10
          if (
            rounded !== entry.assignedRiderDetails!.distanceKm ||
            eta     !== entry.assignedRiderDetails!.etaMinutes
          ) {
            updated[orderId] = {
              ...entry,
              assignedRiderDetails: {
                ...entry.assignedRiderDetails!,
                distanceKm: rounded,
                etaMinutes: eta,
              },
            }
            changed = true
          }
        }
        return changed ? updated : prev
      })
    }, 4_500)
    return () => clearInterval(id)
  }, [riders])

  const getOrderDelivery = useCallback(
    (orderId: string): DeliveryEntry =>
      deliveries[orderId] ?? { ...IDLE_ENTRY, orderId },
    [deliveries],
  )

  return (
    <FezuContext.Provider value={{
      riders,
      deliveryHistory,
      allDeliveries: deliveries,
      simulateNoRiders,
      setSimulateNoRiders,
      getOrderDelivery,
      triggerAssignment,
      retryAssignment,
      setVendorOrdersRef,
    }}>
      {children}
    </FezuContext.Provider>
  )
}

export const useFezuStore = () => useContext(FezuContext)

// ── Delivery status display helpers ──────────────────────────────────────────

export const DELIVERY_STATUS_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  IDLE:                   { label: 'Not dispatched',       color: '#6B7280', bg: '#F3F4F6', icon: '⏳' },
  SEARCHING_FOR_RIDER:    { label: 'Finding rider…',       color: '#F59E0B', bg: '#FEF3C7', icon: '🔍' },
  NO_RIDER:               { label: 'No rider available',   color: '#FF3B30', bg: '#FEE2E2', icon: '⚠️' },
  RIDER_ASSIGNED:         { label: 'Rider on the way',     color: '#3B82F6', bg: '#DBEAFE', icon: '🚴' },
  RIDER_ARRIVED_AT_KITCHEN:{ label: 'Arrived at kitchen',  color: '#8B5CF6', bg: '#EDE9FE', icon: '📍' },
  PICKED_UP:              { label: 'Order picked up',      color: '#F59E0B', bg: '#FEF3C7', icon: '📦' },
  ON_THE_WAY:             { label: 'On the way',           color: '#10B981', bg: '#D1FAE5', icon: '🛵' },
  DELIVERED:              { label: 'Delivered',            color: '#22C55E', bg: '#DCFCE7', icon: '✅' },
}
