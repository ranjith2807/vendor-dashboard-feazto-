import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { mockRiders } from '../../data/mockData'
import { C, F, shadow, border3D } from '../../theme'

export default function FezuRiderDetailScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const rider = mockRiders.find(r => r.id === navParams.id) ?? mockRiders[0]
  const [assigned, setAssigned] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed) return (
    <View style={s.confirmed}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>🚴</Text>
      <Text style={s.confirmedTitle}>Rider Assigned!</Text>
      <Text style={s.confirmedSub}>{rider.name} is on the way to your kitchen.</Text>
      <TouchableOpacity style={s.trackBtn} onPress={() => setScreen('fezu')}>
        <Text style={s.trackBtnText}>TRACK LIVE →</Text>
      </TouchableOpacity>
    </View>
  )

  const sc = rider.status === 'available' ? C.green : rider.status === 'busy' ? C.amber : '#999'

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('fezu')}><Text style={s.back}>←</Text></TouchableOpacity>
        <Text style={s.title}>Rider Profile</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Profile */}
        <View style={s.profileCard}>
          <View style={s.avatar}><Text style={{ fontSize: 36 }}>🧑</Text></View>
          <Text style={s.name}>{rider.name}</Text>
          <Text style={s.vehicle}>{rider.vehicleType} · {rider.vehicleNo}</Text>
          <View style={[s.statusPill, { borderColor: sc }]}>
            <View style={[s.statusDot, { backgroundColor: sc }]} />
            <Text style={[s.statusText, { color: sc }]}>{rider.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { id: 'rs1', icon: '⭐', val: rider.rating.toFixed(1), lbl: 'Rating' },
            { id: 'rs2', icon: '📦', val: String(rider.totalDeliveries), lbl: 'Deliveries' },
            { id: 'rs3', icon: '📍', val: `${rider.distanceKm}km`, lbl: 'Away' },
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
          <TouchableOpacity style={s.callBtn}>
            <Text style={s.callBtnText}>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.chatBtn}>
            <Text style={s.chatBtnText}>💬 Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Recent */}
        <View style={s.recentCard}>
          <Text style={s.recentTitle}>Recent Deliveries</Text>
          {['Priya Krishnan · 28 min', 'Ravi Shankar · 22 min', 'Deepa Lakshmi · 31 min'].map((d, i) => (
            <View key={i} style={[s.recentRow, i < 2 && s.recentRowBorder]}>
              <Text style={s.recentCustomer}>{d.split('·')[0].trim()}</Text>
              <Text style={s.recentTime}>⏱ {d.split('·')[1].trim()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action bar */}
      <View style={s.actionBar}>
        {!assigned ? (
          <TouchableOpacity
            style={[s.assignBtn, rider.status !== 'available' && s.assignBtnDisabled]}
            onPress={() => rider.status === 'available' && setAssigned(true)}
            disabled={rider.status !== 'available'}
          >
            <Text style={s.assignBtnText}>
              {rider.status === 'available' ? 'ASSIGN THIS RIDER →' : 'RIDER NOT AVAILABLE'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={s.confirmRow}>
            <TouchableOpacity style={s.cancelBtn} onPress={() => setAssigned(false)}>
              <Text style={s.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.confirmBtn} onPress={() => setConfirmed(true)}>
              <Text style={s.confirmBtnText}>✓ CONFIRM ASSIGNMENT</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 24, color: C.black },
  body: { paddingHorizontal: 20, paddingBottom: 120, gap: 12 },
  profileCard: { backgroundColor: C.white, borderRadius: 16, ...shadow(5,5), ...border3D, padding: 18, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.yellow, ...shadow(4,4), ...border3D, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { fontFamily: F.barlow, fontSize: 24, color: C.black, marginBottom: 4 },
  vehicle: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.5, marginBottom: 10 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6,  borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontFamily: F.barlow, fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, backgroundColor: C.white, borderRadius: 12, ...shadow(3,3), ...border3D, padding: 12, alignItems: 'center' },
  statIcon: { fontSize: 20, marginBottom: 2 },
  statVal: { fontFamily: F.barlow, fontSize: 20, color: C.black, lineHeight: 24 },
  statLbl: { fontFamily: F.inter, fontSize: 10, color: C.black, opacity: 0.45 },
  contactRow: { flexDirection: 'row', gap: 10 },
  callBtn: { flex: 1, backgroundColor: C.green,  borderRadius: 10, padding: 11, alignItems: 'center', ...shadow(3,3), ...border3D },
  callBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.white },
  chatBtn: { flex: 1, backgroundColor: C.blue,  borderRadius: 10, padding: 11, alignItems: 'center', ...shadow(3,3), ...border3D },
  chatBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.white },
  recentCard: { backgroundColor: C.white, borderRadius: 14, ...shadow(4,4), ...border3D, padding: 14 },
  recentTitle: { fontFamily: F.barlow, fontSize: 16, color: C.black, marginBottom: 10 },
  recentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8 },
  recentRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  recentCustomer: { fontFamily: F.inter, fontSize: 13, color: C.black },
  recentTime: { fontFamily: F.interBold, fontSize: 12, color: C.green },
  actionBar: { backgroundColor: C.white, padding: 12, paddingHorizontal: 20 },
  assignBtn: { backgroundColor: C.yellow,  borderRadius: 12, padding: 13, alignItems: 'center', ...shadow(4,4), ...border3D },
  assignBtnDisabled: { backgroundColor: '#ddd', shadowOpacity: 0 },
  assignBtnText: { fontFamily: F.barlow, fontSize: 17, color: C.black },
  confirmRow: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1,  borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3,3), ...border3D },
  cancelBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  confirmBtn: { flex: 2, backgroundColor: C.green,  borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3,3), ...border3D },
  confirmBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.white },
  confirmed: { flex: 1, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', padding: 32 },
  confirmedTitle: { fontFamily: F.barlow, fontSize: 30, color: C.white, marginBottom: 8 },
  confirmedSub: { fontFamily: F.inter, fontSize: 13, color: C.white, opacity: 0.85, textAlign: 'center', marginBottom: 28 },
  trackBtn: { width: '100%', backgroundColor: C.yellow,  borderRadius: 12, padding: 14, alignItems: 'center', ...shadow(4,4, 'rgba(0,0,0,0.3)') },
  trackBtnText: { fontFamily: F.barlow, fontSize: 17, color: C.black },
})
