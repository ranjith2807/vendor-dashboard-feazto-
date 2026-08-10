// All mock data — every list item has a unique `id` field.
// Keys must NEVER be index, title, name, status, or label.

export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  items: Array<{ id: string; name: string; qty: number; price: number }>
  total: number
  status: OrderStatus
  placedAt: string
  address: string
  riderAssigned?: string
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  rating: number
  reviews: number
  available: boolean
  veg: boolean
  popular: boolean
  description: string
  calories: number
}

export interface CommunityPost {
  id: string
  authorId: string
  authorName: string
  authorRole: string
  authorAvatar: string
  tag: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  bookmarks: number
  liked: boolean
  bookmarked: boolean
  following: boolean
  timeAgo: string
}

export interface Rider {
  id: string
  riderId?: string
  name: string
  phone: string
  rating: number
  totalDeliveries: number
  distanceKm: number
  status: 'available' | 'busy' | 'offline'
  vehicleType: string
  vehicleNo: string
  photoUrl?: string
  currentLocation?: { lat: number; lng: number }
  currentOrderId?: string
  lastLocationUpdate?: string
}

export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  description: string
  amount: number
  date: string
  status: 'success' | 'pending' | 'failed'
  orderId?: string
}

// ──────────────────────────────────────
// ORDERS
// ──────────────────────────────────────
export const mockOrders: Order[] = [
  {
    id: 'ord_1001',
    customerName: 'Priya Krishnan',
    customerPhone: '+91 98765 43210',
    items: [
      { id: 'itm_1001_a', name: 'Masala Dosa', qty: 2, price: 80 },
      { id: 'itm_1001_b', name: 'Filter Coffee', qty: 2, price: 35 },
      { id: 'itm_1001_c', name: 'Sambar Vada', qty: 1, price: 55 },
    ],
    total: 285,
    status: 'new',
    placedAt: '9:42 AM',
    address: '14, Kamaraj St, Coimbatore',
    riderAssigned: undefined,
  },
  {
    id: 'ord_1002',
    customerName: 'Ravi Shankar',
    customerPhone: '+91 87654 32109',
    items: [
      { id: 'itm_1002_a', name: 'Idli × 4', qty: 1, price: 60 },
      { id: 'itm_1002_b', name: 'Pongal', qty: 1, price: 70 },
      { id: 'itm_1002_c', name: 'Tea', qty: 2, price: 20 },
    ],
    total: 170,
    status: 'preparing',
    placedAt: '9:38 AM',
    address: '7, Anna Nagar, Coimbatore',
    riderAssigned: 'Muthu Kumar',
  },
  {
    id: 'ord_1003',
    customerName: 'Deepa Lakshmi',
    customerPhone: '+91 76543 21098',
    items: [
      { id: 'itm_1003_a', name: 'Ghee Pongal', qty: 2, price: 80 },
      { id: 'itm_1003_b', name: 'Kesari', qty: 1, price: 45 },
    ],
    total: 205,
    status: 'ready',
    placedAt: '9:30 AM',
    address: '22, RS Puram, Coimbatore',
    riderAssigned: 'Selvam R.',
  },
  {
    id: 'ord_1004',
    customerName: 'Karthik Murugan',
    customerPhone: '+91 65432 10987',
    items: [
      { id: 'itm_1004_a', name: 'Rava Dosa', qty: 3, price: 90 },
      { id: 'itm_1004_b', name: 'Coconut Chutney', qty: 1, price: 15 },
    ],
    total: 285,
    status: 'accepted',
    placedAt: '9:45 AM',
    address: '5, Saibaba Colony, Coimbatore',
  },
  {
    id: 'ord_1005',
    customerName: 'Meena Rajendran',
    customerPhone: '+91 54321 09876',
    items: [
      { id: 'itm_1005_a', name: 'Poori Masala', qty: 2, price: 75 },
      { id: 'itm_1005_b', name: 'Halwa', qty: 1, price: 40 },
    ],
    total: 190,
    status: 'delivered',
    placedAt: '8:55 AM',
    address: '9, Gandhipuram, Coimbatore',
    riderAssigned: 'Karthik P.',
  },
  {
    id: 'ord_1006',
    customerName: 'Suresh Babu',
    customerPhone: '+91 43210 98765',
    items: [
      { id: 'itm_1006_a', name: 'Upma', qty: 1, price: 50 },
      { id: 'itm_1006_b', name: 'Bajji Platter', qty: 1, price: 80 },
    ],
    total: 130,
    status: 'cancelled',
    placedAt: '9:10 AM',
    address: '3, Peelamedu, Coimbatore',
  },
]

