import React, { useState, useCallback, useEffect } from 'react'
import {
  View, Text, StyleSheet,
  FlatList, Modal, ScrollView, Image,
} from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import {
  ORDER_STATUS_META, ORDER_STATUS_FLOW, timeAgo,
  type VendorOrder, type OrderStatus,
} from '../../data/menuStore'
import { C, F, shadow } from '../../theme'
import { useVendor } from '../../context/VendorContext'
import { subscribeOrders, updateOrderStatus } from '../../../../backend/services/ordersService'
import { useFezuStore, DELIVERY_STATUS_META } from '../../context/FezuContext'

const FILTER_TABS: { id: OrderStatus | 'ALL'; label: string }[] = [
  { id: 'ALL',             label: 'All' },
  { id: 'NEW',             label: 'New' },
  { id: 'ACCEPTED',        label: 'Accepted' },
  { id: 'PREPARING',       label: 'Preparing' },
  { id: 'READY_FOR_PICKUP',label: 'Ready' },
  { id: 'COMPLETED',       label: 'Completed' },
  { id: 'CANCELLED',       label: 'Cancelled' },
]

const REJECT_REASONS = [
  'Item unavailable',
  'Kitchen overloaded',
  'Closing soon',
  'Other',
]

export default function OrdersScreen({
  setScreen,
  vendorOrders,
  setVendorOrders,
}: {
  setScreen: SetScreen
  vendorOrders: VendorOrder[]
  setVendorOrders: React.Dispatch<React.SetStateAction<VendorOrder[]>>
}) {
  const { vendor } = useVendor()
  const email = vendor?.email ?? ''
  const orders = vendorOrders
  const setOrders = setVendorOrders
  const { getOrderDelivery, triggerAssignment } = useFezuStore()

  // Real-time Firestore listener
  useEffect(() => {
    if (!email) return
    const unsub = subscribeOrders(email, (liveOrders) => {
      setOrders(liveOrders)
    })
    return unsub
  }, [email])

  // Trigger auto-assignment for any orders that are READY_FOR_PICKUP
  useEffect(() => {
    orders.forEach(o => {
      if (o.status === 'READY_FOR_PICKUP') {
        triggerAssignment(o.id)
      }
    })
  }, [orders, triggerAssignment])

  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [rejectTarget, setRejectTarget] = useState<VendorOrder | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  // ── counts ────────────────────────────────────────────────────────────────
  const newCount       = orders.filter(o => o.status === 'NEW').length
  const preparingCount = orders.filter(o => o.status === 'PREPARING').length
  const readyCount     = orders.filter(o => o.status === 'READY_FOR_PICKUP').length
  const completedCount = orders.filter(o => o.status === 'COMPLETED').length

  const displayed = activeFilter === 'ALL'
    ? orders
    : orders.filter(o => o.status === activeFilter)

  // ── advance order status ──────────────────────────────────────────────────
  const advanceOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      const flow = ORDER_STATUS_FLOW[o.status]
      if (!flow) return o
      const now = new Date().toISOString()
      const next = flow.next
      const timestamps: Partial<VendorOrder> = {}
      if (next === 'ACCEPTED')         timestamps.acceptedAt  = now
      if (next === 'PREPARING')        timestamps.preparingAt = now
      if (next === 'READY_FOR_PICKUP') {
        timestamps.readyAt = now
        triggerAssignment(orderId)
      }
      if (next === 'PICKED_UP')        timestamps.pickedUpAt  = now
      if (next === 'COMPLETED')        timestamps.completedAt = now
      // sync to Firestore
      if (email) updateOrderStatus(email, orderId, next, timestamps)
      return { ...o, status: next, ...timestamps }
    }))
  }, [email, triggerAssignment])

  const confirmReject = () => {
    if (!rejectTarget) return
    const id = rejectTarget.id
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, status: 'CANCELLED' as OrderStatus } : o
    ))
    // sync to Firestore
    if (email) updateOrderStatus(email, id, 'CANCELLED')
    setRejectTarget(null)
    setRejectReason('')
    showToast('Order cancelled')
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Orders</Text>
          <Text style={s.subtitle}>Manage incoming and active orders</Text>
        </View>
      </View>

      {/* Summary cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.summaryScroll} contentContainerStyle={s.summaryContent}>
        {[
          { label: 'New',       value: newCount,       bg: C.yellow,  textColor: C.black },
          { label: 'Preparing', value: preparingCount, bg: '#FEF3C7', textColor: C.amber },
          { label: 'Ready',     value: readyCount,     bg: '#DCFCE7', textColor: C.green },
          { label: 'Completed', value: completedCount, bg: C.cream,   textColor: '#888' },
        ].map(stat => (
          <View key={stat.label} style={[s.summaryCard, { backgroundColor: stat.bg }]}>
            <Text style={[s.summaryNum, { color: stat.textColor }]}>{stat.value}</Text>
            <Text style={[s.summaryLabel, { color: stat.textColor, opacity: 0.7 }]}>{stat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll} contentContainerStyle={s.filterContent}>
        {FILTER_TABS.map(t => {
          const active = activeFilter === t.id
          return (
            <TouchableOpacity key={t.id} onPress={() => setActiveFilter(t.id)} style={[s.filterTab, active && s.filterTabActive]}>
              <Text style={[s.filterTabText, active && s.filterTabTextActive]}>{t.label.toUpperCase()}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Order list */}
      {displayed.length === 0 ? (
        <View style={s.empty}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🛒</Text>
          <Text style={s.emptyTitle}>No orders right now</Text>
          <Text style={s.emptySub}>New orders will appear here automatically.</Text>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={displayed}
          keyExtractor={o => o.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: order }) => (
            <OrderCard
              order={order}
              delivery={getOrderDelivery(order.id)}
              isSelected={selectedOrderId === order.id}
              onPress={() => {
                setSelectedOrderId(order.id)
                setTimeout(() => {
                  setScreen('order_detail', { id: order.id })
                  setSelectedOrderId(null)
                }, 150)
              }}
              onAdvance={() => {
                if (ORDER_STATUS_FLOW[order.status]?.next === 'READY_FOR_PICKUP') {
                  advanceOrder(order.id)
                } else if (ORDER_STATUS_FLOW[order.status]?.action === 'Show Pickup QR') {
                  setScreen('order_qr', { id: order.id })
                } else {
                  advanceOrder(order.id)
                }
              }}
              onReject={() => setRejectTarget(order)}
            />
          )}
        />
      )}

      {/* Reject modal */}
      <Modal visible={!!rejectTarget} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Reject Order #{rejectTarget?.orderNumber}?</Text>
            <Text style={s.modalBody}>Select a reason for rejection:</Text>
            {REJECT_REASONS.map(r => (
              <TouchableOpacity
                key={r}
                style={[s.reasonBtn, rejectReason === r && s.reasonBtnActive]}
                onPress={() => setRejectReason(r)}
              >
                <Text style={[s.reasonBtnText, rejectReason === r && s.reasonBtnTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => { setRejectTarget(null); setRejectReason('') }}>
                <Text style={s.cancelBtnText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.rejectConfirmBtn, !rejectReason && s.rejectConfirmBtnDisabled]}
                onPress={confirmReject}
                disabled={!rejectReason}
              >
                <Text style={s.rejectConfirmBtnText}>REJECT ORDER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {!!toast && (
        <View style={s.toast}><Text style={s.toastText}>{toast}</Text></View>
      )}
    </View>
  )
}

// ─── OrderCard ────────────────────────────────────────────────────────────────

function OrderCard({
  order, delivery, isSelected, onPress, onAdvance, onReject,
}: {
  order: VendorOrder
  delivery: ReturnType<ReturnType<typeof useFezuStore>['getOrderDelivery']>
  isSelected?: boolean
  onPress: () => void
  onAdvance: () => void
  onReject: () => void
}) {
  const meta = ORDER_STATUS_META[order.status]
  const flow = ORDER_STATUS_FLOW[order.status]

  // Delivery chip — show for orders that have a non-idle delivery
  const showDeliveryChip = delivery.deliveryStatus !== 'IDLE'
  const delivMeta = showDeliveryChip ? DELIVERY_STATUS_META[delivery.deliveryStatus] : null

  return (
    <TouchableOpacity style={[oc.card, isSelected && oc.cardActive]} onPress={onPress} activeOpacity={0.85}>
      {/* Card header */}
      <View style={oc.cardHeader}>
        <View style={oc.orderNumRow}>
          <Text style={oc.orderId}>Order #{order.orderNumber}</Text>
          <Text style={oc.timeAgo}>{timeAgo(order.createdAt)}</Text>
        </View>
        <View style={[oc.statusChip, { backgroundColor: meta.bg }]}>
          <Text style={[oc.statusChipText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={oc.divider} />

      {/* Items */}
      <View style={oc.itemsBlock}>
        {order.items.map((item, index) => {
          const isUri = item.imageUri && (item.imageUri.startsWith('http') || item.imageUri.startsWith('file') || item.imageUri.startsWith('content'))

          return (
            <View key={item.menuItemId + '_' + index} style={oc.itemRow}>
              <View style={oc.itemImageBox}>
                {isUri ? (
                  <Image source={{ uri: item.imageUri }} style={oc.itemImage} resizeMode="cover" />
                ) : (
                  <Text style={oc.itemEmoji}>{item.imageUri || '🍽️'}</Text>
                )}
              </View>
              <Text style={oc.itemName}>{item.quantity} × {item.name}</Text>
              <Text style={oc.itemPrice}>₹{item.subtotal}</Text>
            </View>
          )
        })}
      </View>

      {/* Divider */}
      <View style={oc.divider} />

      {/* Footer */}
      <View style={oc.footer}>
        <View style={oc.footerLeft}>
          <Text style={oc.customerName}>{order.customerName}</Text>
          <Text style={oc.footerMeta}>
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.paymentStatus === 'PAID' ? '✅ Paid' : order.paymentStatus === 'COD' ? '💵 COD' : '⏳ Pending'}
          </Text>
        </View>
        <Text style={oc.total}>₹{order.total}</Text>
      </View>

      {/* Delivery chip */}
      {showDeliveryChip && delivMeta && (
        <View style={[oc.delivChip, { backgroundColor: delivMeta.bg }]}>
          <Text style={[oc.delivChipText, { color: delivMeta.color }]}>
            {delivMeta.icon}  {
              delivery.deliveryStatus === 'SEARCHING_FOR_RIDER'
                ? 'Searching rider…'
                : delivery.deliveryStatus === 'RIDER_ASSIGNED' && delivery.assignedRiderDetails
                ? `${delivery.assignedRiderDetails.name.split(' ')[0]} · ${delivery.assignedRiderDetails.etaMinutes}m ETA`
                : delivMeta.label
            }
          </Text>
        </View>
      )}

      {/* Action buttons */}
      {flow && (
        <View style={oc.actions}>
          {order.status === 'NEW' && (
            <TouchableOpacity style={oc.rejectBtn} onPress={e => { e.stopPropagation?.(); onReject() }}>
              <Text style={oc.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={oc.actionBtn} onPress={e => { e.stopPropagation?.(); onAdvance() }}>
            <Text style={oc.actionBtnText}>{flow.action} →</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  )
}

const oc = StyleSheet.create({
  card: { backgroundColor: C.white, borderRadius: 14, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000000', ...shadow(4, 4), overflow: 'hidden' },
  cardActive: { backgroundColor: '#f9be08', borderWidth: 2, borderColor: '#000000', ...shadow(4, 4) },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, paddingBottom: 10 },
  orderNumRow: { gap: 4 },
  orderId: { fontFamily: F.barlow, fontSize: 18, color: C.black },
  timeAgo: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.4 },
  statusChip: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  statusChipText: { fontFamily: F.barlow, fontSize: 12 },
  divider: { height: 1.5, backgroundColor: 'rgba(0,0,0,0.06)', marginHorizontal: 14 },
  itemsBlock: { paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemImageBox: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%' },
  itemEmoji: { fontSize: 13 },
  itemName: { fontFamily: F.inter, fontSize: 13, color: C.black, flex: 1 },
  itemPrice: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  footerLeft: { gap: 2 },
  customerName: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  footerMeta: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  total: { fontFamily: F.barlow, fontSize: 22, color: C.black },
  actions: { flexDirection: 'row', gap: 8, padding: 12, paddingTop: 0 },
  rejectBtn: { flex: 1, backgroundColor: '#FEE2E2', borderRadius: 10, padding: 11, alignItems: 'center' },
  rejectBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.red },
  actionBtn: { flex: 2, backgroundColor: C.yellow, borderRadius: 10, padding: 11, alignItems: 'center', ...shadow(3, 3) },
  actionBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  delivChip: { marginHorizontal: 12, marginBottom: 6, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  delivChipText: { fontFamily: F.interBold, fontSize: 11 },
})

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { padding: 20, paddingBottom: 12 },
  title: { fontFamily: F.barlow, fontSize: 28, color: C.black },
  subtitle: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45 },
  summaryScroll: { flexGrow: 0 },
  summaryContent: { paddingHorizontal: 20, gap: 10, paddingBottom: 12 },
  summaryCard: { borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center', minWidth: 80, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(3, 3) },
  summaryNum: { fontFamily: F.barlow, fontSize: 28, lineHeight: 30 },
  summaryLabel: { fontFamily: F.interBold, fontSize: 11 },
  filterScroll: { flexGrow: 0 },
  filterContent: { paddingHorizontal: 20, gap: 6, paddingBottom: 12, alignItems: 'center' },
  filterTab: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000000', flexShrink: 0, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  filterTabActive: { backgroundColor: '#f9be08', borderWidth: 2, borderColor: '#000000', shadowColor: '#000000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  filterTabText: { fontFamily: F.barlow, fontSize: 12, color: C.black, includeFontPadding: false, textAlign: 'center' },
  filterTabTextActive: { color: '#000000' },
  list: { paddingHorizontal: 20, paddingBottom: 28, gap: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginBottom: 6 },
  emptySub: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.4, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: C.cream, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
  modalTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginBottom: 6 },
  modalBody: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.5, marginBottom: 14 },
  reasonBtn: { backgroundColor: C.white, borderRadius: 10, padding: 12, paddingHorizontal: 16, marginBottom: 8, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)' },
  reasonBtnActive: { backgroundColor: C.yellow, borderColor: C.yellow, ...shadow(2, 2) },
  reasonBtnText: { fontFamily: F.inter, fontSize: 13, color: C.black },
  reasonBtnTextActive: { fontFamily: F.interBold },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, backgroundColor: C.white, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: 13, alignItems: 'center' },
  cancelBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  rejectConfirmBtn: { flex: 1, backgroundColor: C.red, borderRadius: 12, padding: 13, alignItems: 'center', ...shadow(3, 3) },
  rejectConfirmBtnDisabled: { backgroundColor: '#ddd', shadowOpacity: 0 },
  rejectConfirmBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.white },
  toast: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: C.black, borderRadius: 12, padding: 14, alignItems: 'center', ...shadow(3, 3, C.yellow) },
  toastText: { fontFamily: F.interBold, fontSize: 13, color: C.yellow },
})
