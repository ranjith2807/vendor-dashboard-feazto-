import React, { useState, useRef } from 'react'
import {
  View, Text, TextInput, StyleSheet, ActivityIndicator,
  NativeSyntheticEvent, TextInputKeyPressEventData,
} from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import { sendEmailOtp, verifyEmailOtp } from '../../lib/brevo'
import type { SetScreen } from '../../types'

export default function ForgotPasswordScreen({ setScreen }: { setScreen: SetScreen }) {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'done'>('email')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRefs = useRef<(TextInput | null)[]>([])

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const startCooldown = () => {
    setResendCooldown(30)
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleSend = async () => {
    if (!isValidEmail(email)) return
    setLoading(true); setError('')
    const result = await sendEmailOtp(email)
    setLoading(false)
    if (result.success) {
      setStep('otp')
      startCooldown()
      setTimeout(() => inputRefs.current[0]?.focus(), 300)
    } else {
      setError(result.message)
    }
  }

  const handleVerify = (code: string) => {
    if (code.length !== 6) return
    const result = verifyEmailOtp(email, code)
    if (result.success) {
      setScreen('new_password', { email })
    } else {
      setError(result.message)
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }

  const handleOtpChange = (idx: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '')
    const next = [...otp]; next[idx] = clean; setOtp(next)
    setError('')
    if (clean && idx < 5) inputRefs.current[idx + 1]?.focus()
    if (clean && idx === 5 && next.every(d => d)) setTimeout(() => handleVerify(next.join('')), 200)
  }

  const handleKeyPress = (idx: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus()
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setLoading(true); setError('')
    const result = await sendEmailOtp(email)
    setLoading(false)
    if (result.success) { startCooldown(); setOtp(['', '', '', '', '', '']) }
    else setError(result.message)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('auth')} style={styles.back}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Forgot Password?</Text>

      <View style={styles.card}>
        {step === 'email' && (
          <>
            <Text style={styles.sub}>Enter your registered email and we'll send a reset OTP.</Text>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              placeholder="you@example.com"
              value={email}
              onChangeText={t => { setEmail(t.trim()); setError('') }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={handleSend}
              editable={!loading}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.btn, isValidEmail(email) && !loading ? styles.btnActive : null]}
              onPress={handleSend}
              disabled={!isValidEmail(email) || loading}
            >
              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Send OTP →</Text>}
            </TouchableOpacity>
          </>
        )}

        {step === 'otp' && (
          <>
            <Text style={styles.sub}>Enter the 6-digit code sent to{'\n'}{email}</Text>
            <View style={styles.otpRow}>
              {otp.map((val, idx) => (
                <TextInput
                  key={idx}
                  ref={el => { inputRefs.current[idx] = el }}
                  value={val}
                  onChangeText={v => handleOtpChange(idx, v)}
                  onKeyPress={e => handleKeyPress(idx, e)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  style={[styles.otpBox, val ? styles.otpBoxFilled : null]}
                />
              ))}
            </View>
            <View style={styles.resendWrap}>
              {resendCooldown > 0
                ? <Text style={styles.cooldownText}>Resend in {resendCooldown}s</Text>
                : <TouchableOpacity onPress={handleResend} disabled={loading}>
                    <Text style={[styles.resendText, loading && styles.dimmed]}>Resend OTP</Text>
                  </TouchableOpacity>
              }
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.btn, otp.every(d => d) ? styles.btnActive : null]}
              onPress={() => handleVerify(otp.join(''))}
              disabled={!otp.every(d => d)}
            >
              <Text style={styles.btnText}>Verify →</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFF8E7', padding: 20 },
  back: { marginBottom: 16 },
  backText: { fontSize: 22 },
  title: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 32, marginBottom: 20 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.5, marginBottom: 20, lineHeight: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  label: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.5, opacity: 0.5, marginBottom: 6 },
  input: {
    fontFamily: 'Inter_400Regular', fontSize: 15, backgroundColor: '#FFF8E7',
    borderWidth: 2, borderColor: '#000', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16,
  },
  otpRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 16 },
  otpBox: {
    width: 42, height: 50, textAlign: 'center',
    fontFamily: 'BarlowCondensed_700Bold', fontSize: 24,
    backgroundColor: '#FFF8E7', borderWidth: 2, borderColor: '#bbb', borderRadius: 10,
  },
  otpBoxFilled: {
    backgroundColor: '#FFC50A', borderColor: '#000',
    shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  resendWrap: { alignItems: 'center', marginBottom: 14 },
  resendText: { fontFamily: 'Inter_700Bold', fontSize: 13, textDecorationLine: 'underline', opacity: 0.7 },
  cooldownText: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.5 },
  dimmed: { opacity: 0.4 },
  errorText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#e53e3e', textAlign: 'center', marginBottom: 12 },
  btn: { backgroundColor: '#ddd', borderRadius: 12, padding: 13, alignItems: 'center' },
  btnActive: {
    backgroundColor: '#FFC50A',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
})
