import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import type { SetScreen } from '../../types'
import { transactions } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

const FILTERS = [
  { id: 'wf_all', label: 'All' },
  { id: 'wf_credit', label: 'Credits' },
  { id: 'wf_debit', label: 'Debits' },
  { id: 'wf_pending', label: 'Pending' },
]

export default function WalletScreen({ setScreen: _setScreen }: { setScreen: SetScreen }) {
  const [activeFilter, setActiveFilter] = useState('wf_all')

  const filtered = transactions.filter(t => {
    if (activeFilter === 'wf_credit') return t.type === 'credit'
    if (activeFilter === 'wf_debit') return t.type === 'debit'
    if (activeFilter === 'wf_pending') return t.status === 'pending'
    return true
  })

  return (
    <ScrollView style={s.root} contentContainerStyle={s.body}>
      {/* Hero card */}
      <View style={s.heroCard}>
        <Text style={s.heroLabel}>FEAZTO WALLET · PRIYA'S KITCHEN</Text>
        <Text style={s.heroBalance}>₹ 8,420</Text>
        <Text style={s.heroSub}>Available balance</Text>
        <View style={s.heroStats}>
          <View style={s.heroStat}>
            <Text style={s.heroStatLabel}>PENDING</Text>
            <Text style={[s.heroStatVal, { color: C.amber }]}>₹ 3,280</Text>
          </View>
          <View style={s.heroStat}>
            <Text style={s.heroStatLabel}>TODAY'S EARN</Text>
            <Text style={[s.heroStatVal, { color: C.green }]}>₹ 475</Text>
          </View>
        </View>
        <View style={s.heroBtns}>
          <TouchableOpacity style={s.withdrawBtn}>
            <Text style={s.withdrawBtnText}>💳 WITHDRAW</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.invoiceBtn}>
            <Text style={s.invoiceBtnText}>📄 INVOICE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bank strip */}
      <View style={s.bankCard}>
        <View style={s.bankIcon}><Text style={{ fontSize: 18 }}>🏦</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.bankName}>HDFC Bank Savings</Text>
          <Text style={s.bankDetails}>AC ×××× ×××× ×××× 4321 · HDFC0001234</Text>
        </View>
        <TouchableOpacity style={s.editBtn}><Text style={s.editBtnText}>Edit</Text></TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={s.filtersRow}>
        {FILTERS.map(f => {
          const active = activeFilter === f.id
          return (
            <TouchableOpacity key={f.id} onPress={() => setActiveFilter(f.id)} style={[s.filterBtn, active && s.filterBtnActive]}>
              <Text style={[s.filterBtnText, active && s.filterBtnTextActive]}>{f.label.toUpperCase()}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Transactions */}
      <Text style={s.sectionTitle}>Transactions</Text>
      {filtered.map(txn => (
        <View key={txn.id} style={s.txnCard}>
          <View style={[s.txnIcon, { backgroundColor: txn.type === 'credit' ? '#DCFCE7' : '#FEE2E2' }]}>
            <Text style={s.txnArrow}>{txn.type === 'credit' ? '↓' : '↑'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.txnDesc} numberOfLines={1}>{txn.description}</Text>
            <Text style={s.txnDate}>{txn.date}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[s.txnAmount, { color: txn.type === 'credit' ? C.green : C.red }]}>
              {txn.type === 'credit' ? '+' : '−'} ₹ {txn.amount.toLocaleString()}
            </Text>
            <Text style={[s.txnStatus, { color: txn.status === 'pending' ? C.amber : txn.status === 'success' ? C.green : C.red }]}>
              {txn.status.toUpperCase()}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  body: { padding: 20, gap: 12, paddingBottom: 32 },
  heroCard: { backgroundColor: C.black, borderRadius: 16, ...shadow(6, 6, C.yellow), padding: 20 },
  heroLabel: { fontFamily: F.interBold, fontSize: 11, color: C.cream, opacity: 0.55, letterSpacing: 1, marginBottom: 4 },
  heroBalance: { fontFamily: F.barlow, fontSize: 42, color: C.yellow, lineHeight: 46, marginBottom: 4 },
  heroSub: { fontFamily: F.inter, fontSize: 12, color: C.cream, opacity: 0.5, marginBottom: 16 },
  heroStats: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  heroStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 10 },
  heroStatLabel: { fontFamily: F.interBold, fontSize: 10, color: C.cream, opacity: 0.5, letterSpacing: 1, marginBottom: 2 },
  heroStatVal: { fontFamily: F.barlow, fontSize: 20 },
  heroBtns: { flexDirection: 'row', gap: 8 },
  withdrawBtn: { flex: 1, backgroundColor: C.yellow,  borderColor: C.cream, borderRadius: 10, padding: 11, alignItems: 'center' },
  withdrawBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  invoiceBtn: { flex: 1,  borderColor: 'rgba(255,255,255,0.4)', borderRadius: 10, padding: 11, alignItems: 'center' },
  invoiceBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.cream },
  bankCard: { backgroundColor: C.white, borderRadius: 12, ...shadow(4, 4), padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  bankIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center' },
  bankName: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  bankDetails: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  editBtn: { borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.15)' },
  editBtnText: { fontFamily: F.interBold, fontSize: 11, color: C.black },
  filtersRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  filterBtn: { flex: 1, minWidth: 60, backgroundColor: C.white, borderRadius: 20, paddingVertical: 7, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)' },
  filterBtnActive: { backgroundColor: C.black, borderColor: C.black },
  filterBtnText: { fontFamily: F.barlow, fontSize: 12, color: C.black, includeFontPadding: false, textAlign: 'center' },
  filterBtnTextActive: { color: C.yellow },
  sectionTitle: { fontFamily: F.barlow, fontSize: 18, color: C.black },
  txnCard: { backgroundColor: C.white, borderRadius: 12, ...shadow(3, 3), padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  txnIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txnArrow: { fontFamily: F.barlow, fontSize: 20, color: C.black },
  txnDesc: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  txnDate: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  txnAmount: { fontFamily: F.barlow, fontSize: 18 },
  txnStatus: { fontFamily: F.interBold, fontSize: 10, letterSpacing: 1 },
})
