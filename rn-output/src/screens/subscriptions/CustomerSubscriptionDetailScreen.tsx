import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { customerSubscriptions, type CustomerSubscription } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

export default function CustomerSubscriptionDetailScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const sub: CustomerSubscription = customerSubscriptions.find((s: CustomerSubscription) => s.id === navParams.id) ?? customerSubscriptions[0]
  const [paused, setPaused] = useState<boolean>(sub.status === 'paused')

  const pct = sub.mealsDelivered / (sub.mealsDelivered + sub.mealsRemaining) * 100

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('customer_subscriptions')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Subscription</Text>
        <View style={s.callBtn}><Text style={{ fontSize: 16 }}>📞</Text></View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Customer card */}
        <View style={s.card}>
          <Text style={s.customerName}>{sub.customerName}</Text>
          <Text style={s.customerPhone}>{sub.customerPhone}</Text>
          <View style={s.infoRow}>
            <Text style={s.infoIcon}>📍</Text>
            <Text style={s.infoText}>{sub.address}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoIcon}>⏰</Text>
            <Text style={s.infoText}>Delivery at {sub.deliveryTime}</Text>
          </View>
        </View>

        {/* Plan card */}
        <View style={s.card}>
          <Text style={s.planTitle}>{sub.plan}</Text>
          <View style={s.mealsRow}>
            {sub.meals.map((m: string, i: number) => (
              <View key={i} style={s.mealChip}><Text style={s.mealChipText}>{m}</Text></View>
            ))}
          </View>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${pct}%` as any }]} />
          </View>
          <View style={s.progressLabels}>
            <Text style={s.progressLabel}>{sub.mealsDelivered} delivered</Text>
            <Text style={s.progressLabel}>{sub.mealsRemaining} remaining</Text>
          </View>
        </View>

        {/* Payment card */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Payment</Text>
          {[
            { id: 'pm_paid',  k: 'Amount Paid',  v: `₹${sub.amountPaid.toLocaleString()}`,  color: C.green },
            { id: 'pm_total', k: 'Total Amount',  v: `₹${sub.amountTotal.toLocaleString()}`, color: C.black },
            { id: 'pm_start', k: 'Start Date',    v: sub.startDate,                          color: C.black },
            { id: 'pm_end',   k: 'End Date',      v: sub.endDate,                            color: C.black },
          ].map((r, i) => (
            <View key={r.id} style={[s.payRow, i < 3 && s.payRowBorder]}>
              <Text style={s.payKey}>{r.k}</Text>
              <Text style={[s.payVal, { color: r.color }]}>{r.v}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity
            style={[s.pauseBtn, { backgroundColor: paused ? C.green : C.amber }]}
            onPress={() => setPaused(!paused)}
          >
            <Text style={[s.pauseBtnText, { color: paused ? C.white : C.black }]}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.contactBtn}>
            <Text style={s.contactBtnText}>📞 Contact</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 24, color: C.black, flex: 1 },
  callBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.green,  alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 20, paddingBottom: 24, gap: 10 },
  card: { backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 14 },
  customerName: { fontFamily: F.interBold, fontSize: 16, color: C.black },
  customerPhone: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45, marginBottom: 8 },
  infoRow: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginTop: 4 },
  infoIcon: { fontSize: 12 },
  infoText: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.6, flex: 1 },
  planTitle: { fontFamily: F.barlow, fontSize: 18, color: C.black, marginBottom: 10 },
  mealsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  mealChip: { backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  mealChipText: { fontFamily: F.interBold, fontSize: 11, color: C.black },
  progressBg: { height: 8, backgroundColor: '#e5e5e5', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: C.green, borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.5 },
  sectionTitle: { fontFamily: F.barlow, fontSize: 16, color: C.black, marginBottom: 10 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8 },
  payRowBorder: { borderBottomWidth: 1.5, borderBottomColor: 'rgba(0,0,0,0.06)' },
  payKey: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.5 },
  payVal: { fontFamily: F.interBold, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10 },
  pauseBtn: { flex: 1,  borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  pauseBtnText: { fontFamily: F.barlow, fontSize: 14 },
  contactBtn: { flex: 1, backgroundColor: C.white,  borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  contactBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.black },
})
