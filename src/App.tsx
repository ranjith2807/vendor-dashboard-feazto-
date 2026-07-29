import { useState } from 'react'
import AppShell from './components/AppShell'
import AuthScreen from './screens/AuthScreen'
import DashboardScreen from './screens/DashboardScreen'
import OrdersScreen from './screens/OrdersScreen'
import OrderDetailScreen from './screens/OrderDetailScreen'
import OrderQRScreen from './screens/OrderQRScreen'
import MenuScreen from './screens/MenuScreen'
import MenuAddDishScreen from './screens/MenuAddDishScreen'
import MenuEditDishScreen from './screens/MenuEditDishScreen'
import CommunityScreen from './screens/CommunityScreen'
import FezuScreen from './screens/FezuScreen'
import FezuRiderDetailScreen from './screens/FezuRiderDetailScreen'
import WalletScreen from './screens/WalletScreen'
import AnalyticsScreen from './screens/AnalyticsScreen'
import SettingsScreen from './screens/SettingsScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import SearchScreen from './screens/SearchScreen'
import SettingsProfileScreen from './screens/SettingsProfileScreen'
import SettingsKitchenScreen from './screens/SettingsKitchenScreen'
import SettingsHoursScreen from './screens/SettingsHoursScreen'
import SettingsSecurityScreen from './screens/SettingsSecurityScreen'
import SettingsDocumentsScreen from './screens/SettingsDocumentsScreen'
import SettingsSubscriptionScreen from './screens/SettingsSubscriptionScreen'
import SplashScreen from './screens/SplashScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import RegisterStep1Screen from './screens/RegisterStep1Screen'
import RegisterStep2Screen from './screens/RegisterStep2Screen'
import RegisterStep3Screen from './screens/RegisterStep3Screen'
import RegisterStep4Screen from './screens/RegisterStep4Screen'
import RegisterSuccessScreen from './screens/RegisterSuccessScreen'
import AppReviewScreen from './screens/AppReviewScreen'
import AppRejectedScreen from './screens/AppRejectedScreen'
import AppApprovedScreen from './screens/AppApprovedScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import ResetOtpScreen from './screens/ResetOtpScreen'
import NewPasswordScreen from './screens/NewPasswordScreen'
import ReviewsScreen from './screens/ReviewsScreen'
import ReviewDetailScreen from './screens/ReviewDetailScreen'
import CustomerSubscriptionsScreen from './screens/CustomerSubscriptionsScreen'
import CustomerSubscriptionDetailScreen from './screens/CustomerSubscriptionDetailScreen'
import FeatureCardsScreen from './screens/FeatureCardsScreen'

export type Screen =
  | 'auth' | 'auth_otp'
  | 'splash' | 'onboarding'
  | 'register_1' | 'register_2' | 'register_3' | 'register_4'
  | 'register_success' | 'app_review' | 'app_rejected' | 'app_approved'
  | 'forgot_password' | 'reset_otp' | 'new_password'
  | 'dashboard' | 'orders' | 'order_detail' | 'order_qr'
  | 'menu' | 'menu_add_dish' | 'menu_edit_dish'
  | 'community' | 'community_post' | 'community_create'
  | 'fezu' | 'fezu_tracking' | 'fezu_riders' | 'fezu_rider_detail'
  | 'wallet' | 'analytics' | 'settings' | 'notifications' | 'search'
  | 'settings_profile' | 'settings_kitchen' | 'settings_hours'
  | 'settings_security' | 'settings_documents' | 'settings_subscription'
  | 'reviews' | 'review_detail'
  | 'customer_subscriptions' | 'customer_subscription_detail'
  | 'feature_cards'

export interface NavParams { id?: string; [key: string]: string | undefined }
export type SetScreen = (s: Screen, params?: NavParams) => void

const NO_NAV: Screen[] = ['auth', 'auth_otp', 'splash', 'onboarding',
  'register_1', 'register_2', 'register_3', 'register_4',
  'register_success', 'app_review', 'app_rejected', 'app_approved',
  'forgot_password', 'reset_otp', 'new_password']

function ScreenContent({ screen, setScreen, navParams }: { screen: Screen; setScreen: SetScreen; navParams: NavParams }) {
  const p = { setScreen, navParams }
  switch (screen) {
    case 'splash':              return <SplashScreen {...p} />
    case 'onboarding':          return <OnboardingScreen {...p} />
    case 'auth': case 'auth_otp': return <AuthScreen {...p} />
    case 'forgot_password':     return <ForgotPasswordScreen {...p} />
    case 'reset_otp':           return <ResetOtpScreen {...p} />
    case 'new_password':        return <NewPasswordScreen {...p} />
    case 'register_1':          return <RegisterStep1Screen {...p} />
    case 'register_2':          return <RegisterStep2Screen {...p} />
    case 'register_3':          return <RegisterStep3Screen {...p} />
    case 'register_4':          return <RegisterStep4Screen {...p} />
    case 'register_success':    return <RegisterSuccessScreen {...p} />
    case 'app_review':          return <AppReviewScreen {...p} />
    case 'app_rejected':        return <AppRejectedScreen {...p} />
    case 'app_approved':        return <AppApprovedScreen {...p} />
    case 'dashboard':           return <DashboardScreen {...p} />
    case 'orders':              return <OrdersScreen {...p} />
    case 'order_detail':        return <OrderDetailScreen {...p} />
    case 'order_qr':            return <OrderQRScreen {...p} />
    case 'menu':                return <MenuScreen {...p} />
    case 'menu_add_dish':       return <MenuAddDishScreen {...p} />
    case 'menu_edit_dish':      return <MenuEditDishScreen {...p} />
    case 'community': case 'community_post': case 'community_create':
                                return <CommunityScreen {...p} />
    case 'fezu': case 'fezu_tracking': case 'fezu_riders':
                                return <FezuScreen {...p} />
    case 'fezu_rider_detail':   return <FezuRiderDetailScreen {...p} />
    case 'wallet':              return <WalletScreen {...p} />
    case 'analytics':           return <AnalyticsScreen {...p} />
    case 'settings':            return <SettingsScreen {...p} />
    case 'notifications':       return <NotificationsScreen {...p} />
    case 'search':              return <SearchScreen {...p} />
    case 'settings_profile':    return <SettingsProfileScreen {...p} />
    case 'settings_kitchen':    return <SettingsKitchenScreen {...p} />
    case 'settings_hours':      return <SettingsHoursScreen {...p} />
    case 'settings_security':   return <SettingsSecurityScreen {...p} />
    case 'settings_documents':  return <SettingsDocumentsScreen {...p} />
    case 'settings_subscription': return <SettingsSubscriptionScreen {...p} />
    case 'reviews':             return <ReviewsScreen {...p} />
    case 'review_detail':       return <ReviewDetailScreen {...p} />
    case 'customer_subscriptions': return <CustomerSubscriptionsScreen {...p} />
    case 'customer_subscription_detail': return <CustomerSubscriptionDetailScreen {...p} />
    case 'feature_cards':       return <FeatureCardsScreen {...p} />
    default:                    return <DashboardScreen {...p} />
  }
}

export default function App() {
  const [screen, setScreenState] = useState<Screen>('splash')
  const [navParams, setNavParams] = useState<NavParams>({})

  const setScreen: SetScreen = (s, params) => {
    setScreenState(s)
    setNavParams(params ?? {})
  }

  const showNav = !NO_NAV.includes(screen)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <AppShell screen={screen} setScreen={setScreen} showNav={showNav}>
        <ScreenContent screen={screen} setScreen={setScreen} navParams={navParams} />
      </AppShell>
    </div>
  )
}
