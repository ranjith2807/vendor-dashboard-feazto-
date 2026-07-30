export const C = {
  yellow: '#FFC50A',
  cream: '#FFFFFF',
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

// Bottom-right 3D border helper (no top or left borders)
export function offsetBorder(width = 3, color = '#000000') {
  return {
    borderBottomWidth: width,
    borderRightWidth: width,
    borderBottomColor: color,
    borderRightColor: color,
  }
}

// Hard-offset shadow & 3D bottom-right border — for cards, containers, buttons
export function shadow(offsetX = 4, offsetY = 4, color = '#000000', elevation = 5) {
  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation,
    borderBottomWidth: offsetX,
    borderRightWidth: offsetY,
    borderBottomColor: color,
    borderRightColor: color,
  }
}

// Soft shadow — for small badges / nav items
export function softShadow(elevation = 2) {
  return {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: '#000000',
    borderRightColor: '#000000',
  }
}