// ──────────────────────────────────────
// MENU ITEMS
// ──────────────────────────────────────
export const mockMenu: MenuItem[] = []

export const menuCategories = [
  { id: 'cat_all', label: 'All' },
  { id: 'cat_breakfast', label: 'Breakfast' },
  { id: 'cat_mains', label: 'Mains' },
  { id: 'cat_sweets', label: 'Sweets' },
  { id: 'cat_beverages', label: 'Beverages' },
]

// ──────────────────────────────────────
// COMMUNITY POSTS
// ──────────────────────────────────────
export const communityPosts: CommunityPost[] = []

export const communityTabs = [
  { id: 'tab_feed', label: 'Feed' },
  { id: 'tab_trending', label: 'Trending' },
  { id: 'tab_recipes', label: 'Recipes' },
  { id: 'tab_tips', label: 'Tips' },
  { id: 'tab_photos', label: 'Photos' },
]

export const tagMeta: Record<string, { label: string; bg: string; text: string }> = {
  recipe: { label: 'Recipe', bg: '#FFC50A', text: '#000' },
  business_tip: { label: 'Business', bg: '#000', text: '#FFF8E7' },
  food_photo: { label: 'Photo', bg: '#8B5CF6', text: '#fff' },
  kitchen_growth: { label: 'Growth', bg: '#22C55E', text: '#fff' },
  marketing: { label: 'Marketing', bg: '#FF6B35', text: '#fff' },
}

export const leaderboard: Array<{ id: string; name: string; points: number; badge: string; streak: number; rank: number }> = []

export const communityGroups: Array<{ id: string; name: string; members: number; joined: boolean }> = []

// ──────────────────────────────────────
// FEZU RIDERS
// ──────────────────────────────────────
export const mockRiders: Rider[] = []

export const deliveryHistory: Array<{
  id: string; orderId: string; customerName: string; riderName: string
  amount: number; status: string; time: string; duration: string
}> = []

// ──────────────────────────────────────
// WALLET TRANSACTIONS
// ──────────────────────────────────────
export const transactions: Transaction[] = [
  { id: 'txn_w001', type: 'credit', description: 'Settlement — 28 Jun', amount: 8420, date: 'Today, 10:00 AM', status: 'success' },
  { id: 'txn_w002', type: 'debit', description: 'Payout to HDFC ×4321', amount: 5000, date: 'Today, 9:00 AM', status: 'success' },
  { id: 'txn_w003', type: 'credit', description: 'Order #ord_1005 payment', amount: 190, date: 'Today, 8:55 AM', status: 'success', orderId: 'ord_1005' },
  { id: 'txn_w004', type: 'credit', description: 'Order #ord_0991 payment', amount: 285, date: 'Yesterday, 9:12 AM', status: 'success', orderId: 'ord_0991' },
  { id: 'txn_w005', type: 'credit', description: 'Order #ord_0992 payment', amount: 170, date: 'Yesterday, 8:45 AM', status: 'success', orderId: 'ord_0992' },
  { id: 'txn_w006', type: 'credit', description: 'Order #ord_0993 payment', amount: 350, date: 'Yesterday, 8:20 AM', status: 'success', orderId: 'ord_0993' },
  { id: 'txn_w007', type: 'debit', description: 'FEZU delivery fee', amount: 45, date: 'Yesterday, 8:00 AM', status: 'success' },
  { id: 'txn_w008', type: 'credit', description: 'Settlement — 27 Jun', amount: 6340, date: '27 Jun, 10:00 AM', status: 'success' },
  { id: 'txn_w009', type: 'debit', description: 'GST payment', amount: 820, date: '27 Jun, 9:30 AM', status: 'pending' },
  { id: 'txn_w010', type: 'credit', description: 'Subscription revenue', amount: 2400, date: '26 Jun, 6:00 PM', status: 'success' },
]

