import React, { useState, useRef } from 'react'
import {
  View, Text, TextInput, StyleSheet, ActivityIndicator,
  NativeSyntheticEvent, TextInputKeyPressEventData, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import { sendEmailOtp, verifyEmailOtp } from '../../../../backend/services/brevoService'
import { getVendorStatus } from '../../../../backend/services/vendorService'
import { useVendor } from '../../context/VendorContext'
import type { Screen } from '../../types'

export default function AuthScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { loadVendor, clearVendor } = useVendor()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState<'email' | 'otp'>('email')
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

  // ── Send OTP ──────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!isValidEmail(email)) return
    setLoading(true)
    setError('')
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

  // ── Verify OTP then check vendor status in Firestore ──────────────────────
  const handleVerify = async (code: string) => {
    if (code.length !== 6) return
    const otpResult = verifyEmailOtp(email, code)
    if (!otpResult.success) {
      setError(otpResult.message)
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
      return
    }

    // OTP verified — now check vendor status in Firestore
    setLoading(true)
    const status = await getVendorStatus(email)

    if (status === 'approved' || status === 'pending' || status === 'rejected') {
      await loadVendor(email) // load full vendor data into context
    }

    setLoading(false)

    switch (status) {
      case 'approved':   setScreen('dashboard');    break
      case 'pending':    setScreen('app_review');   break
      case 'rejected':   setScreen('app_rejected'); break
      case 'not_found':
        clearVendor()
        setError('No account found for this email. Please register first.')
        setStep('email')
        setOtp(['', '', '', '', '', ''])
        break
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return
    setLoading(true)
    setError('')
    const result = await sendEmailOtp(email)
    setLoading(false)
    if (result.success) {
      startCooldown()
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } else {
      setError(result.message)
    }
  }

  const handleOtpChange = (idx: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '')
    const next = [...otp]
    next[idx] = clean
    setOtp(next)
    setError('')
    if (clean && idx < 5) inputRefs.current[idx + 1]?.focus()
    if (clean && idx === 5 && next.every(d => d)) {
      setTimeout(() => handleVerify(next.join('')), 200)
    }
  }

  const handleOtpKeyPress = (idx: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handleBack = () => {
    setStep('email')
    setOtp(['', '', '', '', '', ''])
    setError('')
    if (cooldownRef.current) clearInterval(cooldownRef.current)
    setResendCooldown(0)
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.mascot}>
          <Text style={styles.mascotIcon}>🍽️</Text>
        </View>
        <Text style={styles.brand}>FEAZTO</Text>
        <Text style={styles.sub}>Vendor Partner App</Text>

        <View style={styles.card}>
          {step === 'email' ? (
            <>
              <Text style={styles.cardTitle}>Welcome back!</Text>
              <Text style={styles.cardSub}>Enter your registered email address</Text>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                placeholder="you@example.com"
                value={email}
                onChangeText={t => { setEmail(t.trim()); setError('') }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, error ? styles.inputError : null]}
                returnKeyType="done"
                onSubmitEditing={handleSendOtp}
                editable={!loading}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity
                style={[styles.btn, isValidEmail(email) && !loading ? styles.btnActive : null]}
                onPress={handleSendOtp}
                disabled={!isValidEmail(email) || loading}
              >
                {loading
                  ? <ActivityIndicator color="#000" />
                  : <Text style={styles.btnText}>Get OTP →</Text>
                }
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>Verify OTP</Text>
              <Text style={styles.cardSub}>6-digit code sent to{'\n'}{email}</Text>
              <View style={styles.otpRow}>
                {otp.map((val, idx) => (
                  <TextInput
                    key={idx}
                    ref={el => { inputRefs.current[idx] = el }}
                    value={val}
                    onChangeText={v => handleOtpChange(idx, v)}
                    onKeyPress={e => handleOtpKeyPress(idx, e)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    style={[styles.otpBox, val ? styles.otpBoxFilled : null]}
                  />
                ))}
              </View>

              {/* Resend */}
              <View style={styles.resendWrap}>
                {resendCooldown > 0 ? (
                  <Text style={styles.cooldownText}>Resend in {resendCooldown}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleResend} disabled={loading}>
                    <Text style={[styles.resendText, loading && styles.dimmed]}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.btn, otp.every(d => d) && !loading ? styles.btnActive : null]}
                onPress={() => handleVerify(otp.join(''))}
                disabled={!otp.every(d => d) || loading}
              >
                {loading
                  ? <ActivityIndicator color="#000" />
                  : <Text style={styles.btnText}>Verify &amp; Login →</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity style={styles.changeBtn} onPress={handleBack}>
                <Text style={styles.changeBtnText}>← Change email</Text>
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

        <Text style={styles.tos}>
          By continuing you agree to FEAZTO's Terms &amp; Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1, backgroundColor: '#FFF8E7',
    alignItems: 'center', paddingHorizontal: 24, paddingTop: 28, paddingBottom: 24,
  },
  mascot: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFC50A',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: 10,
  },
  mascotIcon: { fontSize: 40 },
  brand: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 38, letterSpacing: 1.5, marginBottom: 2 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.45, marginBottom: 28 },
  card: {
    width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6,
  },
  cardTitle: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 22, marginBottom: 4 },
  cardSub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.5, marginBottom: 18, lineHeight: 20 },
  label: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1, marginBottom: 6 },
  input: {
    width: '100%', fontFamily: 'Inter_400Regular', fontSize: 15,
    backgroundColor: '#FFF8E7', borderWidth: 2, borderColor: '#000',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16,
  },
  inputError: { borderColor: '#e53e3e' },
  otpRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 16 },
  otpBox: {
    width: 42, height: 50, fontFamily: 'BarlowCondensed_700Bold', fontSize: 24,
    textAlign: 'center', backgroundColor: '#FFF8E7', borderWidth: 2, borderColor: '#bbb', borderRadius: 10,
  },
  otpBoxFilled: {
    backgroundColor: '#FFC50A', borderColor: '#000',
    shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  resendWrap: { alignItems: 'center', marginBottom: 14 },
  resendText: { fontFamily: 'Inter_700Bold', fontSize: 13, textDecorationLine: 'underline', opacity: 0.7 },
  cooldownText: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.5 },
  dimmed: { opacity: 0.4 },
  errorText: {
    fontFamily: 'Inter_700Bold', fontSize: 12, color: '#e53e3e',
    textAlign: 'center', marginBottom: 12,
  },
  btn: { backgroundColor: '#ddd', borderRadius: 12, padding: 13, alignItems: 'center', marginBottom: 10 },
  btnActive: {
    backgroundColor: '#FFC50A',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  changeBtn: { alignItems: 'center', paddingVertical: 8 },
  changeBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, opacity: 0.4 },
  footer: { marginTop: 16, alignItems: 'center', gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.5 },
  link: { fontFamily: 'Inter_700Bold', fontSize: 13, textDecorationLine: 'underline' },
  tos: {
    marginTop: 16, fontFamily: 'Inter_400Regular', fontSize: 11,
    opacity: 0.3, textAlign: 'center', paddingBottom: 8,
  },
})
