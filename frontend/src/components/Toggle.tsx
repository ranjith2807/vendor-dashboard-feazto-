/**
 * Toggle.tsx — Reusable ON/OFF switch component.
 * Track: 52×28, Thumb: 22×22, with smooth position.
 */
import React from 'react'
import { View, StyleSheet } from 'react-native'
import TouchableOpacity from './TouchableOpacity'
import { C } from '../theme'

interface ToggleProps {
  value: boolean
  onToggle: () => void
  disabled?: boolean
}

export default function Toggle({ value, onToggle, disabled = false }: ToggleProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        s.track,
        { backgroundColor: value ? C.green : '#C7C7CC' },
        disabled && { opacity: 0.4 },
      ]}
    >
      <View style={[s.thumb, { transform: [{ translateX: value ? 24 : 2 }] }]} />
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  track: {
    width: 52,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingVertical: 3,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
})
