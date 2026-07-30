import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { mockRiders, deliveryHistory, mockOrders } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

const STATUS_COLOR = { available: C.green, busy: C.amber, offline: '#999' }
const STATUS_LABEL = { available: 'AVAILABLE', busy: 'BUSY', offline: 'OFFLINE' }

const FEZU_TABS = [
  { id: 'ftab_dashboard', label: 'Dashboard' },
  { id: 'ftab_riders', label: 'Assign Rider' },
  { id: 'ftab_history', label: 'History' },
]

export default function FezuScreen({ setScreen }: { setScreen: SetScreen }) {
  const [activeTab, setActiveTab] = useState('ftab_dashboard')
  const [assignedRider, setAssignedRider] = useState<string | null>(null)
  const readyOrders = mockOrders.filter(o => o.status === 'ready')

  return (
    <View style={s.root}>
      {/* Yellow Header */}
      <View style={s.headerBg}>
        <View style={s.headerContent}>
          <View style={s.mascotCircle}><Text style={{ fontSize: 28 }}>🚴</Text></View>
          <View>
            <Text style={s.headerTitle}>FEZU</Text>
            <Text style={s.headerSub}>Delivery Partner Module</Text>
          </View>
          <View style={s.availBadge}><Text style={s.availText}>3 Available</Text></View>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabsRow}>
        {FEZU_TABS.map(tab => {
          const active = activeTab === tab.id
          return (
            <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)} style={[s.tab, active && s.tabActive]}>
              <Text style={[s.tabText, active && s.tabTextActive]}>{tab.label.toUpperCase()}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Dashboard */}
        {activeTab === 'ftab_dashboard' && (
          <>
            <View style={s.statsGrid}>
              {[
                { id: 'fs1', label: 'Success Rate', value: '96.4%', color: C.green, icon: '✓' },
                { id: 'fs2', label: 'Avg Delivery', value: '28 min', color: C.yellow, icon: '🕐' },
                { id: 'fs3', label: 'Today', value: '14', color: C.blue, icon: '🚴' },
                { id: 'fs4', label: 'Late', value: '1', color: C.red, icon: '⚠' },
              ].map(stat => (
                <View key={stat.id} style={s.statCard}>
                  <Text style={s.statIcon}>{stat.icon}</Text>
                  <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <Text style={s.sectionTitle}>Ready for Pickup</Text>
            {readyOrders.length === 0 ? (
              <View style={s.emptyCard}>
                <Text style={{ fontSize: 32, marginBottom: 6 }}>✅</Text>
                <Text style={s.emptyText}>All orders dispatched!</Text>
              </View>
            ) : readyOrders.map(order => (
              <View key={order.id} style={s.readyCard}>
                <View style={s.readyCardHeader}>
                  <View>
                    <Text style={s.orderId}>{order.id}</Text>
                    <Text style={s.orderCustomer}>{order.customerName} · ₹ {order.total}</Text>
                  </View>
                  <View style={s.readyBadge}><Text style={s.readyBadgeText}>READY</Text></View>
                </View>
                <Text style={s.orderAddress}>📍 {order.address}</Text>
                <TouchableOpacity style={s.assignBtn} onPress={() => setActiveTab('ftab_riders')}>
                  <Text style={s.assignBtnText}>ASSIGN FEZU RIDER →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* Assign Rider */}
        {activeTab === 'ftab_riders' && (
          <>
            <Text style={s.sectionTitle}>Nearby Riders</Text>
            {mockRiders.map(rider => {
              const assigned = assignedRider === rider.id
              const sc = STATUS_COLOR[rider.status]
              return (
                <View key={rider.id} style={[s.riderCard, assigned && s.riderCardAssigned]}>
                  <View style={s.riderRow}>
                    <View style={[s.riderAvatar, { backgroundColor: sc }]}>
                      <Text style={s.riderAvatarText}>{rider.name[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={s.riderName}>{rider.name}</Text>
                        <View style={[s.statusBadge, { backgroundColor: sc }]}>
                          <Text style={s.statusBadgeText}>{STATUS_LABEL[rider.status]}</Text>
                        </View>
                      </View>
                      <Text style={s.riderMeta}>★ {rider.rating} · {rider.totalDeliveries.toLocaleString()} deliveries · {rider.distanceKm}km away</Text>
                      <Text style={s.riderVehicle}>{rider.vehicleType} · {rider.vehicleNo}</Text>
                    </View>
                  </View>
                  <View style={s.riderActions}>
                    <TouchableOpacity style={s.callBtn}>
                      <Text style={s.callBtnText}>📞 Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.riderAssignBtn, assigned && s.riderAssignBtnDone, rider.status === 'offline' && s.riderAssignBtnDisabled]}
                      onPress={() => rider.status !== 'offline' && setAssignedRider(assigned ? null : rider.id)}
                      disabled={rider.status === 'offline'}
                    >
                      <Text style={[s.riderAssignBtnText, assigned && { color: C.white }]}>
                        {assigned ? '✓ Assigned' : 'Assign Rider'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })}
          </>
        )}

        {/* History */}
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

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  headerBg: { backgroundColor: C.yellow, paddingHorizontal: 20, paddingVertical: 14 },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mascotCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.black, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: F.barlow, fontSize: 28, color: C.black, lineHeight: 30 },
  headerSub: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.7 },
  availBadge: { marginLeft: 'auto', backgroundColor: C.black, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  availText: { fontFamily: F.barlow, fontSize: 12, color: C.yellow },
  tabsRow: { flexDirection: 'row', gap: 7, padding: 12, paddingBottom: 10, alignItems: 'center' },
  tab: { flex: 1, backgroundColor: C.white, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)' },
  tabActive: { backgroundColor: C.black, borderColor: C.black },
  tabText: { fontFamily: F.barlow, fontSize: 11, color: C.black, includeFontPadding: false, textAlign: 'center' },
  tabTextActive: { color: C.yellow },
  body: { paddingHorizontal: 20, paddingBottom: 20, gap: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  statCard: { width: '47%', backgroundColor: C.white, borderRadius: 12, ...shadow(4,4), padding: 12 },
  statIcon: { fontSize: 20, marginBottom: 2 },
  statValue: { fontFamily: F.barlow, fontSize: 24, lineHeight: 28 },
  statLabel: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  sectionTitle: { fontFamily: F.barlow, fontSize: 18, color: C.black, marginBottom: 2 },
  emptyCard: { backgroundColor: C.white, borderRadius: 12, ...shadow(3,3), padding: 20, alignItems: 'center' },
  emptyText: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.5 },
  readyCard: { backgroundColor: C.white, borderRadius: 12, ...shadow(4,4,'#FFC50A'), padding: 12 },
  readyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  orderId: { fontFamily: F.barlow, fontSize: 17, color: C.black },
  orderCustomer: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.5 },
  readyBadge: { backgroundColor: C.green, borderRadius: 6, paddingHorizontal: 9, paddingVertical: 2 },
  readyBadgeText: { fontFamily: F.barlow, fontSize: 11, color: C.white },
  orderAddress: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45, marginBottom: 10 },
  assignBtn: { backgroundColor: C.yellow, borderRadius: 9, padding: 10, alignItems: 'center', ...shadow(3,3) },
  assignBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  riderCard: { backgroundColor: C.white, borderRadius: 13, ...shadow(4,4), padding: 12 },
  riderCardAssigned: { ...shadow(5,5, C.yellow) },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  riderAvatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  riderAvatarText: { fontFamily: F.barlow, fontSize: 18, color: C.white },
  riderName: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  statusBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  statusBadgeText: { fontFamily: F.interBold, fontSize: 9, color: C.white, letterSpacing: 1 },
  riderMeta: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  riderVehicle: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.4 },
  riderActions: { flexDirection: 'row', gap: 8 },
  callBtn: { flex: 1, backgroundColor: C.white, borderRadius: 9, padding: 8, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)' },
  callBtnText: { fontFamily: F.barlow, fontSize: 13, color: C.black },
  riderAssignBtn: { flex: 2, backgroundColor: C.yellow, borderRadius: 9, padding: 8, alignItems: 'center', ...shadow(3,3) },
  riderAssignBtnDone: { backgroundColor: C.green },
  riderAssignBtnDisabled: { backgroundColor: '#ddd', shadowOpacity: 0 },
  riderAssignBtnText: { fontFamily: F.barlow, fontSize: 13, color: C.black },
  histCard: { backgroundColor: C.white, borderRadius: 12, ...shadow(3,3), padding: 12 },
  histHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  histOrderId: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  histBadge: { borderRadius: 5, paddingHorizontal: 8, paddingVertical: 1 },
  histBadgeText: { fontFamily: F.barlow, fontSize: 11, color: C.white },
  histMeta: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.65 },
})