// ──────────────────────────────────────
// ANALYTICS
// ──────────────────────────────────────
export const revenueData = [
  { id: 'rev_mon', label: 'Mon', value: 4200 },
  { id: 'rev_tue', label: 'Tue', value: 5800 },
  { id: 'rev_wed', label: 'Wed', value: 3900 },
  { id: 'rev_thu', label: 'Thu', value: 6700 },
  { id: 'rev_fri', label: 'Fri', value: 7200 },
  { id: 'rev_sat', label: 'Sat', value: 9100 },
  { id: 'rev_sun', label: 'Sun', value: 8400 },
]

export const peakHoursData = [
  { id: 'peak_07', label: '7AM', value: 30 },
  { id: 'peak_08', label: '8AM', value: 68 },
  { id: 'peak_09', label: '9AM', value: 92 },
  { id: 'peak_10', label: '10AM', value: 55 },
  { id: 'peak_11', label: '11AM', value: 42 },
  { id: 'peak_12', label: '12PM', value: 78 },
  { id: 'peak_13', label: '1PM', value: 84 },
  { id: 'peak_14', label: '2PM', value: 35 },
  { id: 'peak_15', label: '3PM', value: 20 },
  { id: 'peak_16', label: '4PM', value: 25 },
  { id: 'peak_17', label: '5PM', value: 45 },
  { id: 'peak_18', label: '6PM', value: 62 },
]

export const topDishes = [
  { id: 'dish_top_001', name: 'Masala Dosa', orders: 124, revenue: 9920, growth: '+12%', positive: true },
  { id: 'dish_top_002', name: 'Filter Coffee', orders: 312, revenue: 10920, growth: '+8%', positive: true },
  { id: 'dish_top_003', name: 'Idli ×4', orders: 98, revenue: 5880, growth: '+5%', positive: true },
  { id: 'dish_top_004', name: 'Ghee Pongal', orders: 76, revenue: 6080, growth: '-3%', positive: false },
  { id: 'dish_top_005', name: 'Kesari', orders: 54, revenue: 2430, growth: '+18%', positive: true },
]

export const analyticsStats = [
  { id: 'astat_001', label: 'Revenue', value: '₹ 44,820', delta: '+14%', positive: true, icon: '₹' },
  { id: 'astat_002', label: 'Orders', value: '342', delta: '+9%', positive: true, icon: '🛒' },
  { id: 'astat_003', label: 'Avg Order', value: '₹ 131', delta: '+5%', positive: true, icon: '📊' },
  { id: 'astat_004', label: 'Rating', value: '4.7 ★', delta: '+0.2', positive: true, icon: '⭐' },
  { id: 'astat_005', label: 'Customers', value: '218', delta: '+22%', positive: true, icon: '👥' },
  { id: 'astat_006', label: 'FEZU Deliveries', value: '187', delta: '+31%', positive: true, icon: '🚴' },
]

