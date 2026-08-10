export type Screen =
  | 'auth' | 'splash' | 'onboarding'
  | 'register_1' | 'register_email_otp' | 'register_2' | 'register_3' | 'register_4'
  | 'register_success' | 'app_review' | 'app_rejected' | 'app_approved'
  | 'forgot_password' | 'reset_otp' | 'new_password'
  | 'dashboard' | 'orders' | 'order_detail' | 'order_qr'
  | 'menu' | 'menu_add_dish' | 'menu_edit_dish'
  | 'community' | 'fezu' | 'fezu_rider_detail'
  | 'wallet' | 'analytics' | 'settings' | 'notifications' | 'search'
  | 'settings_profile' | 'settings_kitchen' | 'settings_hours'
  | 'settings_security' | 'settings_documents' | 'settings_subscription'
  | 'reviews' | 'review_detail'
  | 'customer_subscriptions' | 'customer_subscription_detail'
  | 'feature_cards'

export interface NavParams { id?: string; [key: string]: string | undefined }
export type SetScreen = (s: Screen, params?: NavParams) => void
