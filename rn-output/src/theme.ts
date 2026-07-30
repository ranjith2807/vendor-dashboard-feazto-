export const C = {
  yellow: '#FFC50A',
  cream: '#FFFFFF',
  innerCream: '#F8F9FA',
  cardBorder: '#E0E0E0',
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF3B30',
  green: '#22C55E',
  blue: '#3B82F6',
  amber: '#F59E0B',
  purple: '#8B5CF6',
  teal: '#10B981',
}

export const F = {
  barlow: 'BarlowCondensed_700Bold',
  inter: 'Inter_400Regular',
  interBold: 'Inter_700Bold',
}

// Hard-offset shadow — for cards, banners, large containers (intentional comic style)
export function shadow(offsetX = 4, offsetY = 4, color = '#000', elevation = 5) {
  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation,
  }
}

// Soft shadow — for small buttons, badges, nav items (subtle depth, no dark block)
export function softShadow(elevation = 2) {
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation,
  }
}

// 3D bottom-right dark offset border effect with subtle #E0E0E0 top/left border for white background contrast
export const border3D = {
  borderTopWidth: 1,
  borderLeftWidth: 1,
  borderBottomWidth: 2.5,
  borderRightWidth: 2.5,
  borderTopColor: '#E0E0E0',
  borderLeftColor: '#E0E0E0',
  borderBottomColor: '#000000',
  borderRightColor: '#000000',
}
