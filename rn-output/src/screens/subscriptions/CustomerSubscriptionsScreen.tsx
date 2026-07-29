import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import type { SetScreen, NavParams } from '../../types'
import { customerSubscriptions, type CustomerSubscription } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

const STATUS_META: Record<CustomerSubscription['status'], { label: string; color: string; bg: string }> = {
  active:        { label: 'ACTIVE',   color: C.green,  bg: '#DCFCE7' },
  paused:        { label: 'PAUSED',   color: C.amber,  bg: '#FEF3C7' },
  expired:       { label: 'EXPIRED',  color: '#888',   bg: '#F3F4F6' },
  expiring_soon: { label: 'EXPIRING', color: C.red,    bg: '#FEE2E2' },
}

const FREQ_TABS = [
  { id: 'freq_all',     label: 'All' },
  { id: 'freq_daily',   label: 'Daily' },
  { id: 'freq_weekly',  label: 'Weekly' },
  { id: 'freq_monthly', label: 'Monthly' },
]

export default function CustomerSubscriptionsScreen({ setScreen, navParams: _navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const [freq, setFreq] = useState<string>('freq_all')
  const [subs] = useState<CustomerSubscription[]>(customerSubscriptions)

  const filtered = subs.filter((s: CustomerSubscription) => freq === 'freq_all' || s.frequency === freq.replace('freq_', ''))
  const activeCount = subs.filter((s: CustomerSubscription) => s.status === 'active').length

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('orders')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.title}>Subscriptions</Text>
          <Text style={s.sub}>{activeCount} active plan{activeCount !== 1 ? 's' : ''}</Text>
        </View>
      </View>

      {/* Freq tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll} contentContainerStyle={s.tabsContent}>
        {FREQ_TABS.map(t => {
          const active = freq === t.id
          return (
            <TouchableOpacity key={t.id} onPress={() => setFreq(t.id)} style={[s.tab, active && s.tabActive]}>
              <Text style={[s.tabText, active && s.tabTextActive]}>{t.label.toUpperCase()}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.list}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 52, marginBottom: 14 }}>📋</Text>
            <Text style={s.emptyTitle}>No Subscribers Yet</Text>
            <Text style={s.emptySub}>Create meal plans to attract loyal customers.</Text>
          </View>
        ) : filtered.map((sub: CustomerSubscription) => {
          const m = STATUS_META[sub.status]
          const pct = sub.mealsDelivered / (sub.mealsDelivered + sub.mealsRemaining) * 100
          return (
            <TouchableOpacity
              key={sub.id}
              style={s.card}
              onPress={() => setScreen('customer_subscription_detail', { id: sub.id })}
            >
              {/* Top row */}
              <View style={s.cardTop}>
                <View>
                  <Text style={s.customerName}>{sub.customerName}</Text>
                  <Text style={s.planMeta}>{sub.plan} · {sub.deliveryTime}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: m.bg, borderColor: m.color }]}>
                  <Text style={[s.statusBadgeText, { color: m.color }]}>{m.label}</Text>
                </View>
              </View>

              {/* Stats row */}
              <View style={s.statsRow}>
                {[
                  { id: 'sm_del', lbl: 'Delivered', val: sub.mealsDelivered },
                  { id: 'sm_rem', lbl: 'Remaining', val: sub.mealsRemaining },
                ].map(stat => (
                  <View key={stat.id} style={s.statBox}>
                    <Text style={s.statVal}>{stat.val}</Text>
                    <Text style={s.statLbl}>{stat.lbl}</Text>
                  </View>
                ))}
                <View style={s.statBox}>
                  <Text style={[s.statVal, { color: C.green }]}>₹{sub.amountPaid.toLocaleString()}</Text>
                  <Text style={s.statLbl}>Paid</Text>
                </View>
              </View>

              {/* Progress */}
              <View style={s.progressBg}>
                <View style={[s.progressFill, { width: `${pct}%` as any, backgroundColor: m.color }]} />
              </View>
              <Text style={s.dateRange}>{sub.startDate} → {sub.endDate}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 0 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black },
  sub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45 },
  tabsScroll: { flexGrow: 0 },
  tabsContent: { paddingHorizontal: 20, gap: 7, paddingVertical: 10, alignItems: 'center' },
  tab: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)', flexShrink: 0, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  tabActive: { backgroundColor: C.black, borderColor: C.black },
  tabText: { fontFamily: F.barlow, fontSize: 13, color: C.black, includeFontPadding: false, textAlign: 'center' },
  tabTextActive: { color: C.yellow },
  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 10 },
  empty: { alignItems: 'center', paddingTop: 48 },
  emptyTitle: { fontFamily: F.barlow, fontSize: 24, color: C.black, marginBottom: 6 },
  emptySub: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.4, textAlign: 'center', maxWidth: 240 },
  card: { backgroundColor: C.white, borderRadius: 14, ...shadow(4, 4), padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
  customerName: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  planMeta: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45 },
  statusBadge: {  borderRadius: 7, paddingHorizontal: 10, paddingVertical: 3 },
  statusBadgeText: { fontFamily: F.barlow, fontSize: 11 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  statBox: { flex: 1, alignItems: 'center', padding: 8, backgroundColor: C.cream, borderRadius: 8, },
  statVal: { fontFamily: F.barlow, fontSize: 22, color: C.black, lineHeight: 26 },
  statLbl: { fontFamily: F.inter, fontSize: 10, color: C.black, opacity: 0.45 },
  progressBg: { height: 6, backgroundColor: '#e5e5e5', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  dateRange: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.35, marginTop: 4 },
})
