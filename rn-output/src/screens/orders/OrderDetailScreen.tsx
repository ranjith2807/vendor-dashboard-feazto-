import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, Image } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { C, F, shadow } from '../../theme'
import { DEFAULT_ORDERS, type VendorOrder, type OrderStatus } from '../../data/menuStore'

const STATUS_SEQ: OrderStatus[] = ['NEW', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'COMPLETED']

const STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: 'NEW',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY FOR PICKUP',
  PICKED_UP: 'PICKED UP',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  NEW: C.yellow,
  ACCEPTED: C.blue,
  PREPARING: C.amber,
  READY_FOR_PICKUP: C.green,
  PICKED_UP: C.purple,
  COMPLETED: C.teal,
  CANCELLED: C.red,
}

const NEXT_ACTION: Partial<Record<OrderStatus, string>> = {
  NEW: 'Accept Order',
  ACCEPTED: 'Start Preparing',
  PREPARING: 'Mark Ready',
  READY_FOR_PICKUP: 'Show Pickup QR',
  PICKED_UP: 'Confirm Pickup',
}

const REJECT_REASONS = [
  { id: 'rr_001', label: 'Kitchen too busy right now' },
  { id: 'rr_002', label: 'Ingredients not available' },
  { id: 'rr_003', label: 'Kitchen closed' },
  { id: 'rr_004', label: 'Order too large' },
]

