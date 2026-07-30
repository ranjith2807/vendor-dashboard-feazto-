import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { C, F, shadow } from '../../theme'
import { DEFAULT_ORDERS } from '../../data/menuStore'

export default function OrderQRScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const orderId = navParams.id ?? 'vord_003'
  const order = DEFAULT_ORDERS.find(o => o.id === orderId) ?? DEFAULT_ORDERS[0]
  const pickupCode = String((parseInt(orderId.replace(/\D/g, '') || '1001', 10) * 7 + 123456) % 1000000).padStart(6, '0')

  const [seconds, setSeconds] = useState(300)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (verified) return
    const t = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [verified])

  const mins = Math.floor(seconds / 60)
  const secs = String(seconds % 60).padStart(2, '0')

  const handleConfirm = () => {
    // Update in-memory order status
    const idx = DEFAULT_ORDERS.findIndex(o => o.id === orderId)
    if (idx !== -1) {
      DEFAULT_ORDERS[idx] = { ...DEFAULT_ORDERS[idx], status: 'PICKED_UP', pickedUpAt: new Date().toISOString() }
    }
    setVerified(true)
  }

  if (verified) return (
    <View style={s.verified}>
      <View style={s.verifiedIcon}><Text style={{ fontSize: 36, color: C.white }}>✓</Text></View>
      <Text style={s.verifiedTitle}>Pickup Verified!</Text>
      <Text style={s.verifiedSub}>Rider has picked up the order. Out for delivery.</Text>
      <TouchableOpacity style={s.trackBtn} onPress={() => setScreen('fezu')}>
        <Text style={s.trackBtnText}>TRACK LIVE DELIVERY →</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('order_detail', { id: orderId })}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Pickup QR</Text>
          <Text style={s.sub}>Order #{order?.orderNumber ?? '1001'}</Text>
        </View>
      </View>

      {/* QR Card */}
      <View style={s.qrCard}>
        <Text style={s.qrLabel}>SHOW THIS TO THE FEZU RIDER</Text>
        <View style={s.qrBox}>
          <View style={s.qrGrid}>
            {Array.from({ length: 7 }, (_, r) =>
              Array.from({ length: 7 }, (_, c) => {
                const corner = (r === 0 || r === 6) || (c === 0 || c === 6)
                const inner = r > 1 && r < 5 && c > 1 && c < 5
                return <View key={`qr_${r}_${c}`} style={[s.qrCell, (corner || inner) && s.qrCellFilled]} />
              })
            )}
          </View>
          <View style={s.qrOverlay}><Text style={s.qrEmoji}>🏪</Text></View>
        </View>
        <Text style={s.codeLabel}>PICKUP CODE</Text>
        <Text style={s.code}>{pickupCode}</Text>
        <View style={s.timerRow}>
          <View style={[s.dot, { backgroundColor: seconds > 60 ? C.green : C.red }]} />
          <Text style={[s.timerText, { color: seconds > 60 ? C.green : C.red }]}>
            {seconds === 0 ? 'QR Expired' : `Expires in ${mins}:${secs}`}
          </Text>
        </View>
      </View>

      {/* Rider strip */}
      <View style={s.riderCard}>
        <View style={s.riderIcon}><Text style={{ fontSize: 18 }}>🚴</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.riderName}>{order?.rider?.name ?? 'Muthu Kumar'}</Text>
          <Text style={s.riderSub}>
            Arriving in ~{order?.rider?.etaMinutes ?? 5} min · {order?.rider?.vehicleNumber ?? 'TN38 AB 1234'}
          </Text>
        </View>
        <View style={s.callBtn}><Text style={{ fontSize: 16 }}>📞</Text></View>
      </View>

      {/* Actions */}
      <View style={s.actions}>
        <TouchableOpacity style={s.refreshBtn} onPress={() => setSeconds(300)}>
          <Text style={s.refreshBtnText}>🔄 Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.confirmBtn} onPress={handleConfirm}>
          <Text style={s.confirmBtnText}>✓ CONFIRM PICKUP</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 24, color: C.black },
  sub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45 },
  qrCard: { marginHorizontal: 20, backgroundColor: C.white, borderRadius: 16, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#000', ...shadow(6,6), padding: 20, alignItems: 'center', marginBottom: 14 },
  qrLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.45, marginBottom: 16 },
  qrBox: { width: 160, height: 160, backgroundColor: C.white, borderRadius: 12, ...shadow(4,4), alignItems: 'center', justifyContent: 'center', marginBottom: 16, padding: 10 },
  qrGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 126, height: 126 },
  qrCell: { width: 18, height: 18, backgroundColor: 'transparent' },
  qrCellFilled: { backgroundColor: C.black },
  qrOverlay: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  qrEmoji: { fontSize: 32 },
  codeLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.45, marginBottom: 6 },
  code: { fontFamily: F.barlow, fontSize: 40, letterSpacing: 8, color: C.black, marginBottom: 14 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  timerText: { fontFamily: F.interBold, fontSize: 12 },
  riderCard: { marginHorizontal: 20, backgroundColor: C.white, borderRadius: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(3,3), padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  riderIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  riderName: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  riderSub: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  callBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.green, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#000', alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginHorizontal: 20 },
  refreshBtn: { flex: 1, backgroundColor: C.white, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderTopWidth: 0, borderLeftWidth: 0, borderColor: '#000', borderRadius: 10, padding: 12, alignItems: 'center' },
  refreshBtnText: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  confirmBtn: { flex: 2, backgroundColor: C.yellow, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3,3) },
  confirmBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  verified: { flex: 1, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', padding: 32 },
  verifiedIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.white, ...shadow(4,4,'rgba(0,0,0,0.3)'), alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  verifiedTitle: { fontFamily: F.barlow, fontSize: 32, color: C.white, marginBottom: 8 },
  verifiedSub: { fontFamily: F.inter, fontSize: 13, color: C.white, opacity: 0.85, textAlign: 'center', marginBottom: 28 },
  trackBtn: { width: '100%', backgroundColor: C.yellow, borderRadius: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', padding: 14, alignItems: 'center', ...shadow(4,4,'rgba(0,0,0,0.3)') },
  trackBtnText: { fontFamily: F.barlow, fontSize: 17, color: C.black },
})
