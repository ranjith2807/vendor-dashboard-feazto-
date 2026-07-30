import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import type { SetScreen } from '../../types'
import { notificationItems } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

const TYPE_ICON: Record<string, string> = {
  order: '🛒', fezu: '🚴', payment: '💰', review: '⭐', community: '💬',
}

export default function NotificationsScreen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('dashboard')}><Text style={s.back}>←</Text></TouchableOpacity>
        <Text style={s.title}>Notifications</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {notificationItems.map(n => (
          <View key={n.id} style={[s.card, n.read && s.cardRead]}>
            <View style={[s.icon, { borderColor: n.read ? '#ddd' : C.black }]}>
              <Text style={{ fontSize: 17 }}>{TYPE_ICON[n.type]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.notifTitle, n.read && s.textMuted]}>{n.title}</Text>
              <Text style={s.notifBody}>{n.body}</Text>
              <Text style={s.notifTime}>{n.time}</Text>
            </View>
            {!n.read && <View style={s.unreadDot} />}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black },
  body: { paddingHorizontal: 20, paddingBottom: 20, gap: 8 },
  card: { backgroundColor: C.cream,  borderRadius: 12, ...shadow(4, 4), padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardRead: { backgroundColor: C.white, borderColor: '#ddd', shadowOpacity: 0 },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.cream,  alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifTitle: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  textMuted: { color: '#666' },
  notifBody: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.55 },
  notifTime: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.35, marginTop: 2 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.yellow, marginTop: 3, flexShrink: 0 },
})
