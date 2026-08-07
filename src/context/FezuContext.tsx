/**
 * FezuContext — FEZU automatic rider assignment store.
 *
 * Frontend-only mock implementation. All logic lives here.
 * To wire a real backend: replace the internals of each function
 * while keeping the same hook shape — components won't need changes.
 *
 * Public API (useFezuStore):
 *   riders              — live rider list with jittered locations
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
  allDeliveries: Record<string, DeliveryEntry>
  getOrderDelivery: (orderId: string) => DeliveryEntry
  triggerAssignment: (orderId: string) => void
  retryAssignment: (orderId: string) => void
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
  allDeliveries: {},
  getOrderDelivery: () => IDLE_ENTRY,
  triggerAssignment: () => {},
  retryAssignment: () => {},
})

export function FezuProvider({ children }: { children: React.ReactNode }) {
  const [riders, setRiders] = useState<MockRider[]>(MOCK_RIDERS)
  const [deliveries, setDeliveries] = useState<Record<string, DeliveryEntry>>({})
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>[]>>({})

  // ── Location jitter — moves all online riders slightly every 4s ──────────
  useEffect(() => {
    const id = setInterval(() => {
      setRiders(prev => prev.map(r => {
        if (r.status === 'offline') return r
        return {
          ...r,
          currentLocation: {
            lat: r.currentLocation.lat + (Math.random() - 0.5) * 0.0008,
            lng: r.currentLocation.lng + (Math.random() - 0.5) * 0.0008,
          },
        }
      }))
    }, 4_000)
    return () => clearInterval(id)
  }, [])

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
        // Find nearest online rider
        const available = currentRiders.filter(r => r.status === 'online' && !r.currentOrderId)

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

            // On DELIVERED, release rider
            if (status === 'DELIVERED') {
              setRiders(r => r.map(rx =>
                rx.riderId === nearest.riderId
                  ? { ...rx, status: 'online' as const, currentOrderId: null }
                  : rx,
              ))
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
      allDeliveries: deliveries,
      getOrderDelivery,
      triggerAssignment,
      retryAssignment,
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
