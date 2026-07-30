import React, { useState, useRef } from 'react'
import { View, Text, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'

export default function ResetOtpScreen({ setScreen }: { setScreen: SetScreen }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [resendMsg, setResendMsg] = useState('')
  const inputRefs = useRef<(TextInput | null)[]>([])

  const verifyOtp = (code: string) => {
    if (code.length < 6) {
      setError('Please enter a valid 6-digit OTP.')
      return
    }
    if (code === '000000') {
      setError('Incorrect OTP. Please try again.')
      return
    }
    setError('')
    setScreen('new_password')
  }

  const handleChange = (idx: number, val: string) => {
    setError('')
    setResendMsg('')
    const clean = val.replace(/[^0-9]/g, '')
    const next = [...otp]
    next[idx] = clean
    setOtp(next)

    if (clean && idx < 5) {
      inputRefs.current[idx + 1]?.focus()
    }

    if (clean && idx === 5) {
      const code = next.join('')
      if (code.length === 6) {
        setTimeout(() => verifyOtp(code), 200)
      }
    }
  }

  const handleKeyPress = (idx: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handleVerifyPress = () => {
    const code = otp.join('')
    verifyOtp(code)
  }

  const handleResend = () => {
    setResendMsg('New OTP sent successfully!')
    setOtp(['', '', '', '', '', ''])
    setError('')
    inputRefs.current[0]?.focus()
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
              key={idx}
              ref={el => { inputRefs.current[idx] = el }}
              value={val}
              onChangeText={v => handleChange(idx, v)}
              onKeyPress={e => handleKeyPress(idx, e)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              style={[styles.otpBox, val && styles.otpBoxFilled]}
            />
          ))}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {resendMsg ? <Text style={styles.resendSuccessText}>{resendMsg}</Text> : null}
        <TouchableOpacity style={styles.btn} onPress={handleVerifyPress}>
          <Text style={styles.btnText}>Verify →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resend} onPress={handleResend}>
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
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  otpRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 22 },
  otpBox: {
    width: 42, height: 50, textAlign: 'center',
    fontFamily: 'BarlowCondensed_700Bold', fontSize: 24,
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 10,
  },
  otpBoxFilled: {
    backgroundColor: '#FFC50A', borderColor: '#000', borderWidth: 2,
    shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  errorText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#FF3B30', textAlign: 'center', marginBottom: 12 },
  resendSuccessText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#22C55E', textAlign: 'center', marginBottom: 12 },
  btn: {
    backgroundColor: '#FFC50A', borderRadius: 12, padding: 13, alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  resend: { alignItems: 'center', padding: 8 },
  resendText: { fontFamily: 'Inter_700Bold', fontSize: 13, opacity: 0.4 },
})