// ──────────────────────────────────────
// SETTINGS
// ──────────────────────────────────────
export const settingsSections = [
  {
    id: 'sec_account',
    label: 'Account',
    items: [
      { id: 'set_001', icon: '👤', label: 'Profile & Kitchen', sub: 'Name, photo, description' },
      { id: 'set_003', icon: '🔒', label: 'Password & Security', sub: 'Change password, 2FA' },
      { id: 'set_004', icon: '📍', label: 'Kitchen Address', sub: '14, Kamaraj St, Coimbatore' },
    ],
  },
  {
    id: 'sec_kitchen',
    label: 'Kitchen',
    items: [
      { id: 'set_menu', icon: '📖', label: 'Menu Management', sub: 'Manage dishes, prices & availability' },
      { id: 'set_005', icon: '⏰', label: 'Operating Hours', sub: '7:00 AM – 2:00 PM' },
      { id: 'set_006', icon: '🍽️', label: 'Cuisine Types', sub: 'South Indian, Sweets' },
      { id: 'set_007', icon: '📦', label: 'Delivery Radius', sub: '5 km' },
      { id: 'set_008', icon: '🔖', label: 'FSSAI License', sub: 'Verified · TN-2024-001234' },
    ],
  },
  {
    id: 'sec_notifications',
    label: 'Notifications',
    items: [
      { id: 'set_009', icon: '🔔', label: 'New Orders', sub: 'Sound + vibration', toggle: true, toggleOn: true },
      { id: 'set_010', icon: '💬', label: 'Community Updates', sub: 'Likes, comments, replies', toggle: true, toggleOn: false },
      { id: 'set_011', icon: '🚴', label: 'FEZU Rider Updates', sub: 'Assignment & tracking', toggle: true, toggleOn: true },
      { id: 'set_012', icon: '💰', label: 'Payment Alerts', sub: 'Settlements & payouts', toggle: true, toggleOn: true },
    ],
  },
  {
    id: 'sec_support',
    label: 'Support & Legal',
    items: [
      { id: 'set_013', icon: '❓', label: 'Help Centre', sub: 'FAQs and guides' },
      { id: 'set_014', icon: '🎧', label: 'Contact Support', sub: 'Chat, call, email' },
      { id: 'set_015', icon: '📄', label: 'Terms & Conditions', sub: '' },
      { id: 'set_016', icon: '🔏', label: 'Privacy Policy', sub: '' },
    ],
  },
]

export const notificationItems: Array<{
  id: string; title: string; body: string; time: string; read: boolean; type: string
}> = []

// ──────────────────────────────────────
// BANK ACCOUNTS
// ──────────────────────────────────────
export interface BankAccount {
  id: string
  bankName: string
  accountHolder: string
  accountNumber: string
  ifsc: string
  accountType: 'savings' | 'current'
  isPrimary: boolean
  bankColor: string
}

export const bankAccounts: BankAccount[] = [
  { id: 'bank_001', bankName: 'HDFC Bank', accountHolder: "Priya's Kitchen", accountNumber: '×××× ×××× ×××× 4321', ifsc: 'HDFC0001234', accountType: 'savings', isPrimary: true, bankColor: '#004C8F' },
  { id: 'bank_002', bankName: 'State Bank of India', accountHolder: 'Priya Krishnan', accountNumber: '×××× ×××× ×××× 7890', ifsc: 'SBIN0002345', accountType: 'current', isPrimary: false, bankColor: '#2563EB' },
]

// ──────────────────────────────────────
// MONTHLY ANALYTICS
// ──────────────────────────────────────
export const monthlyRevenueData = [
  { id: 'mrev_jan', label: 'Jan', value: 38200 },
  { id: 'mrev_feb', label: 'Feb', value: 41500 },
  { id: 'mrev_mar', label: 'Mar', value: 36800 },
  { id: 'mrev_apr', label: 'Apr', value: 45200 },
  { id: 'mrev_may', label: 'May', value: 52100 },
  { id: 'mrev_jun', label: 'Jun', value: 48700 },
  { id: 'mrev_jul', label: 'Jul', value: 55300 },
]

