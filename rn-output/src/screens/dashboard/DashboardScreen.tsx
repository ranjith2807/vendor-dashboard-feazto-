import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { mockOrders, analyticsStats } from '../../data/mockData'
import { getActiveState, setActiveState } from '../../data/activeStateStore'

const STATUS_COLOR: Record<string, string> = {
  new: '#FFC50A', accepted: '#3B82F6', preparing: '#F59E0B', ready: '#22C55E',
  picked_up: '#8B5CF6', delivered: '#10B981', cancelled: '#FF3B30',
}
const STATUS_LABEL: Record<string, string> = {
  new: 'NEW', accepted: 'ACCEPTED', preparing: 'PREPARING', ready: 'READY',
  picked_up: 'PICKED UP', delivered: 'DELIVERED', cancelled: 'CANCELLED',
}

export default function DashboardScreen({ setScreen }: { setScreen: SetScreen }) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeBtn, setActiveBtn] = useState<string | null>(null)
  const liveOrders = mockOrders.filter(o => !['delivered', 'cancelled'].includes(o.status))

  const handlePress = (btnId: string, action: () => void) => {
    setActiveBtn(btnId)
    setTimeout(() => {
      action()
      setActiveBtn(null)
    }, 150)
  }

  const activeStyle = {
    backgroundColor: '#f9be08',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.kitchenName}>Priya's Kitchen</Text>
        </View>
        <TouchableOpacity
          style={[styles.notifBtn, activeBtn === 'notif' && activeStyle]}
          onPress={() => handlePress('notif', () => setScreen('notifications'))}
        >
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TouchableOpacity
        style={[styles.searchBar, activeBtn === 'search' && activeStyle]}
        onPress={() => handlePress('search', () => setScreen('search'))}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search menu, orders…</Text>
      </TouchableOpacity>

      {/* Kitchen Status Toggle Card */}
      <View
        style={[
          styles.statusCard,
          { borderColor: isOpen ? '#22C55E' : '#FF3B30' },
        ]}
      >
        {/* Animated dot */}
        <View style={[styles.statusDot, { backgroundColor: isOpen ? '#22C55E' : '#FF3B30' }]} />

        {/* Text */}
        <View style={{ flex: 1 }}>
          <Text style={styles.statusTitle}>
            Kitchen is {isOpen ? 'OPEN' : 'CLOSED'}
          </Text>
          <Text style={styles.statusSub}>
            {isOpen ? 'Accepting orders · Tap toggle to close' : 'Not accepting orders · Tap toggle to open'}
          </Text>
        </View>

        {/* Toggle switch button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsOpen(v => !v)}
          style={[styles.toggleTrack, { backgroundColor: isOpen ? '#22C55E' : '#ddd' }]}
        >
          <View style={[styles.toggleThumb, { left: isOpen ? 22 : 2 }]} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {analyticsStats.slice(0, 4).map(stat => (
          <View key={stat.id} style={styles.statCard}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={[styles.statDelta, { color: stat.positive ? '#22C55E' : '#FF3B30' }]}>{stat.delta} this week</Text>
          </View>
        ))}
      </View>

      {/* Live orders */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Live Orders</Text>
        <TouchableOpacity
          style={[styles.seeAllBtn, activeBtn === 'seeAll' && activeStyle]}
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
      ) : liveOrders.map(order => {
        const isCardActive = activeBtn === `order_${order.id}`
        return (
          <TouchableOpacity
            key={order.id}
            style={[styles.orderCard, isCardActive && activeStyle]}
            onPress={() => handlePress(`order_${order.id}`, () => setScreen('order_detail', { id: order.id }))}
          >
            <View style={styles.orderCardTop}>
              <Text style={styles.orderId}>#{order.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[order.status] }]}>
                <Text style={[styles.statusBadgeText, { color: order.status === 'new' ? '#000' : '#fff' }]}>
                  {STATUS_LABEL[order.status]}
                </Text>
              </View>
            </View>
            <Text style={styles.orderCustomer}>{order.customerName} · ₹{order.total}</Text>
            <Text style={styles.orderMeta}>{order.items.length} items · {order.placedAt}</Text>
          </TouchableOpacity>
        )
      })}

      {/* FEZU banner / status card */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.fezuBanner, activeBtn === 'fezuBanner' && activeStyle]}
        onPress={() => handlePress('fezuBanner', () => setScreen('fezu'))}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.fezuTitle}>FEZU Riders Ready</Text>
          <Text style={styles.fezuSub}>3 riders available nearby. Assign instantly!</Text>
          <View style={[styles.fezuBtn, activeBtn === 'openFezu' && activeStyle]}>
            <Text style={styles.fezuBtnText}>OPEN FEZU</Text>
          </View>
        </View>
        <View style={styles.fezuMascot}><Text style={{ fontSize: 44 }}>🚴</Text></View>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 32, gap: 12 },
  activeHighlight: {
    backgroundColor: '#f9be08',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },

  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.5 },
  kitchenName: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 26 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000000',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.10, shadowRadius: 3, elevation: 2,
  },
  notifIcon: { fontSize: 18 },
  badge: {
    position: 'absolute', top: -4, right: -4, width: 14, height: 14,
    borderRadius: 7, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 8, color: '#fff' },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 12,
    padding: 10, paddingHorizontal: 14,
    borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000000',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  searchIcon: { fontSize: 16, opacity: 0.4 },
  searchPlaceholder: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.4 },

  // Status toggle card
  statusCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000000',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#000' },
  statusSub: { fontFamily: 'Inter_400Regular', fontSize: 11, opacity: 0.5, marginTop: 1 },

  // Toggle switch
  toggleTrack: {
    width: 46, height: 26, borderRadius: 13,
    position: 'relative',
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
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  statIcon: { fontSize: 20, marginBottom: 2 },
  statValue: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 22 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, opacity: 0.5 },
  statDelta: { fontFamily: 'Inter_700Bold', fontSize: 10, marginTop: 2 },

  // Orders
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 20 },
  seeAllBtn: {
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3,
    borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000000',
  },
  seeAllText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  emptyOrders: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  emptyOrdersText: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.45 },
  orderCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000000',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  orderCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderId: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 9, paddingVertical: 2 },
  statusBadgeText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 11 },
  orderCustomer: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.7 },
  orderMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, opacity: 0.4, marginTop: 2 },

  // FEZU
  fezuBanner: {
    backgroundColor: '#FFC50A', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  fezuTitle: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 20 },
  fezuSub: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.7, marginBottom: 8, lineHeight: 18 },
  fezuBtn: {
    backgroundColor: '#000', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 7, alignSelf: 'flex-start',
    borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000000',
  },
  fezuBtnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 14, color: '#FFC50A', letterSpacing: 1 },
  fezuMascot: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#000',
    alignItems: 'center', justifyContent: 'center',
  },
})
