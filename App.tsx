import React, { useState } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter'
import { BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed'
import AppShell from './src/components/AppShell'
import { VendorProvider } from './src/context/VendorContext'
import type { Screen, NavParams, SetScreen } from './src/types'
import { DEFAULT_MENU_ITEMS, DEFAULT_ORDERS, type MenuItem, type VendorOrder } from './src/data/menuStore'

import {
  SplashScreen,
  OnboardingScreen,
  AuthScreen,
  ForgotPasswordScreen,
  ResetOtpScreen,
  NewPasswordScreen,
  RegisterStep1Screen,
  RegisterStep2Screen,
  RegisterStep3Screen,
  RegisterStep4Screen,
  RegisterSuccessScreen,
  AppReviewScreen,
  AppRejectedScreen,
  AppApprovedScreen,
} from './src/screens/auth'

import {
  DashboardScreen,
  NotificationsScreen,
  SearchScreen,
  FeatureCardsScreen,
} from './src/screens/dashboard'

import {
  OrdersScreen,
  OrderDetailScreen,
  OrderQRScreen,
} from './src/screens/orders'

import {
  MenuScreen,
  MenuAddDishScreen,
  MenuEditDishScreen,
} from './src/screens/menu'

import { CommunityScreen } from './src/screens/community'

import {
  FezuScreen,
  FezuRiderDetailScreen,
} from './src/screens/fezu'

import {
  WalletScreen,
  AnalyticsScreen,
} from './src/screens/wallet'

import {
  SettingsScreen,
  SettingsProfileScreen,
  SettingsKitchenScreen,
  SettingsHoursScreen,
  SettingsSecurityScreen,
  SettingsDocumentsScreen,
  SettingsSubscriptionScreen,
} from './src/screens/settings'

import {
  ReviewsScreen,
  ReviewDetailScreen,
} from './src/screens/reviews'

import {
  CustomerSubscriptionsScreen,
  CustomerSubscriptionDetailScreen,
} from './src/screens/subscriptions'

const NO_NAV: Screen[] = [
  'auth', 'splash', 'onboarding',
  'register_1', 'register_2', 'register_3', 'register_4',
  'register_success', 'app_review', 'app_rejected', 'app_approved',
  'forgot_password', 'reset_otp', 'new_password',
]

function ScreenContent({
  screen,
  setScreen,
  navParams,
  menuItems,
  setMenuItems,
  vendorOrders,
  setVendorOrders,
}: {
  screen: Screen
  setScreen: SetScreen
  navParams: NavParams
  menuItems: MenuItem[]
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
  vendorOrders: VendorOrder[]
  setVendorOrders: React.Dispatch<React.SetStateAction<VendorOrder[]>>
}) {
  const p = { setScreen, navParams, menuItems, setMenuItems, vendorOrders, setVendorOrders }
  switch (screen) {
    case 'splash':             return <SplashScreen {...p} />
    case 'onboarding':         return <OnboardingScreen {...p} />
    case 'auth':               return <AuthScreen {...p} />
    case 'forgot_password':    return <ForgotPasswordScreen {...p} />
    case 'reset_otp':          return <ResetOtpScreen {...p} />
    case 'new_password':       return <NewPasswordScreen {...p} />
    case 'register_1':         return <RegisterStep1Screen {...p} />
    case 'register_2':         return <RegisterStep2Screen {...p} />
    case 'register_3':         return <RegisterStep3Screen {...p} />
    case 'register_4':         return <RegisterStep4Screen {...p} />
    case 'register_success':   return <RegisterSuccessScreen {...p} />
    case 'app_review':         return <AppReviewScreen {...p} />
    case 'app_rejected':       return <AppRejectedScreen {...p} />
    case 'app_approved':       return <AppApprovedScreen {...p} />
    case 'dashboard':          return <DashboardScreen {...p} />
    case 'orders':             return <OrdersScreen {...p} />
    case 'order_detail':       return <OrderDetailScreen {...p} />
    case 'order_qr':           return <OrderQRScreen {...p} />
    case 'menu':               return <MenuScreen {...p} />
    case 'menu_add_dish':      return <MenuAddDishScreen {...p} />
    case 'menu_edit_dish':     return <MenuEditDishScreen {...p} />
    case 'community':          return <CommunityScreen {...p} />
    case 'fezu':               return <FezuScreen {...p} />
    case 'fezu_rider_detail':  return <FezuRiderDetailScreen {...p} />
    case 'wallet':             return <WalletScreen {...p} />
    case 'analytics':          return <AnalyticsScreen {...p} />
    case 'settings':           return <SettingsScreen {...p} />
    case 'notifications':      return <NotificationsScreen {...p} />
    case 'search':             return <SearchScreen {...p} />
    case 'settings_profile':   return <SettingsProfileScreen {...p} />
    case 'settings_kitchen':   return <SettingsKitchenScreen {...p} />
    case 'settings_hours':     return <SettingsHoursScreen {...p} />
    case 'settings_security':  return <SettingsSecurityScreen {...p} />
    case 'settings_documents': return <SettingsDocumentsScreen {...p} />
    case 'settings_subscription': return <SettingsSubscriptionScreen {...p} />
    case 'reviews':            return <ReviewsScreen {...p} />
    case 'review_detail':      return <ReviewDetailScreen {...p} />
    case 'customer_subscriptions':        return <CustomerSubscriptionsScreen {...p} />
    case 'customer_subscription_detail':  return <CustomerSubscriptionDetailScreen {...p} />
    case 'feature_cards':      return <FeatureCardsScreen {...p} />
    default:                   return <DashboardScreen {...p} />
  }
}

export default function App() {
  const [screen, setScreenState] = useState<Screen>('splash')
  const [navParams, setNavParams] = useState<NavParams>({})
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS)
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>(DEFAULT_ORDERS)

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    BarlowCondensed_700Bold,
  })

  const setScreen: SetScreen = (s, params) => {
    setScreenState(s)
    setNavParams(params ?? {})
  }

  if (!fontsLoaded) return null

  const showNav = !NO_NAV.includes(screen)

  return (
    <SafeAreaProvider>
      <VendorProvider>
        <View style={styles.root}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <AppShell screen={screen} setScreen={setScreen} showNav={showNav}>
            <ScreenContent
              screen={screen}
              setScreen={setScreen}
              navParams={navParams}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              vendorOrders={vendorOrders}
              setVendorOrders={setVendorOrders}
            />
          </AppShell>
        </View>
      </VendorProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
})
