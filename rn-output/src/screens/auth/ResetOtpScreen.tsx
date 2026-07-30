import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'

export default function ResetOtpScreen({ setScreen }: { setScreen: SetScreen }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[idx] = val; setOtp(next)
    if (next.every(d => d) && idx === 5) setTimeout(() => setScreen('new_password'), 400)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('forgot_password')} style={styles.back}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.sub}>6-digit code sent to your mobile number</Text>
      <View style={styles.card}>
        <View style={styles.otpRow}>
          {otp.map((val, idx) => (
            <TextInput
              key={idx} value={val}
              onChangeText={v => handleChange(idx, v)}
              keyboardType="number-pad" maxLength={1}
              style={[styles.otpBox, val && styles.otpBoxFilled]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => setScreen('new_password')}>
          <Text style={styles.btnText}>Verify →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resend}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
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
    backgroundColor: '#fff', borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  otpRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 22 },
  otpBox: {
    width: 42, height: 50, textAlign: 'center',
    fontFamily: 'BarlowCondensed_700Bold', fontSize: 24,
    backgroundColor: '#F8F9FA', borderRadius: 10,
  },
  otpBoxFilled: {
    backgroundColor: '#FFC50A', borderColor: '#000',
    shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  btn: {
    backgroundColor: '#FFC50A', borderRadius: 12, padding: 13, alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  resend: { alignItems: 'center', padding: 8 },
  resendText: { fontFamily: 'Inter_700Bold', fontSize: 13, opacity: 0.4 },
})
