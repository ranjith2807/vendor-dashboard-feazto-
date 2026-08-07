import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { C, F, shadow } from '../../theme'
import { useVendor } from '../../context/VendorContext'
import {
  subscribeTransactions, computeWalletSummary,
  type Transaction,
} from '../../../../backend/services/walletService'
import { subscribeOrders } from '../../../../backend/services/ordersService'
import type { VendorOrder } from '../../data/menuStore'

const FILTERS = [
  { id: 'wf_all',     label: 'All' },
  { id: 'wf_credit',  label: 'Credits' },
  { id: 'wf_debit',   label: 'Debits' },
  { id: 'wf_pending', label: 'Pending' },
]

export default function WalletScreen({ setScreen: _setScreen }: { setScreen: SetScreen }) {
  const { vendor } = useVendor()
  const email       = vendor?.email ?? ''
  const kitchenName = vendor?.company_name ?? 'My Kitchen'

  const [activeFilter, setActiveFilter] = useState('wf_all')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [orders, setOrders]             = useState<VendorOrder[]>([])
  const [loading, setLoading]           = useState(true)

  // Subscribe to transactions and orders
  useEffect(() => {
    if (!email) return
    let loaded = 0
    const done = () => { loaded++; if (loaded >= 2) setLoading(false) }

    const unsubTxn = subscribeTransactions(email, txns => {
      setTransactions(txns)
      done()
    })
    const unsubOrd = subscribeOrders(email, ords => {
      setOrders(ords)
      done()
    })
    return () => { unsubTxn(); unsubOrd() }
  }, [email])

  const { balance, pendingAmount, todayEarnings } = computeWalletSummary(orders)

  const filtered = transactions.filter(t => {
    if (activeFilter === 'wf_credit')  return t.type === 'credit'
    if (activeFilter === 'wf_debit')   return t.type === 'debit'
    if (activeFilter === 'wf_pending') return t.status === 'pending'
    return true
  })

  // If no transactions yet, build them from completed orders
  const displayTxns: Transaction[] = filtered.length > 0 ? filtered : orders
    .filter(o => o.status === 'COMPLETED')
    .slice(0, 10)
    .map(o => ({
      id:          `txn_${o.id}`,
      type:        'credit' as const,
      description: `Order #${o.orderNumber} — ${o.customerName}`,
      amount:      o.total,
      date:        o.completedAt ?? o.createdAt,
      status:      'success' as const,
      orderId:     o.id,
    }))

  return (
    <ScrollView style={s.root} contentContainerStyle={s.body}>
      {/* Hero balance card */}
      <View style={s.heroCard}>
        <Text style={s.heroLabel}>FEAZTO WALLET · {kitchenName.toUpperCase()}</Text>
        {loading ? (
          <ActivityIndicator color={C.yellow} size="large" style={{ marginVertical: 12 }} />
        ) : (
          <>
            <Text style={s.heroBalance}>₹ {balance.toLocaleString()}</Text>
            <Text style={s.heroSub}>Available balance</Text>
            <View style={s.heroStats}>
              <View style={s.heroStat}>
                <Text style={s.heroStatLabel}>PENDING</Text>
                <Text style={[s.heroStatVal, { color: C.amber }]}>₹ {pendingAmount.toLocaleString()}</Text>
              </View>
              <View style={s.heroStat}>
                <Text style={s.heroStatLabel}>TODAY'S EARN</Text>
                <Text style={[s.heroStatVal, { color: C.green }]}>₹ {todayEarnings.toLocaleString()}</Text>
              </View>
            </View>
          </>
        )}
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
          <Text style={s.bankName}>Bank Account</Text>
          <Text style={s.bankDetails}>Link your bank to withdraw earnings</Text>
        </View>
        <TouchableOpacity style={s.editBtn}>
          <Text style={s.editBtnText}>Link</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={s.filtersRow}>
        {FILTERS.map(f => {
          const active = activeFilter === f.id
          return (
            <TouchableOpacity key={f.id} onPress={() => setActiveFilter(f.id)}
              style={[s.filterBtn, active && s.filterBtnActive]}>
              <Text style={[s.filterBtnText, active && s.filterBtnTextActive]}>
                {f.label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Transactions */}
      <Text style={s.sectionTitle}>Transactions</Text>
      {loading ? (
        <ActivityIndicator color={C.black} />
      ) : displayTxns.length === 0 ? (
        <View style={s.empty}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>💳</Text>
          <Text style={s.emptyText}>No transactions yet</Text>
          <Text style={s.emptySub}>Completed orders will appear here</Text>
        </View>
      ) : displayTxns.map(txn => (
        <View key={txn.id} style={s.txnCard}>
          <View style={[s.txnIcon, { backgroundColor: txn.type === 'credit' ? '#DCFCE7' : '#FEE2E2' }]}>
            <Text style={s.txnArrow}>{txn.type === 'credit' ? '↓' : '↑'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.txnDesc} numberOfLines={1}>{txn.description}</Text>
            <Text style={s.txnDate}>
              {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[s.txnAmount, { color: txn.type === 'credit' ? C.green : C.red }]}>
              {txn.type === 'credit' ? '+' : '−'} ₹ {txn.amount.toLocaleString()}
            </Text>
            <Text style={[s.txnStatus, {
              color: txn.status === 'pending' ? C.amber
                   : txn.status === 'success' ? C.green
                   : C.red
            }]}>
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
  withdrawBtn: { flex: 1, backgroundColor: C.yellow, borderRadius: 10, padding: 11, alignItems: 'center' },
  withdrawBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  invoiceBtn: { flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 10, padding: 11, alignItems: 'center' },
  invoiceBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.cream },
  bankCard: { backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  bankIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center' },
  bankName: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  bankDetails: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  editBtn: { borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.15)' },
  editBtnText: { fontFamily: F.interBold, fontSize: 11, color: C.black },
  filtersRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  filterBtn: { flex: 1, minWidth: 60, backgroundColor: C.white, borderRadius: 20, paddingVertical: 7, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000' },
  filterBtnActive: { backgroundColor: '#f9be08', borderWidth: 2, borderColor: '#000', shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  filterBtnText: { fontFamily: F.barlow, fontSize: 12, color: C.black, includeFontPadding: false, textAlign: 'center' },
  filterBtnTextActive: { color: C.black },
  sectionTitle: { fontFamily: F.barlow, fontSize: 18, color: C.black },
  txnCard: { backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(3, 3), padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  txnIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txnArrow: { fontFamily: F.barlow, fontSize: 20, color: C.black },
  txnDesc: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  txnDate: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  txnAmount: { fontFamily: F.barlow, fontSize: 18 },
  txnStatus: { fontFamily: F.interBold, fontSize: 10, letterSpacing: 1 },
  empty: { alignItems: 'center', padding: 24 },
  emptyText: { fontFamily: F.barlow, fontSize: 18, color: C.black, marginBottom: 4 },
  emptySub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.4 },
})