export const platformComparisonData = [
  { id: 'plat_feazto', platform: 'FEAZTO', orders: 234, revenue: 32450, color: '#FFC50A', pct: 62 },
  { id: 'plat_swiggy', platform: 'Swiggy', orders: 89, revenue: 10200, color: '#FC8019', pct: 24 },
  { id: 'plat_zomato', platform: 'Zomato', orders: 47, revenue: 5680, color: '#E23744', pct: 14 },
]

export const customerInsights = [
  { id: 'cust_stat_001', label: 'Repeat Customers', value: '68%', icon: '🔁', delta: '+5%', positive: true },
  { id: 'cust_stat_002', label: 'Avg Order Value', value: '₹187', icon: '💰', delta: '+₹12', positive: true },
  { id: 'cust_stat_003', label: 'Cancelled Orders', value: '4.2%', icon: '❌', delta: '-1.1%', positive: true },
  { id: 'cust_stat_004', label: 'Delivery Time', value: '28 min', icon: '⏱', delta: '-3 min', positive: true },
]

// ──────────────────────────────────────
// SETTINGS — OPERATING HOURS
// ──────────────────────────────────────
export interface DayHours {
  id: string
  day: string
  short: string
  open: boolean
  from: string
  to: string
}

export const operatingHours: DayHours[] = [
  { id: 'oh_mon', day: 'Monday', short: 'MON', open: true, from: '07:00', to: '22:00' },
  { id: 'oh_tue', day: 'Tuesday', short: 'TUE', open: true, from: '07:00', to: '22:00' },
  { id: 'oh_wed', day: 'Wednesday', short: 'WED', open: true, from: '07:00', to: '22:00' },
  { id: 'oh_thu', day: 'Thursday', short: 'THU', open: true, from: '07:00', to: '22:00' },
  { id: 'oh_fri', day: 'Friday', short: 'FRI', open: true, from: '07:00', to: '23:00' },
  { id: 'oh_sat', day: 'Saturday', short: 'SAT', open: true, from: '08:00', to: '23:00' },
  { id: 'oh_sun', day: 'Sunday', short: 'SUN', open: false, from: '09:00', to: '21:00' },
]

// ──────────────────────────────────────
// SETTINGS — DOCUMENTS
// ──────────────────────────────────────
export interface VendorDocument {
  id: string
  name: string
  type: string
  status: 'verified' | 'pending' | 'rejected' | 'missing'
  expiresAt?: string
  icon: string
}

export const vendorDocuments: VendorDocument[] = [
  { id: 'doc_001', name: 'FSSAI License', type: 'Food Safety', status: 'verified', expiresAt: 'Mar 2026', icon: '🏛' },
  { id: 'doc_002', name: 'GST Certificate', type: 'Tax', status: 'verified', expiresAt: 'Permanent', icon: '📄' },
  { id: 'doc_003', name: 'PAN Card', type: 'Identity', status: 'verified', icon: '🪪' },
  { id: 'doc_004', name: 'Aadhaar Card', type: 'Identity', status: 'verified', icon: '🪪' },
  { id: 'doc_005', name: 'Trade License', type: 'Business', status: 'pending', icon: '📋' },
  { id: 'doc_006', name: 'Fire Safety NOC', type: 'Safety', status: 'missing', icon: '🔥' },
]

// ──────────────────────────────────────
// SUBSCRIPTION
// ──────────────────────────────────────
export const subscriptionInfo = {
  plan: 'Premium',
  price: 1999,
  billingCycle: 'Monthly',
  renewsOn: '14 Aug 2026',
  features: [
    { id: 'feat_001', label: 'Unlimited Orders', included: true },
    { id: 'feat_002', label: 'FEZU Rider Network', included: true },
    { id: 'feat_003', label: 'Advanced Analytics', included: true },
    { id: 'feat_004', label: 'Priority Support', included: true },
    { id: 'feat_005', label: 'Community Access', included: true },
    { id: 'feat_006', label: 'White-label Menu Page', included: false },
    { id: 'feat_007', label: 'API Access', included: false },
  ],
  invoices: [] as Array<{ id: string; date: string; amount: number; status: string }>,
}

