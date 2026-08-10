import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { type VendorOrder } from '../../data/menuStore'
import { notificationItems } from '../../data/mockData'
import { useVendor } from '../../context/VendorContext'
import { subscribeOrders } from '../../../../backend/services/ordersService'

// ── Status display config ─────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  NEW: '#FFC50A', ACCEPTED: '#3B82F6', PREPARING: '#F59E0B',
  READY_FOR_PICKUP: '#22C55E', PICKED_UP: '#8B5CF6',
  COMPLETED: '#10B981', CANCELLED: '#FF3B30',
}
const STATUS_LABEL: Record<string, string> = {
  NEW: 'NEW', ACCEPTED: 'ACCEPTED', PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY', PICKED_UP: 'PICKED UP',
  COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED',
}

// ── Greeting by time of day ───────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning 👋'
  if (h < 17) return 'Good afternoon 👋'
  return 'Good evening 👋'
}

// ── Compute dashboard stats from orders ──────────────────────────────────────

interface DashStats {
  todayRevenue: number
  todayOrders: number
  liveCount: number
  cancelledToday: number
}

function computeStats(orders: VendorOrder[]): DashStats {
  const today = new Date().toDateString()

  let todayRevenue = 0
  let todayOrders = 0
  let cancelledToday = 0

  const liveCount = orders.filter(
    o => !['COMPLETED', 'CANCELLED'].includes(o.status),
  ).length

  for (const o of orders) {
    const orderDay = new Date(o.createdAt).toDateString()
    if (orderDay !== today) continue

    if (o.status === 'COMPLETED') {
      todayRevenue += o.total
      todayOrders++
    }
    if (o.status === 'CANCELLED') cancelledToday++
  }

  return { todayRevenue, todayOrders, liveCount, cancelledToday }
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function DashboardScreen({ setScreen }: { setScreen: SetScreen }) {
  const { vendor } = useVendor()
  const kitchenName = vendor?.company_name ?? 'My Kitchen'
  const unreadCount = notificationItems.filter(n => !n.read).length
  const email = vendor?.email ?? ''

  const [isOpen, setIsOpen] = useState(true)
  const [activeBtn, setActiveBtn] = useState<string | null>(null)
  const [allOrders, setAllOrders] = useState<VendorOrder[]>([])

  // ── Live Firestore subscription ───────────────────────────────────────────
  useEffect(() => {
    if (!email) return
    const unsub = subscribeOrders(email, orders => setAllOrders(orders))
    return unsub
  }, [email])

  // ── Derived state ─────────────────────────────────────────────────────────
  const liveOrders = useMemo(
    () => allOrders.filter(o => !['COMPLETED', 'CANCELLED'].includes(o.status)),
    [allOrders],
  )

  const stats = useMemo(() => computeStats(allOrders), [allOrders])

  // ── Press feedback helper ─────────────────────────────────────────────────
  const handlePress = (btnId: string, action: () => void) => {
    setActiveBtn(btnId)
    setTimeout(() => {
      action()
      setActiveBtn(null)
    }, 150)
  }

  const pressed = (id: string) => activeBtn === id

  // ── Quick stats tiles ─────────────────────────────────────────────────────
  const statTiles = [
    {
      id: 'st_rev',
      icon: '₹',
      value: `₹ ${stats.todayRevenue.toLocaleString('en-IN')}`,
      label: "Today's Revenue",
      delta: stats.todayOrders > 0 ? `${stats.todayOrders} orders` : 'No orders yet',
      positive: true,
    },
    {
      id: 'st_live',
      icon: '🔴',
      value: String(stats.liveCount),
      label: 'Live Orders',
      delta: stats.liveCount > 0 ? 'Needs attention' : 'All clear',
      positive: stats.liveCount === 0,
    },
    {
      id: 'st_done',
      icon: '✅',
      value: String(stats.todayOrders),
      label: 'Completed Today',
      delta: 'Delivered',
      positive: true,
    },
    {
      id: 'st_cancel',
      icon: '❌',
      value: String(stats.cancelledToday),
      label: 'Cancelled Today',
      delta: stats.cancelledToday === 0 ? 'None 🎉' : 'Today',
      positive: stats.cancelledToday === 0,
    },
  ]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.kitchenName}>{kitchenName}</Text>
        </View>
        <TouchableOpacity
          style={[styles.notifBtn, pressed('notif') && styles.pressedCard]}
          onPress={() => handlePress('notif', () => setScreen('notifications'))}
        >
          <Text style={styles.notifIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Search bar ─────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={[styles.searchBar, pressed('search') && styles.pressedCard]}
        onPress={() => handlePress('search', () => setScreen('search'))}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search menu, orders…</Text>
      </TouchableOpacity>

      {/* ── Kitchen open/closed toggle ─────────────────────────────────── */}
      <View style={[styles.statusCard, { borderColor: isOpen ? '#22C55E' : '#FF3B30' }]}>
        <View style={[styles.statusDot, { backgroundColor: isOpen ? '#22C55E' : '#FF3B30' }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.statusTitle}>
            Kitchen is {isOpen ? 'OPEN' : 'CLOSED'}
          </Text>
          <Text style={styles.statusSub}>
            {isOpen ? 'Accepting orders · tap to close' : 'Not accepting orders · tap to open'}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsOpen(v => !v)}
          style={[styles.toggleTrack, { backgroundColor: isOpen ? '#22C55E' : '#E5E7EB' }]}
        >
          <View style={[styles.toggleThumb, { left: isOpen ? 22 : 2 }]} />
        </TouchableOpacity>
      </View>

      {/* ── Stats grid — live from Firestore ───────────────────────────── */}
      <View style={styles.statsGrid}>
        {statTiles.map(tile => (
          <View key={tile.id} style={styles.statCard}>
            <Text style={styles.statIcon}>{tile.icon}</Text>
            <Text style={styles.statValue}>{tile.value}</Text>
            <Text style={styles.statLabel}>{tile.label}</Text>
            <Text style={[styles.statDelta, { color: tile.positive ? '#22C55E' : '#FF3B30' }]}>
              {tile.delta}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Quick actions ──────────────────────────────────────────────── */}
      <View style={styles.quickRow}>
        {[
          { id: 'qa_orders',  icon: '📦', label: 'Orders',   screen: 'orders'  as const },
          { id: 'qa_menu',    icon: '📖', label: 'Menu',     screen: 'menu'    as const },
          { id: 'qa_wallet',  icon: '💰', label: 'Wallet',   screen: 'wallet'  as const },
          { id: 'qa_reviews', icon: '⭐', label: 'Reviews',  screen: 'reviews' as const },
        ].map(qa => (
          <TouchableOpacity
            key={qa.id}
            style={[styles.quickCard, pressed(qa.id) && styles.pressedCard]}
            onPress={() => handlePress(qa.id, () => setScreen(qa.screen))}
          >
            <Text style={styles.quickIcon}>{qa.icon}</Text>
            <Text style={styles.quickLabel}>{qa.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Live orders ───────────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Live Orders</Text>
        <TouchableOpacity
          style={[styles.seeAllBtn, pressed('seeAll') && styles.pressedCard]}
          onPress={() => handlePress('seeAll', () => setScreen('orders'))}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {liveOrders.length === 0 ? (
        <View style={styles.emptyOrders}>
          <Text style={{ fontSize: 32, marginBottom: 6 }}>✅</Text>
          <Text style={styles.emptyOrdersText}>No live orders right now</Text>
        </View>
      ) : (
        liveOrders.map(order => (
          <TouchableOpacity
            key={order.id}
            style={[styles.orderCard, pressed(`ord_${order.id}`) && styles.pressedCard]}
            onPress={() => handlePress(`ord_${order.id}`, () => setScreen('order_detail', { id: order.id }))}
          >
            <View style={styles.orderCardTop}>
              <Text style={styles.orderId}>#{order.orderNumber}</Text>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[order.status] ?? '#ddd' }]}>
                <Text style={[styles.statusText, { color: order.status === 'NEW' ? '#000' : '#fff' }]}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </Text>
              </View>
            </View>
            <Text style={styles.orderCustomer}>{order.customerName} · ₹{order.total}</Text>
            <Text style={styles.orderMeta}>
              {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        ))
      )}

      {/* ── FEZU banner ───────────────────────────────────────────────── */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.fezuBanner, pressed('fezu') && styles.pressedCard]}
        onPress={() => handlePress('fezu', () => setScreen('fezu'))}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.fezuTitle}>FEZU Riders Ready</Text>
          <Text style={styles.fezuSub}>3 riders available nearby. Assign instantly!</Text>
          <View style={styles.fezuBtn}>
            <Text style={styles.fezuBtnText}>OPEN FEZU</Text>
          </View>
        </View>
        <View style={styles.fezuMascot}>
          <Text style={{ fontSize: 44 }}>🚴</Text>
        </View>
      </TouchableOpacity>

    </ScrollView>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1, shadowRadius: 0, elevation: 4,
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 32, gap: 12 },

  pressedCard: {
    backgroundColor: '#f9be08',
    shadowColor: '#000', shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1, shadowRadius: 0, elevation: 2,
  },

  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.5 },
  kitchenName: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 26 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...SHADOW,
  },
  notifIcon: { fontSize: 18 },
  badge: {
    position: 'absolute', top: -4, right: -4, width: 14, height: 14,
    borderRadius: 7, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 8, color: '#fff' },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff',
    borderRadius: 12, padding: 10, paddingHorizontal: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...SHADOW,
  },
  searchIcon: { fontSize: 16, opacity: 0.4 },
  searchPlaceholder: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.4 },

  // Status card
  statusCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff',
    borderRadius: 14, padding: 14, borderWidth: 1.5, ...SHADOW,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  statusSub: { fontFamily: 'Inter_400Regular', fontSize: 11, opacity: 0.5, marginTop: 1 },
  toggleTrack: {
    width: 46, height: 26, borderRadius: 13, position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1,
  },
  toggleThumb: {
    position: 'absolute', top: 2, width: 22, height: 22,
    borderRadius: 11, backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 2,
  },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    width: '47%' as any, backgroundColor: '#fff', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...SHADOW,
  },
  statIcon: { fontSize: 20, marginBottom: 2 },
  statValue: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 22 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, opacity: 0.5 },
  statDelta: { fontFamily: 'Inter_700Bold', fontSize: 10, marginTop: 2 },

  // Quick actions
  quickRow: { flexDirection: 'row', gap: 8 },
  quickCard: {
    flex: 1, backgroundColor: '#FFF8E7', borderRadius: 12, padding: 12,
    alignItems: 'center', gap: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  quickIcon: { fontSize: 22 },
  quickLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5 },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 20 },
  seeAllBtn: {
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3,
    borderWidth: 1, borderColor: '#000',
    shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 2,
  },
  seeAllText: { fontFamily: 'Inter_700Bold', fontSize: 12 },

  // Empty state
  emptyOrders: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...SHADOW,
  },
  emptyOrdersText: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.45 },

  // Order card
  orderCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...SHADOW,
  },
  orderCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderId: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 9, paddingVertical: 2 },
  statusText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 11 },
  orderCustomer: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.7 },
  orderMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, opacity: 0.4, marginTop: 2 },

  // FEZU banner
  fezuBanner: {
    backgroundColor: '#FFC50A', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  fezuTitle: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 20 },
  fezuSub: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.7, marginBottom: 8, lineHeight: 18 },
  fezuBtn: {
    backgroundColor: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 7,
    alignSelf: 'flex-start',
    shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.3, shadowRadius: 0, elevation: 2,
  },
  fezuBtnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 14, color: '#FFC50A', letterSpacing: 1 },
  fezuMascot: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#000',
    alignItems: 'center', justifyContent: 'center',
  },
})
