import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import type { SetScreen } from '../../types'

export default function AppApprovedScreen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}><Text style={styles.iconText}>✅</Text></View>
      <Text style={styles.title}>You're Approved!</Text>
      <Text style={styles.sub}>Welcome to the FEAZTO Vendor family. Start adding your menu and accepting orders right away!</Text>
      <TouchableOpacity style={styles.btn} onPress={() => setScreen('dashboard')}>
        <Text style={styles.btnText}>Go to Dashboard →</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFC50A', alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  iconText: { fontSize: 52 },
  title: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 36, marginBottom: 10, textAlign: 'center' },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 14, opacity: 0.7, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  btn: {
    width: '100%', backgroundColor: '#000', borderRadius: 12, padding: 14, alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.3)', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1, color: '#FFC50A' },
})
