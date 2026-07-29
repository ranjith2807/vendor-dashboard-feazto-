import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { SetScreen } from '../../types'

export default function AppReviewScreen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}><Text style={styles.iconText}>🔍</Text></View>
      <Text style={styles.title}>Under Review</Text>
      <Text style={styles.sub}>Our team is verifying your documents and kitchen details. This usually takes 24-48 hours.</Text>
      <View style={styles.statusCard}>
        {['Application Received ✓', 'Documents Verified…', 'Kitchen Inspection', 'Approval'].map((s, i) => (
          <View key={i} style={styles.statusRow}>
            <View style={[styles.statusDot, i <= 1 && styles.statusDotDone]} />
            <Text style={[styles.statusText, i <= 1 && styles.statusTextDone]}>{s}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => setScreen('app_approved')}>
        <Text style={styles.btnText}>Simulate Approval</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnSecondary} onPress={() => setScreen('app_rejected')}>
        <Text style={styles.btnSecondaryText}>Simulate Rejection</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFF8E7', alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#FFC50A',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  iconText: { fontSize: 44 },
  title: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 30, marginBottom: 8, textAlign: 'center' },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.55, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  statusCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 12, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ddd' },
  statusDotDone: { backgroundColor: '#22C55E' },
  statusText: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.4 },
  statusTextDone: { fontFamily: 'Inter_700Bold', opacity: 1 },
  btn: {
    width: '100%', backgroundColor: '#FFC50A', borderRadius: 12, padding: 13, alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  btnSecondary: { width: '100%', padding: 10, alignItems: 'center' },
  btnSecondaryText: { fontFamily: 'Inter_700Bold', fontSize: 13, opacity: 0.4 },
})
