import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { notificationItems } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

type NotifItem = {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  type: string
}

const TYPE_ICON: Record<string, string> = {
  order: '🛒', fezu: '🚴', payment: '💰', review: '⭐', community: '💬',
}

const TYPE_COLOR: Record<string, string> = {
  order: '#DBEAFE', fezu: '#FEF3C7', payment: '#DCFCE7',
  review: '#FEF9C3', community: '#EDE9FE',
}

export default function NotificationsScreen({ setScreen }: { setScreen: SetScreen }) {
  const [items, setItems] = useState<NotifItem[]>(notificationItems)

  const unreadCount = items.filter(n => !n.read).length

  const markAllRead = () =>
    setItems(prev => prev.map(n => ({ ...n, read: true })))

  const markRead = (id: string) =>
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('dashboard')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={s.badge}>
            <Text style={s.badgeText}>{unreadCount}</Text>
          </View>
        )}
        {items.length > 0 && unreadCount > 0 && (
          <TouchableOpacity style={s.markAllBtn} onPress={markAllRead}>
            <Text style={s.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Body */}
      {items.length === 0 ? (
        /* Empty state */
        <View style={s.emptyWrap}>
          <View style={s.emptyIconWrap}>
            <Text style={s.emptyIcon}>🔔</Text>
          </View>
          <Text style={s.emptyTitle}>All caught up!</Text>
          <Text style={s.emptySub}>
            New orders, payments, and updates{'\n'}will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
          {items.map(n => (
            <TouchableOpacity
              key={n.id}
              activeOpacity={n.read ? 1 : 0.7}
              onPress={() => !n.read && markRead(n.id)}
              style={[s.card, n.read && s.cardRead]}
            >
              {/* Left icon */}
              <View style={[s.iconWrap, { backgroundColor: TYPE_COLOR[n.type] ?? C.cream }]}>
                <Text style={s.iconText}>{TYPE_ICON[n.type] ?? '🔔'}</Text>
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text style={[s.notifTitle, n.read && s.textMuted]}>
                  {n.title}
                </Text>
                <Text style={s.notifBody}>{n.body}</Text>
                <Text style={s.notifTime}>{n.time}</Text>
              </View>

              {/* Unread dot */}
              {!n.read && <View style={s.unreadDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 20, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.07)',
  },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black, flex: 1 },
  badge: {
    backgroundColor: C.yellow, borderRadius: 10,
    minWidth: 20, height: 20, paddingHorizontal: 5,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontFamily: F.interBold, fontSize: 11, color: C.black },
  markAllBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  markAllText: { fontFamily: F.interBold, fontSize: 11, color: C.black, opacity: 0.4 },

  /* List */
  body: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },

  card: {
    backgroundColor: C.white, borderRadius: 14,
    borderWidth: 1.5, borderColor: C.black,
    ...shadow(3, 3),
    padding: 12, flexDirection: 'row',
    alignItems: 'flex-start', gap: 12,
  },
  cardRead: {
    backgroundColor: '#FAFAFA',
    borderColor: 'rgba(0,0,0,0.08)',
    shadowOpacity: 0, elevation: 0,
  },

  iconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  iconText: { fontSize: 18 },

  notifTitle: { fontFamily: F.interBold, fontSize: 13, color: C.black, marginBottom: 2 },
  textMuted: { color: '#888' },
  notifBody: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.55, lineHeight: 17 },
  notifTime: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.3, marginTop: 4 },

  unreadDot: {
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: C.yellow, marginTop: 4, flexShrink: 0,
    borderWidth: 1.5, borderColor: C.black,
  },

  /* Empty state */
  emptyWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingBottom: 60, gap: 12,
  },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: C.yellow, ...shadow(4, 4),
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontFamily: F.barlow, fontSize: 24, color: C.black },
  emptySub: {
    fontFamily: F.inter, fontSize: 14, color: C.black,
    opacity: 0.4, textAlign: 'center', lineHeight: 21,
  },
})
