import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { subscriptionInfo } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

interface Feature {
  id: string
  label: string
  included: boolean
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: string
}

export default function SettingsSubscriptionScreen({ setScreen }: { setScreen: SetScreen }) {
  const { plan, price, billingCycle, renewsOn, features, invoices } = subscriptionInfo

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('settings')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Subscription</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Plan card */}
        <View style={s.planCard}>
          <View style={s.planTop}>
            <View>
              <Text style={s.planLabel}>CURRENT PLAN</Text>
              <Text style={s.planName}>{plan}</Text>
            </View>
            <View style={s.activeBadge}><Text style={s.activeBadgeText}>ACTIVE</Text></View>
          </View>
          <Text style={s.planPrice}>
            ₹{price.toLocaleString()}
            <Text style={s.planPriceSub}>/{billingCycle.toLowerCase()}</Text>
          </Text>
          <Text style={s.planRenews}>Renews on {renewsOn}</Text>
        </View>

        {/* Features */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Plan Features</Text>
          {features.map((f: Feature, i: number) => (
            <View key={f.id} style={[s.featureRow, i < features.length - 1 && s.featureRowBorder]}>
              <View style={[s.featureCheck, { backgroundColor: f.included ? '#DCFCE7' : '#F3F4F6', borderColor: f.included ? C.green : '#ddd' }]}>
                <Text style={[s.featureCheckText, { color: f.included ? C.green : '#aaa' }]}>{f.included ? '✓' : '✕'}</Text>
              </View>
              <Text style={[s.featureLabel, !f.included && s.featureLabelDim]}>{f.label}</Text>
            </View>
          ))}
          <TouchableOpacity style={s.upgradeBtn}>
            <Text style={s.upgradeBtnText}>UPGRADE TO BUSINESS →</Text>
          </TouchableOpacity>
        </View>

        {/* Billing history */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Billing History</Text>
          {invoices.map((inv: Invoice, i: number) => (
            <View key={inv.id} style={[s.invoiceRow, i < invoices.length - 1 && s.invoiceRowBorder]}>
              <View style={s.invoiceIcon}><Text style={{ fontSize: 16 }}>📄</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.invoiceDate}>Invoice — {inv.date}</Text>
                <Text style={s.invoiceMeta}>{plan} Plan · {billingCycle}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.invoiceAmount}>₹{inv.amount}</Text>
                <Text style={s.invoiceStatus}>{inv.status.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Cancel */}
        <TouchableOpacity style={s.cancelBtn}>
          <Text style={s.cancelBtnText}>Cancel Subscription</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 20, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black },
  body: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },
  planCard: { backgroundColor: C.black, borderRadius: 16, ...shadow(6, 6, C.yellow), padding: 20, overflow: 'hidden' },
  planTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  planLabel: { fontFamily: F.interBold, fontSize: 11, color: C.yellow, letterSpacing: 1, marginBottom: 4 },
  planName: { fontFamily: F.barlow, fontSize: 32, color: C.white, lineHeight: 34 },
  activeBadge: { backgroundColor: C.yellow,  borderColor: C.white, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  activeBadgeText: { fontFamily: F.barlow, fontSize: 12, color: C.black },
  planPrice: { fontFamily: F.barlow, fontSize: 28, color: C.yellow, marginBottom: 4 },
  planPriceSub: { fontSize: 14, fontFamily: 'Inter_400Regular', opacity: 0.7 },
  planRenews: { fontFamily: F.inter, fontSize: 12, color: C.cream, opacity: 0.55 },
  card: { backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 14 },
  cardTitle: { fontFamily: F.barlow, fontSize: 18, color: C.black, marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 10, marginBottom: 10 },
  featureRowBorder: { borderBottomWidth: 1.5, borderBottomColor: 'rgba(0,0,0,0.06)' },
  featureCheck: { width: 22, height: 22, borderRadius: 11,  alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureCheckText: { fontFamily: F.interBold, fontSize: 11 },
  featureLabel: { fontFamily: F.inter, fontSize: 13, color: C.black, flex: 1 },
  featureLabelDim: { opacity: 0.4 },
  upgradeBtn: { backgroundColor: C.yellow,  borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3, 3), marginTop: 4 },
  upgradeBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  invoiceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 10, marginBottom: 10 },
  invoiceRowBorder: { borderBottomWidth: 1.5, borderBottomColor: 'rgba(0,0,0,0.06)' },
  invoiceIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' },
  invoiceDate: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  invoiceMeta: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  invoiceAmount: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  invoiceStatus: { fontFamily: F.interBold, fontSize: 10, color: C.green, letterSpacing: 1 },
  cancelBtn: {  borderRadius: 10, padding: 12, alignItems: 'center' },
  cancelBtnText: { fontFamily: F.interBold, fontSize: 13, color: C.red },
})
