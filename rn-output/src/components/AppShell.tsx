import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import TouchableOpacity from './TouchableOpacity'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Screen, SetScreen } from '../types'

interface AppShellProps {
  screen: Screen
  setScreen: SetScreen
  showNav: boolean
  children: React.ReactNode
}

const ACTIVE_SCREENS: Record<string, string> = {
  dashboard: 'nav_dashboard',
  orders: 'nav_orders', order_detail: 'nav_orders', order_qr: 'nav_orders',
  menu: 'nav_more', menu_add_dish: 'nav_more', menu_edit_dish: 'nav_more',
  community: 'nav_community',
  fezu: 'nav_fezu', fezu_rider_detail: 'nav_fezu',
  wallet: 'nav_more', analytics: 'nav_more', settings: 'nav_more',
  notifications: 'nav_more', search: 'nav_dashboard',
  settings_profile: 'nav_more', settings_kitchen: 'nav_more',
  settings_hours: 'nav_more', settings_security: 'nav_more',
  settings_documents: 'nav_more', settings_subscription: 'nav_more',
  reviews: 'nav_more', review_detail: 'nav_more',
  customer_subscriptions: 'nav_orders', customer_subscription_detail: 'nav_orders',
  feature_cards: 'nav_more',
}

const NAV_TABS = [
  { id: 'nav_dashboard', screen: 'dashboard' as Screen, label: 'Home', icon: '🏠' },
  { id: 'nav_orders',    screen: 'orders'    as Screen, label: 'Orders', icon: '🧾' },
  { id: 'nav_community', screen: 'community' as Screen, label: 'Community', icon: '👥' },
  { id: 'nav_fezu',      screen: 'fezu'      as Screen, label: 'FEZU', icon: '🚴' },
  { id: 'nav_more',      screen: 'settings'  as Screen, label: 'More', icon: '···' },
]

export default function AppShell({ screen, setScreen, showNav, children }: AppShellProps) {
  const activeNav = ACTIVE_SCREENS[screen] ?? 'nav_dashboard'

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{children}</View>
      {showNav && (
        <View style={styles.nav}>
          {NAV_TABS.map(tab => {
            const isActive = activeNav === tab.id
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setScreen(tab.screen)}
                style={styles.navTab}
                activeOpacity={0.7}
              >
                <View style={[styles.navIconWrap, isActive && styles.navIconActive]}>
                  <Text style={styles.navIcon}>{tab.icon}</Text>
                </View>
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%', backgroundColor: '#FFFFFF' },
  content: { flex: 1, width: '100%', height: '100%' },
  nav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1.5,
    borderTopColor: '#E0E0E0',
  },
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderColor: 'transparent',
  },
  navIconActive: {
    backgroundColor: '#FFC50A',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderTopColor: '#E0E0E0',
    borderLeftColor: '#E0E0E0',
    borderBottomColor: '#000000',
    borderRightColor: '#000000',
  },
  navIcon: { fontSize: 18 },
  navLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#888' },
  navLabelActive: { fontFamily: 'Inter_700Bold', color: '#000' },
})
