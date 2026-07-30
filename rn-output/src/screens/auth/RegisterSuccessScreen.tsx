import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'

export default function RegisterSuccessScreen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}><Text style={styles.iconText}>🎉</Text></View>
      <Text style={styles.title}>Application Submitted!</Text>
      <Text style={styles.sub}>Your vendor application has been received. We'll review and get back within 24-48 hours.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => setScreen('app_review')}>
        <Text style={styles.btnText}>Check Status →</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnSecondary} onPress={() => setScreen('auth')}>
        <Text style={styles.btnSecondaryText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFC50A',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  iconText: { fontSize: 48 },
  title: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 32, marginBottom: 10, textAlign: 'center' },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 14, opacity: 0.55, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  btn: {
    width: '100%', backgroundColor: '#FFC50A', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  btnSecondary: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 13, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  btnSecondaryText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
})
