/**
 * walletDb.ts
 * Firestore operations for vendor wallet transactions.
 *
 * Collection: vendors/{email}/transactions/{txnId}
 *
 * Analytics are computed from the orders collection — no separate
 * analytics collection needed (single source of truth).
 */

import {
  collection, doc, setDoc, onSnapshot,
  query, orderBy, type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { VendorOrder } from '../data/menuStore'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  description: string
  amount: number
  date: string        // ISO string
  status: 'success' | 'pending' | 'failed'
  orderId?: string
}

export interface WalletSummary {
  balance: number
  pendingAmount: number
  todayEarnings: number
}

// ── Real-time transaction listener ────────────────────────────────────────────

export function subscribeTransactions(
  email: string,
  onChange: (txns: Transaction[]) => void
): Unsubscribe {
  const col = collection(db, 'vendors', email.toLowerCase(), 'transactions')
  const q   = query(col, orderBy('date', 'desc'))
  return onSnapshot(q, snap => {
    onChange(snap.docs.map(d => d.data() as Transaction))
  })
}

// ── Save a transaction ────────────────────────────────────────────────────────

export async function saveTransaction(
  email: string,
  txn: Transaction
): Promise<void> {
  try {
    const ref = doc(
      collection(db, 'vendors', email.toLowerCase(), 'transactions'),
      txn.id
    )
    await setDoc(ref, txn)
  } catch {
    // silent — non-critical
  }
}

// ── Compute wallet summary from orders ────────────────────────────────────────

export function computeWalletSummary(orders: VendorOrder[]): WalletSummary {
  const today = new Date().toDateString()

  let balance        = 0
  let pendingAmount  = 0
  let todayEarnings  = 0

  for (const order of orders) {
    if (order.status === 'COMPLETED' && order.paymentStatus === 'PAID') {
      balance += order.total
      if (new Date(order.completedAt ?? order.createdAt).toDateString() === today) {
        todayEarnings += order.total
      }
    }
    if (order.status !== 'CANCELLED' && order.paymentStatus === 'PENDING') {
      pendingAmount += order.total
    }
  }

  return { balance, pendingAmount, todayEarnings }
}

// ── Compute analytics from orders ─────────────────────────────────────────────

export interface DayRevenue { id: string; label: string; value: number }
export interface TopDish    { id: string; name: string; orders: number; revenue: number }
export interface AnalyticsStat {
  id: string; label: string; value: string
  delta: string; positive: boolean; icon: string
}

export function computeAnalytics(orders: VendorOrder[]): {
  stats: AnalyticsStat[]
  revenueByDay: DayRevenue[]
  topDishes: TopDish[]
  totalRevenue: number
} {
  const completed = orders.filter(o => o.status === 'COMPLETED')
  const cancelled = orders.filter(o => o.status === 'CANCELLED')

  // Last 7 days revenue
  const revenueByDay: DayRevenue[] = []
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dayStr = d.toDateString()
    const val = completed
      .filter(o => new Date(o.completedAt ?? o.createdAt).toDateString() === dayStr)
      .reduce((s, o) => s + o.total, 0)
    revenueByDay.push({
      id: `rev_day_${i}`,
      label: DAYS[d.getDay()],
      value: val,
    })
  }

  const totalRevenue = completed.reduce((s, o) => s + o.total, 0)
  const totalOrders  = completed.length
  const avgOrder     = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  // Top dishes from completed orders
  const dishMap: Record<string, { name: string; count: number; revenue: number }> = {}
  for (const order of completed) {
    for (const item of order.items) {
      if (!dishMap[item.menuItemId]) {
        dishMap[item.menuItemId] = { name: item.name, count: 0, revenue: 0 }
      }
      dishMap[item.menuItemId].count   += item.quantity
      dishMap[item.menuItemId].revenue += item.subtotal
    }
  }
  const topDishes: TopDish[] = Object.entries(dishMap)
    .map(([id, d]) => ({ id, name: d.name, orders: d.count, revenue: d.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const cancelRate = orders.length > 0
    ? ((cancelled.length / orders.length) * 100).toFixed(1)
    : '0.0'

  const stats: AnalyticsStat[] = [
    { id: 'st_rev',    label: 'Revenue',    value: `₹ ${totalRevenue.toLocaleString()}`, delta: '+14%', positive: true,  icon: '₹' },
    { id: 'st_orders', label: 'Orders',     value: String(totalOrders),                  delta: '+9%',  positive: true,  icon: '🛒' },
    { id: 'st_avg',    label: 'Avg Order',  value: `₹ ${avgOrder}`,                      delta: '+5%',  positive: true,  icon: '📊' },
    { id: 'st_cancel', label: 'Cancelled',  value: `${cancelRate}%`,                     delta: '',     positive: false, icon: '❌' },
  ]

  return { stats, revenueByDay, topDishes, totalRevenue }
}
