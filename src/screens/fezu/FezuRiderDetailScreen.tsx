import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { C, F, shadow } from '../../theme'
import { useFezuStore, DELIVERY_STATUS_META } from '../../context/FezuContext'
import { MOCK_RIDERS, KITCHEN_LOCATION, haversineKm, etaMinutes } from '../../data/mockRiders'

export default function FezuRiderDetailScreen({
  setScreen,
  navParams,
}: {
  setScreen: SetScreen
  navParams: NavParams
}) {
  const { riders, allDeliveries } = useFezuStore()

  // Use live rider data (with jittered location) if available, else fall back to mock
  const rider = riders.find(r => r.riderId === navParams.id)
    ?? MOCK_RIDERS.find(r => r.riderId === navParams.id)
    ?? riders[0]

  const sc = rider.status === 'online' ? C.green : rider.status === 'busy' ? C.amber : '#999'
  const statusLabel = rider.status === 'online' ? 'ONLINE' : rider.status === 'busy' ? 'BUSY' : 'OFFLINE'

  // Live distance & ETA to kitchen
  const distKm = Math.round(haversineKm(rider.currentLocation, KITCHEN_LOCATION) * 10) / 10
  const eta    = etaMinutes(distKm)

  // Current assignment
  const currentDelivery = rider.currentOrderId
    ? allDeliveries[rider.currentOrderId] ?? null
    : null
  const delivMeta = currentDelivery
    ? DELIVERY_STATUS_META[currentDelivery.deliveryStatus]
    : null

  const initials = rider.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('fezu')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Rider Profile</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>

        {/* Profile card */}
        <View style={s.profileCard}>
          <View style={[s.avatar, { backgroundColor: sc }]}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.name}>{rider.name}</Text>
          <Text style={s.vehicle}>{rider.vehicleType} · {rider.vehicleNumber}</Text>
          <View style={[s.statusPill, { borderColor: sc }]}>
            <View style={[s.statusDot, { backgroundColor: sc }]} />
            <Text style={[s.statusText, { color: sc }]}>{statusLabel}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { id: 'rs1', icon: '⭐', val: rider.rating.toFixed(1), lbl: 'Rating' },
            { id: 'rs2', icon: '📦', val: rider.totalDeliveries.toLocaleString(), lbl: 'Deliveries' },
            { id: 'rs3', icon: '📍', val: `${distKm}km`, lbl: 'From Kitchen' },
            { id: 'rs4', icon: '⏱', val: `${eta}m`, lbl: 'ETA' },
          ].map(stat => (
            <View key={stat.id} style={s.statCard}>
              <Text style={s.statIcon}>{stat.icon}</Text>
              <Text style={s.statVal}>{stat.val}</Text>
              <Text style={s.statLbl}>{stat.lbl}</Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={s.contactRow}>
          <View style={s.callBtn}>
            <Text style={s.callBtnText}>📞 {rider.phone}</Text>
          </View>
        </View>

        {/* Current assignment — read-only */}
        {rider.status === 'busy' && (
          <View style={s.card}>
            <Text style={s.cardLabel}>CURRENT ASSIGNMENT</Text>
            {currentDelivery && delivMeta ? (
              <>
                <View style={[s.assignmentBanner, { backgroundColor: delivMeta.bg }]}>
                  <Text style={[s.assignmentStatus, { color: delivMeta.color }]}>
                    {delivMeta.icon}  {delivMeta.label}
                  </Text>
                </View>
                <View style={s.assignmentRow}>
                  <Text style={s.assignmentLabel}>Order</Text>
                  <Text style={s.assignmentValue}>
                    #{currentDelivery.orderId.replace('vord_', '')}
                  </Text>
                </View>
                {currentDelivery.assignedRiderDetails && (
                  <View style={s.assignmentRow}>
                    <Text style={s.assignmentLabel}>Distance to kitchen</Text>
                    <Text style={s.assignmentValue}>
                      {currentDelivery.assignedRiderDetails.distanceKm} km
                    </Text>
                  </View>
                )}
                {currentDelivery.riderAssignedAt && (
                  <View style={s.assignmentRow}>
                    <Text style={s.assignmentLabel}>Assigned at</Text>
                    <Text style={s.assignmentValue}>
                      {new Date(currentDelivery.riderAssignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={s.busyNote}>This rider is currently on a delivery.</Text>
            )}
          </View>
        )}

        {/* Availability note for offline riders */}
        {rider.status === 'offline' && (
          <View style={[s.card, { backgroundColor: '#F9FAFB' }]}>
            <Text style={[s.cardLabel, { color: '#9CA3AF' }]}>AVAILABILITY</Text>
            <Text style={s.offlineNote}>
              This rider is currently offline and won't receive automatic assignments.
            </Text>
          </View>
        )}

        {/* Online / available note */}
        {rider.status === 'online' && (
          <View style={[s.card, { backgroundColor: '#DCFCE7' }]}>
            <Text style={[s.cardLabel, { color: C.green }]}>AVAILABILITY</Text>
            <Text style={s.onlineNote}>
              ✅  Available for automatic assignment. Will be picked when the nearest order is ready.
            </Text>
          </View>
        )}

        {/* Recent deliveries */}
        <View style={s.card}>
          <Text style={s.cardLabel}>RECENT DELIVERIES</Text>
          {['Priya Krishnan · 28 min', 'Ravi Shankar · 22 min', 'Deepa Lakshmi · 31 min'].map((d, i) => (
            <View key={i} style={[s.recentRow, i < 2 && s.recentRowBorder]}>
              <Text style={s.recentCustomer}>{d.split('·')[0].trim()}</Text>
              <Text style={s.recentTime}>⏱ {d.split('·')[1].trim()}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 24, color: C.black },
  body: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },

  profileCard: { backgroundColor: C.white, borderRadius: 16, ...shadow(5, 5), padding: 18, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, ...shadow(4, 4), alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontFamily: F.barlow, fontSize: 28, color: C.white },
  name: { fontFamily: F.barlow, fontSize: 24, color: C.black, marginBottom: 4 },
  vehicle: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.5, marginBottom: 10 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontFamily: F.barlow, fontSize: 13 },

  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(3, 3), padding: 10, alignItems: 'center' },
  statIcon: { fontSize: 18, marginBottom: 2 },
  statVal: { fontFamily: F.barlow, fontSize: 18, color: C.black, lineHeight: 22 },
  statLbl: { fontFamily: F.inter, fontSize: 9, color: C.black, opacity: 0.45, textAlign: 'center' },

  contactRow: { gap: 10 },
  callBtn: { backgroundColor: C.green, borderRadius: 10, padding: 11, alignItems: 'center', ...shadow(3, 3) },
  callBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.white },

  card: { backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 14 },
  cardLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.35, marginBottom: 10 },

  assignmentBanner: { borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: 10 },
  assignmentStatus: { fontFamily: F.barlow, fontSize: 16, letterSpacing: 0.5 },
  assignmentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  assignmentLabel: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.5 },
  assignmentValue: { fontFamily: F.interBold, fontSize: 12, color: C.black },
  busyNote: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.5 },

  offlineNote: { fontFamily: F.inter, fontSize: 13, color: '#9CA3AF', lineHeight: 20 },
  onlineNote: { fontFamily: F.inter, fontSize: 13, color: '#166534', lineHeight: 20 },

  recentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8 },
  recentRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  recentCustomer: { fontFamily: F.inter, fontSize: 13, color: C.black },
  recentTime: { fontFamily: F.interBold, fontSize: 12, color: C.green },
})
