import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import type { SetScreen } from '../../types'

export default function ForgotPasswordScreen({ setScreen }: { setScreen: SetScreen }) {
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('auth')} style={styles.back}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.sub}>Enter your registered mobile number and we'll send a reset OTP.</Text>

      <View style={styles.card}>
        {!sent ? (
          <>
            <Text style={styles.label}>MOBILE NUMBER</Text>
            <View style={styles.phoneRow}>
              <View style={styles.cc}><Text style={styles.ccText}>+91</Text></View>
              <TextInput
                placeholder="98765 43210"
                value={phone}
                onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>
            <TouchableOpacity
              style={[styles.btn, phone.length === 10 && styles.btnActive]}
              onPress={() => phone.length === 10 && setSent(true)}
            >
              <Text style={styles.btnText}>Send OTP →</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.sentWrap}>
            <Text style={styles.sentIcon}>📲</Text>
            <Text style={styles.sentTitle}>OTP Sent!</Text>
            <Text style={styles.sentSub}>Check SMS on +91 {phone.slice(0, 5)} {phone.slice(5)}</Text>
            <TouchableOpacity style={[styles.btn, styles.btnActive]} onPress={() => setScreen('reset_otp')}>
              <Text style={styles.btnText}>Enter OTP →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF', padding: 20 },
  back: { marginBottom: 16 },
  backText: { fontSize: 22 },
  title: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 32, marginBottom: 6 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.5, marginBottom: 28 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  label: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.5, opacity: 0.5, marginBottom: 6 },
  phoneRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  cc: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, justifyContent: 'center' },
  ccText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  input: {
    flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15,
    backgroundColor: '#FFFFFF',  borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  btn: { backgroundColor: '#ddd', borderRadius: 12, padding: 13, alignItems: 'center' },
  btnActive: {
    backgroundColor: '#FFC50A',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  sentWrap: { alignItems: 'center', paddingVertical: 10 },
  sentIcon: { fontSize: 48, marginBottom: 12 },
  sentTitle: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 22, marginBottom: 6 },
  sentSub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.5, marginBottom: 20, textAlign: 'center' },
})
