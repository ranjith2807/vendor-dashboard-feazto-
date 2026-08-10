/**
 * menuStore.ts
 * Central local data store for menu items and vendor orders.
 * Replace API_BASE calls when backend is ready.
 */

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface MenuItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUri: string        // https URL or local require()
  isAvailable: boolean
  category: string
  isVeg: boolean
  description: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
  imageUri?: string
}

export type OrderStatus =
  | 'NEW' | 'ACCEPTED' | 'PREPARING'
  | 'READY_FOR_PICKUP' | 'PICKED_UP'
  | 'COMPLETED' | 'CANCELLED'

export type DeliveryStatus =
  | 'SEARCHING_FOR_RIDER'
  | 'RIDER_ASSIGNED'
  | 'RIDER_ARRIVED_AT_KITCHEN'
  | 'PICKED_UP'
  | 'ON_THE_WAY'
  | 'DELIVERED'

export type PaymentStatus = 'PAID' | 'COD' | 'PENDING'

export interface VendorOrder {
  id: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  total: number
  customerName: string
  customerPhone?: string
  address: string
  paymentStatus: PaymentStatus
  rider?: {
    name: string
    phone?: string
    vehicleNumber?: string
    etaMinutes?: number
  }
  deliveryStatus?: DeliveryStatus
  assignedRiderId?: string
  assignedRiderDetails?: {
    riderId?: string
    name: string
    phone?: string
    vehicleNumber?: string
    vehicleType?: string
    photoUrl?: string
    rating?: number
    distanceKm?: number
    etaMinutes?: number
  }
  riderAssignedAt?: string
  notes?: string
  createdAt: string
  acceptedAt?: string
  preparingAt?: string
  readyAt?: string
  pickedUpAt?: string
  completedAt?: string
}

// ─── Default Menu Items ───────────────────────────────────────────────────────

export const DEFAULT_MENU_ITEMS: MenuItem[] = []

// ─── Default Orders ───────────────────────────────────────────────────────────

export const DEFAULT_ORDERS: VendorOrder[] = []

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  NEW:              { label: 'NEW',       color: '#000', bg: '#FFC50A' },
  ACCEPTED:         { label: 'ACCEPTED',  color: '#fff', bg: '#3B82F6' },
  PREPARING:        { label: 'PREPARING', color: '#fff', bg: '#F59E0B' },
  READY_FOR_PICKUP: { label: 'READY',     color: '#fff', bg: '#22C55E' },
  PICKED_UP:        { label: 'PICKED UP', color: '#fff', bg: '#8B5CF6' },
  COMPLETED:        { label: 'COMPLETED', color: '#fff', bg: '#10B981' },
  CANCELLED:        { label: 'CANCELLED', color: '#fff', bg: '#FF3B30' },
}

export const ORDER_STATUS_FLOW: Record<OrderStatus, { action: string; next: OrderStatus } | null> = {
  NEW:              { action: 'Accept Order',    next: 'ACCEPTED' },
  ACCEPTED:         { action: 'Start Preparing', next: 'PREPARING' },
  PREPARING:        { action: 'Mark Ready',      next: 'READY_FOR_PICKUP' },
  READY_FOR_PICKUP: { action: 'Show Pickup QR',  next: 'PICKED_UP' },
  PICKED_UP:        { action: 'Confirm Pickup',  next: 'COMPLETED' },
  COMPLETED:        null,
  CANCELLED:        null,
}
