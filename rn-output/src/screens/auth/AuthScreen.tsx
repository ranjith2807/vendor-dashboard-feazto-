import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { Screen } from '../../types'
import { border3D } from '../../theme'

export default function AuthScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState<'phone' | 'otp'>('phone')

  return (
    <View style={styles.container}>
      <View style={styles.mascot}>
        <Text style={styles.mascotIcon}>🍽️</Text>
      </View>
      <Text style={styles.brand}>FEAZTO</Text>
      <Text style={styles.sub}>Vendor Partner App</Text>

      <View style={styles.card}>
        {step === 'phone' ? (
          <>
            <Text style={styles.cardTitle}>Welcome back!</Text>
            <Text style={styles.cardSub}>Enter your registered mobile number</Text>
            <Text style={styles.label}>MOBILE NUMBER</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
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
              onPress={() => phone.length === 10 && setStep('otp')}
              disabled={phone.length !== 10}
            >
              <Text style={styles.btnText}>Get OTP →</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>Verify OTP</Text>
            <Text style={styles.cardSub}>Sent to +91 {phone.slice(0, 5)} {phone.slice(5)}</Text>
            <View style={styles.otpRow}>
              {otp.map((val, idx) => (
                <TextInput
                  key={idx}
                  value={val}
                  onChangeText={v => {
                    if (!/^\d?$/.test(v)) return
                    const next = [...otp]
                    next[idx] = v
                    setOtp(next)
                    if (v && idx < 5) return
                    if (next.every(d => d) && idx === 5) setTimeout(() => setScreen('dashboard'), 400)
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[styles.otpBox, val && styles.otpBoxFilled]}
                />
              ))}
            </View>
            <TouchableOpacity style={[styles.btn, styles.btnActive]} onPress={() => setScreen('dashboard')}>
              <Text style={styles.btnText}>Verify & Login →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnText2} onPress={() => setStep('phone')}>
              <Text style={styles.btnText2Text}>← Change number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setScreen('forgot_password')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <Text style={styles.footerText}>New vendor? </Text>
          <TouchableOpacity onPress={() => setScreen('register_1')}>
            <Text style={styles.link}>Register here →</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.tos}>By continuing you agree to FEAZTO's Terms & Privacy Policy</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFF8E7', alignItems: 'center', paddingHorizontal: 24, paddingTop: 28 },
  mascot: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFC50A', alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: 10, ...border3D },
  mascotIcon: { fontSize: 40 },
  brand: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 38, letterSpacing: 1.5, marginBottom: 2 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.45, marginBottom: 28 },
  card: {
    width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6,
    ...border3D,
  },
  cardTitle: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 22, marginBottom: 4 },
  cardSub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.5, marginBottom: 18 },
  label: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1, marginBottom: 6 },
  phoneRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  countryCode: { backgroundColor: '#FFF8E7', borderRadius: 10, paddingHorizontal: 12, justifyContent: 'center', ...border3D },
  countryCodeText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  input: {
    flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15,
    backgroundColor: '#FFF8E7', 
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    ...border3D,
  },
  otpRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 20 },
  otpBox: {
    width: 42, height: 50, fontFamily: 'BarlowCondensed_700Bold', fontSize: 24, textAlign: 'center',
    backgroundColor: '#FFF8E7', borderRadius: 10, ...border3D,
  },
  otpBoxFilled: {
    backgroundColor: '#FFC50A', borderColor: '#000',
    shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  btn: {
    backgroundColor: '#ddd', borderRadius: 12, padding: 13, alignItems: 'center',
  },
  btnActive: {
    backgroundColor: '#FFC50A',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
    ...border3D,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  btnText2: { alignItems: 'center', paddingVertical: 8, marginTop: 10 },
  btnText2Text: { fontFamily: 'Inter_700Bold', fontSize: 13, opacity: 0.4 },
  footer: { marginTop: 16, alignItems: 'center', gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.5 },
  link: { fontFamily: 'Inter_700Bold', fontSize: 13, textDecorationLine: 'underline' },
  tos: { marginTop: 'auto', fontFamily: 'Inter_400Regular', fontSize: 11, opacity: 0.3, textAlign: 'center', paddingTop: 16 },
})
