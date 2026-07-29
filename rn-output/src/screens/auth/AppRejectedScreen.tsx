import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { SetScreen } from '../../types'

export default function AppRejectedScreen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}><Text style={styles.iconText}>❌</Text></View>
      <Text style={styles.title}>Application Rejected</Text>
      <Text style={styles.sub}>Unfortunately we couldn't verify your documents. Please re-submit with the correct files and try again.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => setScreen('register_3')}>
        <Text style={styles.btnText}>Re-submit Documents →</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnSecondary} onPress={() => setScreen('auth')}>
        <Text style={styles.btnSecondaryText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFF8E7', alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#FF3B30',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  iconText: { fontSize: 44 },
  title: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 30, marginBottom: 8, textAlign: 'center' },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.55, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  btn: {
    width: '100%', backgroundColor: '#FFC50A', borderRadius: 12, padding: 13, alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  btnSecondary: { width: '100%', padding: 10, alignItems: 'center' },
  btnSecondaryText: { fontFamily: 'Inter_700Bold', fontSize: 13, opacity: 0.4 },
})
