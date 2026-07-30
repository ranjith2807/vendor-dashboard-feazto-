import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import type { SetScreen } from '../../types'
import { analyticsStats, revenueData, peakHoursData, topDishes } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

const PERIODS = [{ id: 'per_week', label: '7D' }, { id: 'per_month', label: '30D' }, { id: 'per_quarter', label: '90D' }]

function BarChart({ data, maxValue, color = C.yellow, height = 80 }: {
  data: Array<{ id: string; label: string; value: number }>
  maxValue: number
  color?: string
  height?: number
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: height + 20 }}>
      {data.map(d => {
        const pct = d.value / maxValue
        const barH = Math.max(pct * height, 4)
        return (
          <View key={d.id} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: height + 20 }}>
            <View style={{ width: '100%', height: barH, backgroundColor: color, borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
            <Text style={{ fontFamily: F.inter, fontSize: 9, color: C.black, opacity: 0.45, marginTop: 3 }}>{d.label}</Text>
          </View>
        )
      })}
    </View>
  )
}

export default function AnalyticsScreen({ setScreen: _setScreen }: { setScreen: SetScreen }) {
  const [activePeriod, setActivePeriod] = useState('per_week')
  const maxRevenue = Math.max(...revenueData.map(d => d.value))
  const maxPeak = Math.max(...peakHoursData.map(d => d.value))

  return (
    <ScrollView style={s.root} contentContainerStyle={s.body}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Analytics</Text>
        <View style={s.periodsRow}>
          {PERIODS.map(p => {
            const active = activePeriod === p.id
            return (
              <TouchableOpacity key={p.id} onPress={() => setActivePeriod(p.id)} style={[s.periodBtn, active && s.periodBtnActive]}>
                <Text style={[s.periodBtnText, active && s.periodBtnTextActive]}>{p.label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* Stats grid */}
      <View style={s.statsGrid}>
        {analyticsStats.map(stat => (
          <View key={stat.id} style={s.statCard}>
            <Text style={s.statIcon}>{stat.icon}</Text>
            <Text style={s.statValue}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
            <Text style={[s.statDelta, { color: stat.positive ? C.green : C.red }]}>{stat.delta}</Text>
          </View>
        ))}
      </View>

      {/* Revenue chart */}
      <View style={s.chartCard}>
        <View style={s.chartHeader}>
          <View>
            <Text style={s.chartTitle}>Revenue</Text>
            <Text style={s.chartSub}>Last 7 days</Text>
          </View>
          <Text style={[s.chartTotal, { color: C.green }]}>₹ 44,820</Text>
        </View>
        <BarChart data={revenueData} maxValue={maxRevenue} color={C.yellow} height={90} />
      </View>

      {/* Peak hours */}
      <View style={s.chartCard}>
        <Text style={s.chartTitle}>Peak Hours</Text>
        <Text style={s.chartSub}>Order volume by hour</Text>
        <View style={{ marginTop: 4 }}>
          <BarChart data={peakHoursData} maxValue={maxPeak} color={C.black} height={70} />
        </View>
      </View>

      {/* Top dishes */}
      <View style={s.chartCard}>
        <Text style={[s.chartTitle, { marginBottom: 12 }]}>Best Selling Dishes</Text>
        {topDishes.map((dish, i) => (
          <View key={dish.id} style={[s.dishRow, i < topDishes.length - 1 && s.dishRowBorder]}>
            <View style={[s.dishRank, i === 0 && { backgroundColor: C.yellow }]}>
              <Text style={s.dishRankText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.dishName}>{dish.name}</Text>
              <Text style={s.dishOrders}>{dish.orders} orders</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.dishRevenue}>₹ {dish.revenue.toLocaleString()}</Text>
              <Text style={[s.dishGrowth, { color: dish.positive ? C.green : C.red }]}>{dish.growth}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  body: { padding: 20, gap: 14, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: F.barlow, fontSize: 28, color: C.black },
  periodsRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  periodBtn: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)', flexShrink: 0, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  periodBtnActive: { backgroundColor: C.black, borderColor: C.black },
  periodBtnText: { fontFamily: F.barlow, fontSize: 13, color: C.black, includeFontPadding: false, textAlign: 'center' },
  periodBtnTextActive: { color: C.yellow },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%', backgroundColor: C.white, borderRadius: 12, ...shadow(4, 4), padding: 12 },
  statIcon: { fontSize: 20, marginBottom: 2 },
  statValue: { fontFamily: F.barlow, fontSize: 22, color: C.black, lineHeight: 26 },
  statLabel: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  statDelta: { fontFamily: F.interBold, fontSize: 10, marginTop: 2 },
  chartCard: { backgroundColor: C.white, borderRadius: 14, ...shadow(4, 4), padding: 14 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  chartTitle: { fontFamily: F.barlow, fontSize: 18, color: C.black },
  chartSub: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.4 },
  chartTotal: { fontFamily: F.barlow, fontSize: 22 },
  dishRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 10, marginBottom: 10 },
  dishRowBorder: { borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.07)' },
  dishRank: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' },
  dishRankText: { fontFamily: F.barlow, fontSize: 12, color: C.black },
  dishName: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  dishOrders: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  dishRevenue: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  dishGrowth: { fontFamily: F.interBold, fontSize: 11 },
})