// ──────────────────────────────────────
// SEARCH SUGGESTIONS
// ──────────────────────────────────────
export const searchCategories = [
  { id: 'scat_001', label: 'Masala Dosa', icon: '🫓', type: 'menu' },
  { id: 'scat_002', label: 'Filter Coffee', icon: '☕', type: 'menu' },
  { id: 'scat_003', label: 'Priya Krishnan', icon: '👤', type: 'customer' },
  { id: 'scat_004', label: 'Order #ord_1001', icon: '📦', type: 'order' },
  { id: 'scat_005', label: 'Idli Set', icon: '🫓', type: 'menu' },
  { id: 'scat_006', label: 'Community Tips', icon: '💬', type: 'community' },
]

export const recentSearches = [
  { id: 'rs_001', query: 'Masala Dosa', icon: '🔍' },
  { id: 'rs_002', query: 'Revenue July', icon: '🔍' },
  { id: 'rs_003', query: 'Muthu Kumar', icon: '🔍' },
]

// ──────────────────────────────────────
// REVIEWS
// ──────────────────────────────────────
export interface Review {
  id: string
  customerName: string
  avatar: string
  rating: number
  dish: string
  comment: string
  date: string
  hasPhoto: boolean
  helpful: number
  bookmarked: boolean
}

export const mockReviews: Review[] = []

// ──────────────────────────────────────
// CUSTOMER SUBSCRIPTIONS
// ──────────────────────────────────────
export interface CustomerSubscription {
  id: string
  customerName: string
  customerPhone: string
  plan: string
  frequency: 'daily' | 'weekly' | 'monthly'
  meals: string[]
  startDate: string
  endDate: string
  mealsDelivered: number
  mealsRemaining: number
  amountPaid: number
  amountTotal: number
  status: 'active' | 'paused' | 'expired' | 'expiring_soon'
  address: string
  deliveryTime: string
}

export const customerSubscriptions: CustomerSubscription[] = [
  { id: 'csub_001', customerName: 'Lakshmi Devi', customerPhone: '+91 98765 11111', plan: 'Breakfast Daily', frequency: 'daily', meals: ['Idli Set', 'Filter Coffee'], startDate: '1 Jul 2026', endDate: '31 Jul 2026', mealsDelivered: 12, mealsRemaining: 19, amountPaid: 2200, amountTotal: 2800, status: 'active', address: '12, Anna Nagar, Coimbatore', deliveryTime: '8:00 AM' },
  { id: 'csub_002', customerName: 'Vijay Kumar', customerPhone: '+91 87654 22222', plan: 'Lunch Weekly', frequency: 'weekly', meals: ['Rice Meal', 'Sambar', 'Rasam', 'Buttermilk'], startDate: '1 Jun 2026', endDate: '30 Jun 2026', mealsDelivered: 4, mealsRemaining: 0, amountPaid: 1600, amountTotal: 1600, status: 'expired', address: '5, RS Puram, Coimbatore', deliveryTime: '12:30 PM' },
  { id: 'csub_003', customerName: 'Amutha R.', customerPhone: '+91 76543 33333', plan: 'Dinner Plan', frequency: 'daily', meals: ['Chapati', 'Veg Curry', 'Curd Rice'], startDate: '10 Jul 2026', endDate: '17 Jul 2026', mealsDelivered: 4, mealsRemaining: 3, amountPaid: 1050, amountTotal: 1400, status: 'expiring_soon', address: '8, Saibaba Colony, Coimbatore', deliveryTime: '7:30 PM' },
  { id: 'csub_004', customerName: 'Balaji P.', customerPhone: '+91 65432 44444', plan: 'Breakfast Daily', frequency: 'daily', meals: ['Pongal', 'Vada', 'Chutney', 'Coffee'], startDate: '1 Jul 2026', endDate: '31 Jul 2026', mealsDelivered: 12, mealsRemaining: 19, amountPaid: 2400, amountTotal: 3100, status: 'paused', address: '3, Race Course, Coimbatore', deliveryTime: '8:30 AM' },
]

