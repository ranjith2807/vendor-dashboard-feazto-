import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { C, F, shadow } from '../../theme'
import { useVendor } from '../../context/VendorContext'
import { subscribeOrders } from '../../lib/ordersDb'
import { computeAnalytics } from '../../lib/walletDb'
import type { VendorOrder } from '../../data/menuStore'

const PERIODS = [
  { id: 'per_week',    label: '7D' },
  { id: 'per_month',   label: '30D' },
  { id: 'per_quarter', label: '90D' },
]

function BarChart({ data, maxValue, color = C.yellow, height = 80 }: {
  data: Array<{ id: string; label: string; value: number }>
  maxValue: number
  color?: string
  height?: number
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: height + 20 }}>
      {data.map(d => {
        const pct  = maxValue > 0 ? d.value / maxValue : 0
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
  const { vendor } = useVendor()
  const email = vendor?.email ?? ''

  const [activePeriod, setActivePeriod] = useState('per_week')
  const [orders, setOrders]             = useState<VendorOrder[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    if (!email) return
    const unsub = subscribeOrders(email, liveOrders => {
      setOrders(liveOrders)
      setLoading(false)
    })
    return unsub
  }, [email])

  // Filter orders by period
  const filteredOrders = orders.filter(o => {
    const days = activePeriod === 'per_week' ? 7 : activePeriod === 'per_month' ? 30 : 90
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return new Date(o.createdAt) >= cutoff
  })

  const { stats, revenueByDay, topDishes, totalRevenue } = computeAnalytics(filteredOrders)
  const maxRevenue = Math.max(...revenueByDay.map(d => d.value), 1)

  return (
    <ScrollView style={s.root} contentContainerStyle={s.body}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Analytics</Text>
        <View style={s.periodsRow}>
          {PERIODS.map(p => {
            const active = activePeriod === p.id
            return (
              <TouchableOpacity key={p.id} onPress={() => setActivePeriod(p.id)}
                style={[s.periodBtn, active && s.periodBtnActive]}>
                <Text style={[s.periodBtnText, active && s.periodBtnTextActive]}>{p.label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator color={C.black} size="large" />
          <Text style={s.loadingText}>Loading analytics…</Text>
        </View>
      ) : (
        <>
          {/* Stats grid — real computed values */}
          <View style={s.statsGrid}>
            {stats.map(stat => (
              <View key={stat.id} style={s.statCard}>
                <Text style={s.statIcon}>{stat.icon}</Text>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
                {!!stat.delta && (
                  <Text style={[s.statDelta, { color: stat.positive ? C.green : C.red }]}>{stat.delta}</Text>
                )}
              </View>
            ))}
          </View>

          {/* Revenue chart */}
          <View style={s.chartCard}>
            <View style={s.chartHeader}>
              <View>
                <Text style={s.chartTitle}>Revenue</Text>
                <Text style={s.chartSub}>Last {activePeriod === 'per_week' ? '7' : activePeriod === 'per_month' ? '30' : '90'} days</Text>
              </View>
              <Text style={[s.chartTotal, { color: C.green }]}>
                ₹ {totalRevenue.toLocaleString()}
              </Text>
            </View>
            <BarChart data={revenueByDay} maxValue={maxRevenue} color={C.yellow} height={90} />
          </View>

          {/* Top dishes */}
          <View style={s.chartCard}>
            <Text style={[s.chartTitle, { marginBottom: 12 }]}>Best Selling Dishes</Text>
            {topDishes.length === 0 ? (
              <Text style={s.emptyText}>No completed orders yet</Text>
            ) : topDishes.map((dish, i) => (
              <View key={dish.id} style={[s.dishRow, i < topDishes.length - 1 && s.dishRowBorder]}>
                <View style={[s.dishRank, i === 0 && { backgroundColor: C.yellow }]}>
                  <Text style={s.dishRankText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.dishName}>{dish.name}</Text>
                  <Text style={s.dishOrders}>{dish.orders} orders</Text>
                </View>
                <Text style={s.dishRevenue}>₹ {dish.revenue.toLocaleString()}</Text>
              </View>
            ))}
          </View>

          {/* Order status breakdown */}
          <View style={s.chartCard}>
            <Text style={[s.chartTitle, { marginBottom: 12 }]}>Order Breakdown</Text>
            {(['NEW', 'PREPARING', 'COMPLETED', 'CANCELLED'] as const).map(status => {
              const count = filteredOrders.filter(o => o.status === status).length
              const pct   = filteredOrders.length > 0 ? ((count / filteredOrders.length) * 100).toFixed(0) : '0'
              const colors: Record<string, string> = {
                NEW: C.yellow, PREPARING: C.amber, COMPLETED: C.green, CANCELLED: C.red,
              }
              return (
                <View key={status} style={s.breakdownRow}>
                  <View style={[s.breakdownDot, { backgroundColor: colors[status] }]} />
                  <Text style={s.breakdownLabel}>{status}</Text>
                  <View style={s.breakdownBarWrap}>
                    <View style={[s.breakdownBar, { width: `${pct}%` as any, backgroundColor: colors[status] }]} />
                  </View>
                  <Text style={s.breakdownCount}>{count}</Text>
                </View>
              )
            })}
          </View>
        </>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  body: { padding: 20, gap: 14, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: F.barlow, fontSize: 28, color: C.black },
  periodsRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  periodBtn: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', flexShrink: 0 },
  periodBtnActive: { backgroundColor: '#f9be08', borderWidth: 2, borderColor: '#000', shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  periodBtnText: { fontFamily: F.barlow, fontSize: 13, color: C.black },
  periodBtnTextActive: { color: C.black },
  loadingWrap: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  loadingText: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.5 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%' as any, backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 12 },
  statIcon: { fontSize: 20, marginBottom: 2 },
  statValue: { fontFamily: F.barlow, fontSize: 22, color: C.black, lineHeight: 26 },
  statLabel: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  statDelta: { fontFamily: F.interBold, fontSize: 10, marginTop: 2 },
  chartCard: { backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 14 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  chartTitle: { fontFamily: F.barlow, fontSize: 18, color: C.black },
  chartSub: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.4 },
  chartTotal: { fontFamily: F.barlow, fontSize: 22 },
  dishRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 10, marginBottom: 10 },
  dishRowBorder: { borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.07)' },
  dishRank: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  dishRankText: { fontFamily: F.barlow, fontSize: 12, color: C.black },
  dishName: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  dishOrders: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  dishRevenue: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  emptyText: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.4, textAlign: 'center', padding: 12 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  breakdownDot: { width: 8, height: 8, borderRadius: 4 },
  breakdownLabel: { fontFamily: F.interBold, fontSize: 11, color: C.black, width: 80 },
  breakdownBarWrap: { flex: 1, height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
  breakdownBar: { height: '100%', borderRadius: 4, minWidth: 4 },
  breakdownCount: { fontFamily: F.barlow, fontSize: 14, color: C.black, width: 28, textAlign: 'right' },
})
