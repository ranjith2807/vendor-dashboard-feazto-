/**
 * ordersDb.ts
 * Firestore operations for vendor orders.
 *
 * Collection path: vendors/{email}/orders/{orderId}
 *
 * Real-time listener keeps the orders list live — any new order
 * or status change syncs instantly to the UI.
 */

import {
  collection, doc, setDoc, updateDoc,
  onSnapshot, query, orderBy,
  type Unsubscribe, type DocumentData,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { VendorOrder, OrderStatus } from '../../frontend/src/data/menuStore'

const ordersCol = (email: string) =>
  collection(db, 'vendors', email.toLowerCase(), 'orders')

// ── Real-time listener (most important — keeps live orders updated) ───────────

export function subscribeOrders(
  email: string,
  onChange: (orders: VendorOrder[]) => void
): Unsubscribe {
  const q = query(ordersCol(email), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => {
    onChange(snap.docs.map(d => d.data() as VendorOrder))
  })
}

// ── Create a new order ────────────────────────────────────────────────────────

export async function createOrder(
  email: string,
  order: VendorOrder
): Promise<{ success: boolean; message: string }> {
  try {
    const ref = doc(ordersCol(email), order.id)
    await setDoc(ref, order)
    return { success: true, message: 'Order created' }
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Failed' }
  }
}

// ── Update order status ───────────────────────────────────────────────────────

export async function updateOrderStatus(
  email: string,
  orderId: string,
  status: OrderStatus,
  timestamps: Partial<VendorOrder> = {}
): Promise<void> {
  try {
    const ref = doc(ordersCol(email), orderId)
    await updateDoc(ref, {
      status,
      ...timestamps as DocumentData,
    })
  } catch {
    // local state already updated
  }
}