// ──────────────────────────────────────
// FEATURE CARDS
// ──────────────────────────────────────
export interface FeatureCard {
  id: string
  label: string
  icon: string
  description: string
  active: boolean
}

export const allFeatureCards: FeatureCard[] = [
  { id: 'fc_001', label: 'Home Style Cooking',     icon: '🏠', description: 'Authentic recipes cooked with love', active: true },
  { id: 'fc_002', label: 'Fresh Ingredients',       icon: '🥬', description: 'Farm-fresh produce every day',        active: true },
  { id: 'fc_003', label: 'No Preservatives',        icon: '✅', description: '100% natural, no artificial additives', active: true },
  { id: 'fc_004', label: 'On-time Delivery',        icon: '⏱', description: 'Delivered hot within 30 minutes',    active: false },
  { id: 'fc_005', label: 'Customizable Meals',      icon: '🎛', description: 'Adjust spice, oil, and portions',    active: false },
  { id: 'fc_006', label: 'Pure Veg',                icon: '🟢', description: 'Strictly vegetarian kitchen',        active: false },
  { id: 'fc_007', label: 'Jain Food Available',     icon: '🙏', description: 'No root vegetables on request',      active: false },
  { id: 'fc_008', label: 'High Protein Meals',      icon: '💪', description: 'Nutrition-focused menu options',     active: false },
  { id: 'fc_009', label: 'Kids Friendly',           icon: '🧒', description: 'Mild flavours kids will love',       active: false },
  { id: 'fc_010', label: 'Thali Available',         icon: '🍱', description: 'Full traditional thali meals',       active: false },
  { id: 'fc_011', label: 'Festive Specials',        icon: '🎊', description: 'Special dishes for festivals',       active: false },
  { id: 'fc_012', label: 'Bulk Orders',             icon: '📦', description: 'Catering for events and offices',    active: false },
  { id: 'fc_013', label: 'Breakfast Available',     icon: '☀️', description: 'Early morning breakfast options',    active: false },
  { id: 'fc_014', label: 'Eco-friendly Packaging',  icon: '♻️', description: 'Biodegradable and sustainable packs', active: false },
  { id: 'fc_015', label: 'Gluten-free Options',     icon: '🌾', description: 'Safe meals for gluten sensitivity',  active: false },
  { id: 'fc_016', label: 'Low-oil Food',            icon: '💧', description: 'Heart-healthy cooking methods',      active: false },
  { id: 'fc_017', label: 'Halal',                   icon: '☪️', description: 'Halal-certified ingredients',       active: false },
  { id: 'fc_018', label: 'Vegan',                   icon: '🌱', description: 'No animal products whatsoever',     active: false },
  { id: 'fc_019', label: 'Diabetic Friendly',       icon: '🩺', description: 'Low-sugar, controlled carb meals',  active: false },
  { id: 'fc_020', label: 'Keto',                    icon: '🥑', description: 'High-fat low-carb meal options',    active: false },
  { id: 'fc_021', label: 'Family Meals',            icon: '👨‍👩‍👧', description: 'Large portions for the whole family', active: false },
  { id: 'fc_022', label: 'Corporate Catering',      icon: '🏢', description: 'Bulk orders for offices',           active: false },
  { id: 'fc_023', label: 'Party Orders',            icon: '🎉', description: 'Special menus for celebrations',    active: false },
  { id: 'fc_024', label: 'Spicy Food',              icon: '🌶', description: 'Extra spicy options available',     active: false },
]