export default function OrderDetailScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const [orders, setOrders] = useState<VendorOrder[]>(DEFAULT_ORDERS)
  const [showReject, setShowReject] = useState(false)
  const [rejReason, setRejReason] = useState('')

  const orderId = navParams.id ?? DEFAULT_ORDERS[0]?.id
  const order = orders.find(o => o.id === orderId)

  if (!order) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.cream }}>
        <Text style={{ fontFamily: F.inter, fontSize: 14 }}>Order not found</Text>
        <TouchableOpacity style={s.backHomeBtn} onPress={() => setScreen('orders')}>
          <Text style={s.backHomeBtnText}>BACK TO ORDERS</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const seqIdx = STATUS_SEQ.indexOf(order.status)
  const nextStatus = STATUS_SEQ[seqIdx + 1]
  const statusColor = STATUS_COLOR[order.status] ?? '#888'

  const advance = () => {
    if (order.status === 'READY_FOR_PICKUP') {
      setScreen('order_qr', { id: order.id })
      return
    }
    if (order.status === 'PICKED_UP') {
      setOrders(p => p.map(o => o.id === order.id ? { ...o, status: 'COMPLETED' as OrderStatus, completedAt: new Date().toISOString() } : o))
      return
    }
    if (!nextStatus) return
    const now = new Date().toISOString()
    const timestamps: Partial<VendorOrder> = {}
    if (nextStatus === 'ACCEPTED') timestamps.acceptedAt = now
    if (nextStatus === 'PREPARING') timestamps.preparingAt = now
    if (nextStatus === 'READY_FOR_PICKUP') timestamps.readyAt = now

    setOrders(p => p.map(o => o.id === order.id ? { ...o, status: nextStatus, ...timestamps } : o))
  }

  const reject = () => {
    setOrders(p => p.map(o => o.id === order.id ? { ...o, status: 'CANCELLED' as OrderStatus } : o))
    setShowReject(false)
  }

  const initials = order.customerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
  const timelineCount = Math.max(seqIdx + 2, 2)

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('orders')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Order #{order.orderNumber}</Text>
          <Text style={s.sub}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={[s.statusBadgeText, { color: ['NEW', 'READY_FOR_PICKUP'].includes(order.status) ? C.black : C.white }]}>
            {STATUS_LABEL[order.status]}
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Customer card */}
        <View style={s.card}>
          <Text style={s.cardLabel}>CUSTOMER</Text>
          <View style={s.customerRow}>
            <View style={s.avatar}><Text style={s.avatarText}>{initials.toUpperCase()}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.customerName}>{order.customerName}</Text>
              <Text style={s.customerPhone}>{order.customerPhone || 'No phone provided'}</Text>
            </View>
            <View style={s.callBtn}>
              <Text style={{ fontSize: 18, color: C.black }}>📞</Text>
            </View>
          </View>
          <View style={s.addressRow}>
            <Text style={{ fontSize: 12 }}>📍</Text>
            <Text style={s.addressText}>{order.address}</Text>
          </View>
        </View>

        {/* Items card */}
        <View style={s.card}>
          <Text style={s.cardLabel}>ORDER ITEMS</Text>
          {order.items.map((item, i) => {
            const isUri = item.imageUri && (item.imageUri.startsWith('http') || item.imageUri.startsWith('file') || item.imageUri.startsWith('content'))

            return (
              <View key={item.menuItemId + '_' + i} style={[s.itemRow, i < order.items.length - 1 && s.itemRowBorder]}>
                <View style={s.qtyBadge}><Text style={s.qtyText}>{item.quantity}×</Text></View>
                
                <View style={s.itemRowImage}>
                  {isUri ? (
                    <Image source={{ uri: item.imageUri }} style={s.itemImage} resizeMode="cover" />
                  ) : (
                    <Text style={s.itemEmoji}>{item.imageUri || '🍽️'}</Text>
                  )}
                </View>

                <Text style={s.itemName}>{item.name}</Text>
                <Text style={s.itemPrice}>₹{item.subtotal.toLocaleString()}</Text>
              </View>
            )
          })}
          
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>₹{order.total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Timeline card */}
        <View style={s.card}>
          <Text style={s.cardLabel}>ORDER TIMELINE</Text>
          {STATUS_SEQ.slice(0, timelineCount).map((statusKey, i) => {
            const done = i <= seqIdx
            const current = i === seqIdx
            const color = STATUS_COLOR[statusKey] ?? '#888'
            const isLast = i >= Math.min(seqIdx + 1, STATUS_SEQ.length - 1)
            return (
              <View key={statusKey} style={[s.timelineRow, !isLast && s.timelineRowGap]}>
                {!isLast && (
                  <View style={[s.timelineLine, { backgroundColor: done ? color : 'rgba(0,0,0,0.1)' }]} />
                )}
                <View style={[s.timelineDot, { backgroundColor: done ? color : C.white, borderColor: done ? color : '#ddd' }]}>
                  {done && <Text style={s.timelineDotCheck}>✓</Text>}
                </View>
                <View style={{ paddingTop: 2 }}>
                  <Text style={[s.timelineLabel, { opacity: done ? 1 : 0.35, fontFamily: current ? F.interBold : F.inter }]}>
                    {STATUS_LABEL[statusKey]}
                  </Text>
                  {current && <Text style={[s.timelineNow, { color: statusColor }]}>● Now</Text>}
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>

      {/* Action bar */}
      {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
        <View style={s.actionBar}>
          {order.status === 'NEW' && (
            <TouchableOpacity style={s.rejectBtn} onPress={() => setShowReject(true)}>
              <Text style={s.rejectBtnText}>REJECT</Text>
            </TouchableOpacity>
          )}
          {NEXT_ACTION[order.status] && (
            <TouchableOpacity style={s.advanceBtn} onPress={advance}>
              <Text style={s.advanceBtnText}>{NEXT_ACTION[order.status]} →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Reject modal */}
      <Modal visible={showReject} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Rejection Reason</Text>
            {REJECT_REASONS.map(r => (
              <TouchableOpacity
                key={r.id}
                onPress={() => setRejReason(r.id)}
                style={[s.reasonBtn, rejReason === r.id && s.reasonBtnActive]}
              >
                <Text style={[s.reasonBtnText, rejReason === r.id && s.reasonBtnTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={s.modalActions}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setShowReject(false)}>
                <Text style={s.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalConfirm, !rejReason && s.modalConfirmDisabled]}
                onPress={reject}
                disabled={!rejReason}
              >
                <Text style={s.modalConfirmText}>CONFIRM REJECT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 22, color: C.black },
  sub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  statusBadgeText: { fontFamily: F.barlow, fontSize: 11 },
  body: { paddingHorizontal: 20, paddingBottom: 100, gap: 10 },
  card: { backgroundColor: C.white, borderRadius: 14, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(4, 4), padding: 14 },
  cardLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.35, marginBottom: 10 },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  customerName: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  customerPhone: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.5 },
  callBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.green, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#000', alignItems: 'center', justifyContent: 'center' },
  addressRow: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', backgroundColor: C.cream, borderRadius: 8, padding: 10 },
  addressText: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.65, flex: 1 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  itemRowBorder: { borderBottomWidth: 1.5, borderBottomColor: 'rgba(0,0,0,0.08)' },
  qtyBadge: { width: 26, height: 26, borderRadius: 6, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  qtyText: { fontFamily: F.barlow, fontSize: 12, color: C.black },
  itemRowImage: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginRight: 8, overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%' },
  itemEmoji: { fontSize: 16 },
  itemName: { fontFamily: F.inter, fontSize: 13, color: C.black, flex: 1 },
  itemPrice: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1.5, borderTopColor: 'rgba(0,0,0,0.1)', marginTop: 10, paddingTop: 10 },
  totalLabel: { fontFamily: F.barlow, fontSize: 18, color: C.black },
  totalValue: { fontFamily: F.barlow, fontSize: 22, color: C.black },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, position: 'relative' },
  timelineRowGap: { paddingBottom: 14 },
  timelineLine: { position: 'absolute', left: 11, top: 22, width: 2, bottom: 0 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 },
  timelineDotCheck: { fontSize: 11, color: C.white, fontFamily: F.interBold },
  timelineLabel: { fontSize: 12, color: C.black },
  timelineNow: { fontFamily: F.interBold, fontSize: 10 },
  actionBar: { backgroundColor: C.white, padding: 12, paddingHorizontal: 20, flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, backgroundColor: C.red, borderRadius: 10, padding: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', alignItems: 'center', ...shadow(3, 3) },
  rejectBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.white },
  advanceBtn: { flex: 2, backgroundColor: C.yellow, borderRadius: 10, padding: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', alignItems: 'center', ...shadow(3, 3) },
  advanceBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: C.cream, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32 },
  modalTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginBottom: 14 },
  reasonBtn: { backgroundColor: C.white, borderRadius: 10, padding: 12, paddingHorizontal: 14, marginBottom: 8, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderTopWidth: 0, borderLeftWidth: 0, borderColor: '#000' },
  reasonBtnActive: { backgroundColor: C.yellow, borderColor: C.black, ...shadow(3, 3) },
  reasonBtnText: { fontFamily: F.inter, fontSize: 13, color: C.black },
  reasonBtnTextActive: { fontFamily: F.interBold },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalCancel: { flex: 1, backgroundColor: C.white, borderRadius: 10, padding: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderTopWidth: 0, borderLeftWidth: 0, borderColor: '#000', alignItems: 'center', ...shadow(3, 3) },
  modalCancelText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  modalConfirm: { flex: 2, backgroundColor: C.red, borderRadius: 10, padding: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', alignItems: 'center', ...shadow(3, 3) },
  modalConfirmDisabled: { backgroundColor: '#ddd', shadowOpacity: 0 },
  modalConfirmText: { fontFamily: F.barlow, fontSize: 15, color: C.white },
  backHomeBtn: { backgroundColor: C.yellow, borderRadius: 10, padding: 12, paddingHorizontal: 20, marginTop: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(3, 3) },
  backHomeBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.black },
})
