export const C = {
  yellow: '#FFC50A',
  cream: '#FFF8E7',
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

// 3D Bottom-Right Dark Border & Solid Shadow — for cards, banners, containers, and buttons
export function shadow(offsetX = 3, offsetY = 3, color = '#000000', elevation = 4) {
  return {
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomColor: color,
    borderRightColor: color,
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation,
  }
}

// Soft 3D Bottom-Right Border — for small buttons, badges, nav items
export function softShadow(elevation = 2) {
  return {
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: '#000000',
    borderRightColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation,
  }
}
