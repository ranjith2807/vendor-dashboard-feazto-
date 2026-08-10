import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { SetScreen } from '../../types'

export default function SplashScreen({ setScreen }: { setScreen: SetScreen }) {
  useEffect(() => {
    const t = setTimeout(() => setScreen('onboarding'), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🍽️</Text>
        </View>
        <Text style={styles.brand}>FEAZTO</Text>
        <Text style={styles.sub}>VENDOR PARTNER</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFC50A', alignItems: 'center', justifyContent: 'center' },
  logoWrap: { alignItems: 'center' },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#000', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  avatarText: { fontSize: 48 },
  brand: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 52, letterSpacing: 3, color: '#000' },
  sub: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#000', opacity: 0.55, letterSpacing: 3, marginTop: 4 },
  dots: { flexDirection: 'row', gap: 6, position: 'absolute', bottom: 60 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#000', opacity: 0.25 },
  dotActive: { width: 22, opacity: 1 },
})
