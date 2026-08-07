import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, Image, Animated, Easing } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { C, F, shadow } from '../../theme'
import { type VendorOrder, type OrderStatus } from '../../data/menuStore'
import { useFezuStore, DELIVERY_STATUS_META } from '../../context/FezuContext'
import { useVendor } from '../../context/VendorContext'
import { updateOrderStatus } from '../../lib/ordersDb'

const STATUS_SEQ: OrderStatus[] = [
  'NEW', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'COMPLETED',
]

const STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: 'NEW', ACCEPTED: 'ACCEPTED', PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY FOR PICKUP', PICKED_UP: 'PICKED UP',
  COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED',
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  NEW: C.yellow, ACCEPTED: C.blue, PREPARING: C.amber,
  READY_FOR_PICKUP: C.green, PICKED_UP: C.purple,
  COMPLETED: C.teal, CANCELLED: C.red,
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

export default function OrderDetailScreen({
  setScreen,
  navParams,
  vendorOrders,
  setVendorOrders,
}: {
  setScreen: SetScreen
  navParams: NavParams
  vendorOrders: VendorOrder[]
  setVendorOrders: React.Dispatch<React.SetStateAction<VendorOrder[]>>
  menuItems: any[]
  setMenuItems: any
}) {
  const { vendor } = useVendor()
  const email = vendor?.email ?? ''
  const { getOrderDelivery, triggerAssignment, retryAssignment } = useFezuStore()

  const [showReject, setShowReject] = useState(false)
  const [rejReason, setRejReason] = useState('')

  const orderId = navParams.id ?? vendorOrders[0]?.id
  const order   = vendorOrders.find(o => o.id === orderId)

  // Delivery state from FezuContext
  const delivery = getOrderDelivery(orderId ?? '')

  // Trigger assignment when order becomes READY_FOR_PICKUP
  useEffect(() => {
    if (order?.status === 'READY_FOR_PICKUP') {
      triggerAssignment(orderId ?? '')
    }
  }, [order?.status])

  // Elapsed search timer
  const [searchElapsed, setSearchElapsed] = useState(0)
  useEffect(() => {
    if (delivery.deliveryStatus !== 'SEARCHING_FOR_RIDER') { setSearchElapsed(0); return }
    const id = setInterval(() => setSearchElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [delivery.deliveryStatus])

  // Pulse animation for searching state
  const pulse = useRef(new Animated.Value(1)).current
  useEffect(() => {
    if (delivery.deliveryStatus !== 'SEARCHING_FOR_RIDER') return
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulse, { toValue: 1,   duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ]),
    )
    anim.start()
    return () => anim.stop()
  }, [delivery.deliveryStatus])

  if (!order) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.cream }}>
        <Text style={{ fontFamily: F.inter, fontSize: 14 }}>Order not found</Text>
        <TouchableOpacity style={s.backBtn} onPress={() => setScreen('orders')}>
          <Text style={s.backBtnText}>BACK TO ORDERS</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const seqIdx     = STATUS_SEQ.indexOf(order.status)
  const statusColor = STATUS_COLOR[order.status] ?? '#888'
  const initials    = order.customerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)

  // ── Advance order status ──────────────────────────────────────────────────
  const advance = () => {
    if (order.status === 'READY_FOR_PICKUP') {
      setScreen('order_qr', { id: order.id })
      return
    }
    const next = STATUS_SEQ[seqIdx + 1]
    if (!next) return
    const now = new Date().toISOString()
    const ts: Partial<VendorOrder> = {}
    if (next === 'ACCEPTED')         ts.acceptedAt  = now
    if (next === 'PREPARING')        ts.preparingAt = now
    if (next === 'READY_FOR_PICKUP') ts.readyAt     = now
    if (next === 'PICKED_UP')        ts.pickedUpAt  = now
    if (next === 'COMPLETED')        ts.completedAt = now

    setVendorOrders(prev => prev.map(o =>
      o.id === order.id ? { ...o, status: next, ...ts } : o,
    ))
    if (email) updateOrderStatus(email, order.id, next, ts)
  }

  const reject = () => {
    setVendorOrders(prev => prev.map(o =>
      o.id === order.id ? { ...o, status: 'CANCELLED' as OrderStatus } : o,
    ))
    if (email) updateOrderStatus(email, order.id, 'CANCELLED')
    setShowReject(false)
  }

  // ── Delivery section: is this order delivery-eligible? ───────────────────
  const isDeliveryEligible = !['NEW', 'ACCEPTED', 'PREPARING', 'CANCELLED'].includes(order.status)
  const showDelivery = isDeliveryEligible && delivery.deliveryStatus !== 'IDLE'
  const delivMeta = delivery.deliveryStatus !== 'IDLE'
    ? DELIVERY_STATUS_META[delivery.deliveryStatus]
    : null

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('orders')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Order #{order.orderNumber}</Text>
          <Text style={s.sub}>
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </Text>
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
              <Text style={s.customerPhone}>{order.customerPhone ?? 'No phone'}</Text>
            </View>
            <View style={s.callBtn}><Text style={{ fontSize: 18 }}>📞</Text></View>
          </View>
          <View style={s.addressRow}>
            <Text style={{ fontSize: 12 }}>📍</Text>
            <Text style={s.addressText}>{order.address}</Text>
          </View>
        </View>

        {/* Items */}
        <View style={s.card}>
          <Text style={s.cardLabel}>ORDER ITEMS</Text>
          {order.items.map((item, i) => {
            const isUri = item.imageUri && (item.imageUri.startsWith('http') || item.imageUri.startsWith('data:') || item.imageUri.startsWith('file'))
            return (
              <View key={item.menuItemId + '_' + i} style={[s.itemRow, i < order.items.length - 1 && s.itemRowBorder]}>
                <View style={s.qtyBadge}><Text style={s.qtyText}>{item.quantity}×</Text></View>
                <View style={s.itemImgBox}>
                  {isUri ? (
                    <Image source={{ uri: item.imageUri }} style={s.itemImg} resizeMode="cover" />
                  ) : (
                    <Text style={s.itemEmoji}>{item.imageUri || '🍽️'}</Text>
                  )}
                </View>
                <Text style={s.itemName}>{item.name}</Text>
                <Text style={s.itemPrice}>₹{item.subtotal}</Text>
              </View>
            )
          })}
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>₹{order.total}</Text>
          </View>
        </View>

        {/* ── FEZU Delivery section ─────────────────────────────────────── */}
        {isDeliveryEligible && (
          <View style={s.card}>
            <Text style={s.cardLabel}>FEZU DELIVERY</Text>

            {/* SEARCHING */}
            {delivery.deliveryStatus === 'SEARCHING_FOR_RIDER' && (
              <View style={s.searchingWrap}>
                <Animated.Text style={[s.searchingIcon, { opacity: pulse }]}>🔍</Animated.Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.searchingTitle}>Finding a nearby rider…</Text>
                  <Text style={s.searchingTimer}>{searchElapsed}s elapsed</Text>
                </View>
              </View>
            )}

            {/* NO RIDER */}
            {delivery.deliveryStatus === 'NO_RIDER' && (
              <View style={s.noRiderWrap}>
                <Text style={s.noRiderIcon}>⚠️</Text>
                <Text style={s.noRiderTitle}>No rider available nearby</Text>
                <Text style={s.noRiderSub}>All FEZU riders are busy or offline right now.</Text>
                <TouchableOpacity
                  style={s.retryBtn}
                  onPress={() => retryAssignment(orderId ?? '')}
                >
                  <Text style={s.retryBtnText}>↻ Retry Search</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* RIDER ASSIGNED or in-progress */}
            {delivery.deliveryStatus !== 'SEARCHING_FOR_RIDER' &&
             delivery.deliveryStatus !== 'NO_RIDER' &&
             delivery.deliveryStatus !== 'IDLE' &&
             delivery.assignedRiderDetails && delivMeta && (
              <>
                {/* Status pill */}
                <View style={[s.delivStatusPill, { backgroundColor: delivMeta.bg }]}>
                  <Text style={[s.delivStatusText, { color: delivMeta.color }]}>
                    {delivMeta.icon}  {delivMeta.label}
                  </Text>
                </View>

                {/* Rider card */}
                <View style={s.riderCard}>
                  <View style={[s.riderAvatar, { backgroundColor: C.green }]}>
                    <Text style={s.riderAvatarText}>
                      {delivery.assignedRiderDetails.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.riderName}>{delivery.assignedRiderDetails.name}</Text>
                    <Text style={s.riderVehicle}>
                      {delivery.assignedRiderDetails.vehicleType} · {delivery.assignedRiderDetails.vehicleNumber}
                    </Text>
                    <Text style={s.riderRating}>
                      ★ {delivery.assignedRiderDetails.rating}
                    </Text>
                  </View>
                  <View style={s.riderEtaBox}>
                    <Text style={s.riderEtaKm}>{delivery.assignedRiderDetails.distanceKm} km</Text>
                    <Text style={s.riderEtaMin}>{delivery.assignedRiderDetails.etaMinutes} min ETA</Text>
                  </View>
                </View>

                {/* Call button */}
                <TouchableOpacity style={s.callRiderBtn}>
                  <Text style={s.callRiderBtnText}>📞 Call {delivery.assignedRiderDetails.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              </>
            )}

            {/* IDLE — delivery not yet triggered */}
            {delivery.deliveryStatus === 'IDLE' && (
              <Text style={s.idleNote}>
                Delivery assignment will start automatically when the order is marked Ready.
              </Text>
            )}
          </View>
        )}

        {/* For completed/cancelled — show who delivered */}
        {order.status === 'COMPLETED' && delivery.assignedRiderDetails && (
          <View style={[s.card, { backgroundColor: '#DCFCE7' }]}>
            <Text style={[s.cardLabel, { color: C.green }]}>DELIVERED BY</Text>
            <Text style={s.deliveredBy}>
              🚴  {delivery.assignedRiderDetails.name} · {delivery.assignedRiderDetails.vehicleType}
            </Text>
          </View>
        )}

        {/* Timeline */}
        <View style={s.card}>
          <Text style={s.cardLabel}>ORDER TIMELINE</Text>
          {STATUS_SEQ.slice(0, Math.max(seqIdx + 2, 2)).map((statusKey, i) => {
            const done    = i <= seqIdx
            const current = i === seqIdx
            const color   = STATUS_COLOR[statusKey] ?? '#888'
            const isLast  = i >= Math.min(seqIdx + 1, STATUS_SEQ.length - 1)
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
          {/* READY_FOR_PICKUP: show QR instead — rider is auto-assigned */}
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
                <Text style={s.modalConfirmText}>CONFIRM</Text>
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
  card: { backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 14 },
  cardLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.35, marginBottom: 10 },

  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  customerName: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  customerPhone: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.5 },
  callBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  addressRow: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', backgroundColor: '#F9FAFB', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  addressText: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.65, flex: 1 },

  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  itemRowBorder: { borderBottomWidth: 1.5, borderBottomColor: 'rgba(0,0,0,0.08)' },
  qtyBadge: { width: 26, height: 26, borderRadius: 6, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  qtyText: { fontFamily: F.barlow, fontSize: 12, color: C.black },
  itemImgBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 8, overflow: 'hidden' },
  itemImg: { width: '100%', height: '100%' },
  itemEmoji: { fontSize: 16 },
  itemName: { fontFamily: F.inter, fontSize: 13, color: C.black, flex: 1 },
  itemPrice: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1.5, borderTopColor: 'rgba(0,0,0,0.1)', marginTop: 10, paddingTop: 10 },
  totalLabel: { fontFamily: F.barlow, fontSize: 18, color: C.black },
  totalValue: { fontFamily: F.barlow, fontSize: 22, color: C.black },

  // Delivery section
  searchingWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FEF3C7', borderRadius: 10, padding: 12 },
  searchingIcon: { fontSize: 28 },
  searchingTitle: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  searchingTimer: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5, marginTop: 2 },

  noRiderWrap: { backgroundColor: '#FEE2E2', borderRadius: 10, padding: 14, alignItems: 'center', gap: 6 },
  noRiderIcon: { fontSize: 28 },
  noRiderTitle: { fontFamily: F.barlow, fontSize: 18, color: C.red },
  noRiderSub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.6, textAlign: 'center' },
  retryBtn: { backgroundColor: C.red, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 9, marginTop: 4, ...shadow(3, 3) },
  retryBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.white },

  delivStatusPill: { borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: 10 },
  delivStatusText: { fontFamily: F.barlow, fontSize: 15, letterSpacing: 0.5 },

  riderCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', marginBottom: 10 },
  riderAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  riderAvatarText: { fontFamily: F.barlow, fontSize: 16, color: C.white },
  riderName: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  riderVehicle: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  riderRating: { fontFamily: F.inter, fontSize: 11, color: C.amber },
  riderEtaBox: { alignItems: 'flex-end' },
  riderEtaKm: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  riderEtaMin: { fontFamily: F.inter, fontSize: 10, color: C.black, opacity: 0.5 },
  callRiderBtn: { backgroundColor: C.green, borderRadius: 10, padding: 10, alignItems: 'center', ...shadow(3, 3) },
  callRiderBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.white },

  idleNote: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45, lineHeight: 18 },
  deliveredBy: { fontFamily: F.interBold, fontSize: 14, color: '#166534' },

  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, position: 'relative' },
  timelineRowGap: { paddingBottom: 14 },
  timelineLine: { position: 'absolute', left: 11, top: 22, width: 2, bottom: 0 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 },
  timelineDotCheck: { fontSize: 11, color: C.white, fontFamily: F.interBold },
  timelineLabel: { fontSize: 12, color: C.black },
  timelineNow: { fontFamily: F.interBold, fontSize: 10, marginTop: 1 },

  actionBar: { backgroundColor: C.white, padding: 12, paddingHorizontal: 20, flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, backgroundColor: C.red, borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  rejectBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.white },
  advanceBtn: { flex: 2, backgroundColor: C.yellow, borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  advanceBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: C.cream, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32 },
  modalTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginBottom: 14 },
  reasonBtn: { backgroundColor: C.white, borderRadius: 10, padding: 12, paddingHorizontal: 14, marginBottom: 8 },
  reasonBtnActive: { backgroundColor: C.yellow, ...shadow(3, 3) },
  reasonBtnText: { fontFamily: F.inter, fontSize: 13, color: C.black },
  reasonBtnTextActive: { fontFamily: F.interBold },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalCancel: { flex: 1, backgroundColor: C.white, borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  modalCancelText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  modalConfirm: { flex: 2, backgroundColor: C.red, borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  modalConfirmDisabled: { backgroundColor: '#ddd', shadowOpacity: 0 },
  modalConfirmText: { fontFamily: F.barlow, fontSize: 15, color: C.white },

  backBtn: { backgroundColor: C.yellow, borderRadius: 10, padding: 12, paddingHorizontal: 20, marginTop: 12, ...shadow(3, 3) },
  backBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.black },
})
