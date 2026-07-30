import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, Screen } from '../../types'
import { settingsSections } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

const ITEM_NAV: Record<string, Screen> = {
  set_001: 'settings_profile', set_002: 'settings_profile',
  set_003: 'settings_security', set_004: 'settings_kitchen',
  set_005: 'settings_hours', set_006: 'settings_kitchen',
  set_007: 'settings_kitchen', set_008: 'settings_documents',
  set_menu: 'menu',
}

export default function SettingsScreen({ setScreen }: { setScreen: SetScreen }) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    set_009: true, set_010: false, set_011: true, set_012: true,
  })
  const toggle = (id: string) => setToggles(p => ({ ...p, [id]: !p[id] }))

  return (
    <ScrollView style={s.root} contentContainerStyle={s.body}>
      <Text style={s.pageTitle}>Settings</Text>

      {/* Profile card */}
      <View style={s.profileCard}>
        <View style={s.avatar}><Text style={s.avatarText}>PK</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.kitchenName}>Priya's Kitchen</Text>
          <Text style={s.kitchenSub}>+91 98765 43210 · Coimbatore</Text>
          <View style={s.badges}>
            <View style={[s.badge, { backgroundColor: C.green }]}><Text style={s.badgeText}>VERIFIED</Text></View>
            <View style={[s.badge, { backgroundColor: C.yellow }]}><Text style={[s.badgeText, { color: C.black }]}>PREMIUM</Text></View>
          </View>
        </View>
        <TouchableOpacity style={s.editBtn}><Text style={s.editBtnText}>Edit</Text></TouchableOpacity>
      </View>

      {/* Quick links */}
      <View style={s.quickRow}>
        {[
          { id: 'ql_analytics', icon: '📊', label: 'Analytics', screen: 'analytics' as Screen },
          { id: 'ql_wallet', icon: '💰', label: 'Wallet', screen: 'wallet' as Screen },
          { id: 'ql_notifs', icon: '🔔', label: 'Alerts', screen: 'notifications' as Screen },
        ].map(ql => (
          <TouchableOpacity key={ql.id} style={s.quickBtn} onPress={() => setScreen(ql.screen)}>
            <Text style={{ fontSize: 22 }}>{ql.icon}</Text>
            <Text style={s.quickLabel}>{ql.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feature links */}
      <View style={s.featureRow}>
        {[
          { id: 'fl_feat', icon: '✨', label: 'Feature Cards', screen: 'feature_cards' as Screen, bg: C.yellow },
          { id: 'fl_sub', icon: '⭐', label: 'Subscription', screen: 'settings_subscription' as Screen, bg: C.white },
          { id: 'fl_rev', icon: '⭐', label: 'Reviews', screen: 'reviews' as Screen, bg: C.white },
        ].map(f => (
          <TouchableOpacity key={f.id} style={[s.featureBtn, { backgroundColor: f.bg }]} onPress={() => setScreen(f.screen)}>
            <Text style={{ fontSize: 20 }}>{f.icon}</Text>
            <Text style={s.featureLabel}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings sections */}
      {settingsSections.map(section => (
        <View key={section.id}>
          <Text style={s.sectionLabel}>{section.label.toUpperCase()}</Text>
          <View style={s.sectionCard}>
            {section.items.map((item, idx) => {
              const hasToggle = 'toggle' in item
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[s.row, idx < section.items.length - 1 && s.rowBorder]}
                  onPress={() => !hasToggle && ITEM_NAV[item.id] && setScreen(ITEM_NAV[item.id])}
                  activeOpacity={hasToggle ? 1 : 0.6}
                >
                  <View style={s.rowIcon}><Text style={{ fontSize: 18 }}>{item.icon}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowLabel}>{item.label}</Text>
                    {!!item.sub && <Text style={s.rowSub}>{item.sub}</Text>}
                  </View>
                  {hasToggle ? (
                    <TouchableOpacity
                      onPress={() => toggle(item.id)}
                      style={[s.toggle, { backgroundColor: toggles[item.id] ? C.green : '#ddd' }]}
                    >
                      <View style={[s.toggleThumb, { left: toggles[item.id] ? 18 : 2 }]} />
                    </TouchableOpacity>
                  ) : (
                    <Text style={s.chevron}>›</Text>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      ))}

      {/* Version + logout */}
      <View style={s.footerCard}>
        <Text style={{ fontSize: 40 }}>🍽️</Text>
        <View>
          <Text style={s.footerTitle}>FEAZTO Vendor v2.0</Text>
          <Text style={s.footerSub}>Powered by FEZU · Coimbatore</Text>
        </View>
      </View>
      <TouchableOpacity style={s.logoutBtn} onPress={() => setScreen('auth')}>
        <Text style={s.logoutBtnText}>LOGOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  body: { padding: 20, gap: 14, paddingBottom: 32 },
  pageTitle: { fontFamily: F.barlow, fontSize: 28, color: C.black },
  profileCard: { backgroundColor: C.white, borderRadius: 14, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(5, 5), padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: F.barlow, fontSize: 22, color: C.black },
  kitchenName: { fontFamily: F.interBold, fontSize: 16, color: C.black },
  kitchenSub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.5 },
  badges: { flexDirection: 'row', gap: 5, marginTop: 5 },
  badge: { borderRadius: 5, paddingHorizontal: 8, paddingVertical: 1 },
  badgeText: { fontFamily: F.barlow, fontSize: 10, color: C.white },
  editBtn: { borderRadius: 9, paddingHorizontal: 12, paddingVertical: 7, borderBottomWidth: 2, borderRightWidth: 2, borderTopWidth: 0, borderLeftWidth: 0, borderColor: '#000' },
  editBtnText: { fontFamily: F.interBold, fontSize: 12, color: C.black },
  quickRow: { flexDirection: 'row', gap: 8 },
  quickBtn: { flex: 1, backgroundColor: C.white, borderRadius: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(3, 3), paddingVertical: 12, alignItems: 'center', gap: 4 },
  quickLabel: { fontFamily: F.interBold, fontSize: 11, color: C.black },
  featureRow: { flexDirection: 'row', gap: 8 },
  featureBtn: { flex: 1, borderRadius: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(3, 3), paddingVertical: 12, alignItems: 'center', gap: 3 },
  featureLabel: { fontFamily: F.interBold, fontSize: 11, color: C.black },
  sectionLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.35, marginBottom: 8 },
  sectionCard: { backgroundColor: C.white, borderRadius: 14, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(4, 4), overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, paddingHorizontal: 14 },
  rowBorder: { borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.06)' },
  rowIcon: { width: 36, height: 36, borderRadius: 9, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  rowSub: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  toggle: { width: 46, height: 26, borderRadius: 13, position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  toggleThumb: { position: 'absolute', top: 2, width: 18, height: 18, borderRadius: 9, backgroundColor: C.white },
  chevron: { fontFamily: F.inter, fontSize: 20, color: C.black, opacity: 0.3 },
  footerCard: { backgroundColor: C.cream, borderRadius: 14, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(4, 4), padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  footerTitle: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  footerSub: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  logoutBtn: { backgroundColor: C.red, borderRadius: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', padding: 13, alignItems: 'center', ...shadow(4, 4) },
  logoutBtnText: { fontFamily: F.barlow, fontSize: 17, letterSpacing: 1, color: C.white },
})
