import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { deliveryHistory } from '../../data/mockData'
import { C, F, shadow } from '../../theme'
import { useFezuStore, DELIVERY_STATUS_META } from '../../context/FezuContext'
import type { MockRider } from '../../data/mockRiders'

const FEZU_TABS = [
  { id: 'ftab_dashboard', label: 'Dashboard' },
  { id: 'ftab_riders',   label: 'Riders' },
  { id: 'ftab_history',  label: 'History' },
]

const STATUS_COLOR = { online: C.green, busy: C.amber, offline: '#999' } as const
const STATUS_LABEL = { online: 'ONLINE', busy: 'BUSY', offline: 'OFFLINE' } as const

export default function FezuScreen({
  setScreen,
  vendorOrders,
}: {
  setScreen: SetScreen
  navParams: NavParams
  vendorOrders: any[]
  setVendorOrders: any
  menuItems: any[]
  setMenuItems: any
}) {
  const [activeTab, setActiveTab] = useState('ftab_dashboard')
  const { riders, allDeliveries } = useFezuStore()

  const onlineCount = riders.filter(r => r.status === 'online').length
  const busyCount   = riders.filter(r => r.status === 'busy').length

  // Orders currently being delivered (have an active delivery entry)
  const activeDeliveries = Object.values(allDeliveries).filter(
    d => d.deliveryStatus !== 'IDLE' && d.deliveryStatus !== 'DELIVERED',
  )

  return (
    <View style={s.root}>
      {/* Yellow header */}
      <View style={s.headerBg}>
        <View style={s.headerContent}>
          <View style={s.mascotCircle}><Text style={{ fontSize: 28 }}>🚴</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>FEZU</Text>
            <Text style={s.headerSub}>Delivery Partner Module · Auto-Assignment</Text>
          </View>
          <View style={s.availBadge}>
            <Text style={s.availText}>{onlineCount} Online</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabsRow}>
        {FEZU_TABS.map(tab => {
          const active = activeTab === tab.id
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[s.tab, active && s.tabActive]}
            >
              <Text style={[s.tabText, active && s.tabTextActive]}>
                {tab.label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>

        {/* ── Dashboard tab ─────────────────────────────────────────────── */}
        {activeTab === 'ftab_dashboard' && (
          <>
            {/* Stats */}
            <View style={s.statsGrid}>
              {[
                { id: 'fs1', label: 'Online',    value: String(onlineCount),          color: C.green,  icon: '🟢' },
                { id: 'fs2', label: 'Busy',      value: String(busyCount),            color: C.amber,  icon: '🔶' },
                { id: 'fs3', label: 'Active',    value: String(activeDeliveries.length), color: C.blue, icon: '🚴' },
                { id: 'fs4', label: 'Delivered', value: String(deliveryHistory.filter(d => d.status === 'delivered').length), color: C.teal, icon: '✅' },
              ].map(stat => (
                <View key={stat.id} style={s.statCard}>
                  <Text style={s.statIcon}>{stat.icon}</Text>
                  <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Auto-assignment info banner */}
            <View style={s.infoBanner}>
              <Text style={{ fontSize: 18, flexShrink: 0 }}>⚡</Text>
              <Text style={s.infoText}>
                FEZU automatically assigns the nearest available rider when an order is marked Ready. No manual action needed.
              </Text>
            </View>

            {/* Active deliveries */}
            <Text style={s.sectionTitle}>Active Deliveries</Text>
            {activeDeliveries.length === 0 ? (
              <View style={s.emptyCard}>
                <Text style={{ fontSize: 32, marginBottom: 6 }}>✅</Text>
                <Text style={s.emptyText}>No active deliveries right now</Text>
              </View>
            ) : (
              activeDeliveries.map(delivery => {
                const meta = DELIVERY_STATUS_META[delivery.deliveryStatus]
                const rider = riders.find(r => r.riderId === delivery.assignedRiderDetails?.riderId)
                return (
                  <View key={delivery.orderId} style={[s.deliveryCard, { borderLeftColor: meta.color, borderLeftWidth: 4 }]}>
                    <View style={s.deliveryHeader}>
                      <Text style={s.deliveryOrderId}>Order #{delivery.orderId.replace('vord_', '')}</Text>
                      <View style={[s.deliveryStatusChip, { backgroundColor: meta.bg }]}>
                        <Text style={[s.deliveryStatusText, { color: meta.color }]}>
                          {meta.icon} {meta.label}
                        </Text>
                      </View>
                    </View>
                    {delivery.assignedRiderDetails && (
                      <View style={s.deliveryRiderRow}>
                        <RiderInitialsAvatar name={delivery.assignedRiderDetails.name} size={32} />
                        <Text style={s.deliveryRiderName}>{delivery.assignedRiderDetails.name}</Text>
                        <Text style={s.deliveryEta}>
                          {delivery.assignedRiderDetails.distanceKm}km · {delivery.assignedRiderDetails.etaMinutes}m ETA
                        </Text>
                      </View>
                    )}
                  </View>
                )
              })
            )}
          </>
        )}

        {/* ── Riders tab ────────────────────────────────────────────────── */}
        {activeTab === 'ftab_riders' && (
          <>
            <Text style={s.sectionTitle}>All Riders</Text>
            {riders.map(rider => (
              <RiderCard
                key={rider.riderId}
                rider={rider}
                currentDelivery={
                  rider.currentOrderId
                    ? allDeliveries[rider.currentOrderId] ?? null
                    : null
                }
                onPress={() => setScreen('fezu_rider_detail', { id: rider.riderId })}
              />
            ))}
          </>
        )}

        {/* ── History tab ───────────────────────────────────────────────── */}
        {activeTab === 'ftab_history' && (
          <>
            <Text style={s.sectionTitle}>Delivery History</Text>
            {deliveryHistory.map(del => (
              <View key={del.id} style={s.histCard}>
                <View style={s.histHeader}>
                  <Text style={s.histOrderId}>{del.orderId}</Text>
                  <View style={[s.histBadge, { backgroundColor: del.status === 'delivered' ? C.green : C.red }]}>
                    <Text style={s.histBadgeText}>{del.status.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={s.histMeta}>Customer: {del.customerName} · ₹ {del.amount}</Text>
                <Text style={s.histMeta}>Rider: {del.riderName} · {del.time} · {del.duration}</Text>
              </View>
            ))}
          </>
        )}

      </ScrollView>
    </View>
  )
}

// ── RiderCard ─────────────────────────────────────────────────────────────────

function RiderCard({
  rider,
  currentDelivery,
  onPress,
}: {
  rider: MockRider
  currentDelivery: any | null
  onPress: () => void
}) {
  const sc = STATUS_COLOR[rider.status]
  const delivMeta = currentDelivery
    ? DELIVERY_STATUS_META[currentDelivery.deliveryStatus]
    : null

  return (
    <TouchableOpacity style={s.riderCard} onPress={onPress} activeOpacity={0.85}>
      <View style={s.riderRow}>
        <RiderInitialsAvatar name={rider.name} size={46} bg={sc} />
        <View style={{ flex: 1 }}>
          <View style={s.riderNameRow}>
            <Text style={s.riderName}>{rider.name}</Text>
            <View style={[s.statusBadge, { backgroundColor: sc }]}>
              <Text style={s.statusBadgeText}>{STATUS_LABEL[rider.status]}</Text>
            </View>
          </View>
          <Text style={s.riderMeta}>★ {rider.rating} · {rider.totalDeliveries.toLocaleString()} trips · {rider.vehicleType}</Text>
          <Text style={s.riderVehicle}>{rider.vehicleNumber}</Text>
        </View>
        <Text style={s.riderChevron}>›</Text>
      </View>

      {/* Current assignment badge for busy riders */}
      {rider.status === 'busy' && currentDelivery && delivMeta && (
        <View style={[s.busyBadge, { backgroundColor: delivMeta.bg }]}>
          <Text style={[s.busyBadgeText, { color: delivMeta.color }]}>
            {delivMeta.icon} {delivMeta.label} · Order #{currentDelivery.orderId.replace('vord_', '')}
          </Text>
        </View>
      )}

      {rider.status === 'busy' && !currentDelivery && (
        <View style={[s.busyBadge, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[s.busyBadgeText, { color: C.amber }]}>🔶 On delivery</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

// ── Initials avatar helper ────────────────────────────────────────────────────

function RiderInitialsAvatar({ name, size, bg }: { name: string; size: number; bg?: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: bg ?? C.yellow,
      alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Text style={{ fontFamily: F.barlow, fontSize: size * 0.38, color: C.white }}>
        {initials}
      </Text>
    </View>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },

  headerBg: { backgroundColor: C.yellow, paddingHorizontal: 20, paddingVertical: 14 },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mascotCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.black, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: F.barlow, fontSize: 28, color: C.black, lineHeight: 30 },
  headerSub: { fontFamily: F.inter, fontSize: 10, color: C.black, opacity: 0.7 },
  availBadge: { backgroundColor: C.black, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  availText: { fontFamily: F.barlow, fontSize: 12, color: C.yellow },

  tabsRow: { flexDirection: 'row', gap: 7, padding: 12, paddingBottom: 10 },
  tab: { flex: 1, backgroundColor: C.white, borderRadius: 20, paddingVertical: 8, alignItems: 'center', borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000' },
  tabActive: { backgroundColor: C.yellow, borderWidth: 2, borderColor: '#000', ...shadow(3, 3) },
  tabText: { fontFamily: F.barlow, fontSize: 11, color: C.black },
  tabTextActive: { color: C.black },

  body: { paddingHorizontal: 20, paddingBottom: 24, gap: 10 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%', backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 12 },
  statIcon: { fontSize: 20, marginBottom: 2 },
  statValue: { fontFamily: F.barlow, fontSize: 24, lineHeight: 28 },
  statLabel: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },

  infoBanner: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#DBEAFE', borderRadius: 12, padding: 12 },
  infoText: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.75, lineHeight: 18, flex: 1 },

  sectionTitle: { fontFamily: F.barlow, fontSize: 18, color: C.black },

  emptyCard: { backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(3, 3), padding: 20, alignItems: 'center' },
  emptyText: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.5 },

  deliveryCard: { backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(3, 3), padding: 12 },
  deliveryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  deliveryOrderId: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  deliveryStatusChip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  deliveryStatusText: { fontFamily: F.barlow, fontSize: 11 },
  deliveryRiderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deliveryRiderName: { fontFamily: F.interBold, fontSize: 13, color: C.black, flex: 1 },
  deliveryEta: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.55 },

  riderCard: { backgroundColor: C.white, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 12 },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  riderNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  riderName: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  statusBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  statusBadgeText: { fontFamily: F.interBold, fontSize: 9, color: C.white, letterSpacing: 0.5 },
  riderMeta: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  riderVehicle: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.4 },
  riderChevron: { fontFamily: F.barlow, fontSize: 24, color: C.black, opacity: 0.3 },
  busyBadge: { marginTop: 8, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  busyBadgeText: { fontFamily: F.interBold, fontSize: 11 },

  histCard: { backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(3, 3), padding: 12 },
  histHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  histOrderId: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  histBadge: { borderRadius: 5, paddingHorizontal: 8, paddingVertical: 1 },
  histBadgeText: { fontFamily: F.barlow, fontSize: 11, color: C.white },
  histMeta: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.65 },
})
