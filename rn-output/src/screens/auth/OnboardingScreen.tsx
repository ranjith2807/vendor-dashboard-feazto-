import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { SetScreen } from '../../types'

const SLIDES = [
  { id: 'ob_1', icon: '🍽️', title: 'Grow Your Kitchen Business', body: 'List your dishes, manage orders and reach thousands of hungry customers in your area.' },
  { id: 'ob_2', icon: '🚴', title: 'FEZU Delivery Network', body: 'Assign orders to trusted FEZU riders instantly. Track every delivery in real time.' },
  { id: 'ob_3', icon: '📊', title: 'Smart Analytics & Earnings', body: 'Track your revenue, peak hours and top dishes. Get paid on time, every time.' },
  { id: 'ob_4', icon: '🤝', title: 'Chef Community', body: 'Connect with 10,000+ home chefs. Share recipes, tips and grow together.' },
]

export default function OnboardingScreen({ setScreen }: { setScreen: SetScreen }) {
  const [idx, setIdx] = useState(0)
  const slide = SLIDES[idx]
  const isLast = idx === SLIDES.length - 1

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={() => setScreen('auth')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.illustrationWrap}>
        <View style={styles.circle}>
          <Text style={styles.icon}>{slide.icon}</Text>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <TouchableOpacity key={s.id} onPress={() => setIdx(i)}>
            <View style={[styles.dot, i === idx && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => isLast ? setScreen('auth') : setIdx(i => i + 1)}
        >
          <Text style={styles.btnPrimaryText}>{isLast ? 'Get Started →' : 'Next →'}</Text>
        </TouchableOpacity>
        {isLast && (
          <TouchableOpacity style={styles.btnSecondary} onPress={() => setScreen('register_1')}>
            <Text style={styles.btnSecondaryText}>New vendor? Register here →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFF8E7' },
  skip: { alignSelf: 'flex-end', padding: 16, paddingTop: 12 },
  skipText: { fontFamily: 'Inter_700Bold', fontSize: 13, opacity: 0.35 },
  illustrationWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  circle: {
    width: 160, height: 160, borderRadius: 80, backgroundColor: '#FFC50A',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6,
  },
  icon: { fontSize: 64 },
  title: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 30, textAlign: 'center', lineHeight: 36, marginBottom: 12 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center', opacity: 0.55, lineHeight: 22, maxWidth: 280 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#000', opacity: 0.2 },
  dotActive: { width: 22, opacity: 1 },
  actions: { paddingHorizontal: 24, paddingBottom: 32, gap: 10 },
  btnPrimary: {
    backgroundColor: '#FFC50A', borderRadius: 12, padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnPrimaryText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  btnSecondary: {
    backgroundColor: '#fff', borderRadius: 12, padding: 13, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  btnSecondaryText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
})
