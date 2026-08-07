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

// ─── Real Food Image URLs (Unsplash — free, no attribution required) ──────────
// Content sourced from Unsplash (unsplash.com) under the Unsplash License

const IMG = {
  idli:       'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80',
  dosa:       'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80',
  masalaDosa: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&q=80',
  upma:       'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&q=80',
  pongal:     'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80',
  vada:       'https://images.unsplash.com/photo-1630409346824-4f0e7b080087?w=400&q=80',
}

// ─── Default Menu Items (Seed Data) ──────────────────────────────────────────

export const DEFAULT_MENU_ITEMS: MenuItem[] = []

// ─── Default Orders (Seed Data) ───────────────────────────────────────────────

export const DEFAULT_ORDERS: VendorOrder[] = [
  {
    id: 'vord_001',
    orderNumber: '1001',
    status: 'NEW',
    items: [
      { menuItemId: 'menu_001', name: 'Idli',  quantity: 2, unitPrice: 10, subtotal: 20, imageUri: IMG.idli },
      { menuItemId: 'menu_006', name: 'Vada',  quantity: 1, unitPrice: 10, subtotal: 10, imageUri: IMG.vada },
    ],
    subtotal: 30, total: 30,
    customerName: 'Arun Kumar', customerPhone: '+91 98765 11111',
    address: 'Cloud Kitchen - Anna Nagar',
    paymentStatus: 'PAID', notes: 'Extra sambar please',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'vord_002',
    orderNumber: '1002',
    status: 'PREPARING',
    items: [
      { menuItemId: 'menu_003', name: 'Masala Dosa', quantity: 1, unitPrice: 30, subtotal: 30, imageUri: IMG.masalaDosa },
      { menuItemId: 'menu_005', name: 'Pongal',      quantity: 1, unitPrice: 30, subtotal: 30, imageUri: IMG.pongal },
    ],
    subtotal: 60, total: 60,
    customerName: 'Preethi S', customerPhone: '+91 98765 22222',
    address: 'Cloud Kitchen - Anna Nagar', paymentStatus: 'PAID',
    createdAt:   new Date(Date.now() - 12 * 60000).toISOString(),
    acceptedAt:  new Date(Date.now() - 10 * 60000).toISOString(),
    preparingAt: new Date(Date.now() -  8 * 60000).toISOString(),
    rider: { name: 'Muthu Kumar', phone: '+91 98765 99999', vehicleNumber: 'TN38 AB 1234', etaMinutes: 5 },
  },
  {
    id: 'vord_003',
    orderNumber: '1003',
    status: 'READY_FOR_PICKUP',
    items: [
      { menuItemId: 'menu_002', name: 'Dosa', quantity: 2, unitPrice: 20, subtotal: 40, imageUri: IMG.dosa },
    ],
    subtotal: 40, total: 40,
    customerName: 'Rajesh M', customerPhone: '+91 98765 33333',
    address: 'Cloud Kitchen - Anna Nagar', paymentStatus: 'COD',
    createdAt:   new Date(Date.now() - 25 * 60000).toISOString(),
    acceptedAt:  new Date(Date.now() - 22 * 60000).toISOString(),
    preparingAt: new Date(Date.now() - 18 * 60000).toISOString(),
    readyAt:     new Date(Date.now() -  3 * 60000).toISOString(),
    rider: { name: 'Muthu Kumar', phone: '+91 98765 99999', vehicleNumber: 'TN38 AB 1234', etaMinutes: 5 },
  },
  {
    id: 'vord_004',
    orderNumber: '1000',
    status: 'COMPLETED',
    items: [
      { menuItemId: 'menu_004', name: 'Upma', quantity: 1, unitPrice: 25, subtotal: 25, imageUri: IMG.upma },
      { menuItemId: 'menu_001', name: 'Idli', quantity: 2, unitPrice: 10, subtotal: 20, imageUri: IMG.idli },
    ],
    subtotal: 45, total: 45,
    customerName: 'Kavitha R', customerPhone: '+91 98765 44444',
    address: 'Cloud Kitchen - Anna Nagar', paymentStatus: 'PAID',
    createdAt:   new Date(Date.now() - 90 * 60000).toISOString(),
    acceptedAt:  new Date(Date.now() - 85 * 60000).toISOString(),
    preparingAt: new Date(Date.now() - 80 * 60000).toISOString(),
    readyAt:     new Date(Date.now() - 65 * 60000).toISOString(),
    pickedUpAt:  new Date(Date.now() - 55 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 50 * 60000).toISOString(),
  },
  {
    id: 'vord_005',
    orderNumber: '999',
    status: 'CANCELLED',
    items: [
      { menuItemId: 'menu_003', name: 'Masala Dosa', quantity: 1, unitPrice: 30, subtotal: 30, imageUri: IMG.masalaDosa },
    ],
    subtotal: 30, total: 30,
    customerName: 'Suresh B', customerPhone: '+91 98765 55555',
    address: 'Cloud Kitchen - Anna Nagar', paymentStatus: 'PENDING',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
]

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
