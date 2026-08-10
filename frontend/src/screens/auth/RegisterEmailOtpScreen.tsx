import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  View, Text, TextInput, StyleSheet, ActivityIndicator,
  NativeSyntheticEvent, TextInputKeyPressEventData,
} from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { sendEmailOtp, verifyEmailOtp } from '../../../../backend/services/brevoService'

const RESEND_SECONDS = 60

export default function RegisterEmailOtpScreen({
  setScreen,
  navParams,
}: {
  setScreen: SetScreen
  navParams: NavParams
}) {
  const email = navParams.email ?? ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [sending, setSending] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const inputRefs = useRef<(TextInput | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCountdown = useCallback(() => {
    setCountdown(RESEND_SECONDS)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0 }
        return c - 1
      })
    }, 1000)
  }, [])

  const sendOtp = useCallback(async () => {
    setSending(true)
    setError('')
    const result = await sendEmailOtp(email)
    setSending(false)
    if (result.success) {
      setSuccess(`Code sent to ${email}`)
      setTimeout(() => setSuccess(''), 3000)
      startCountdown()
    } else {
      setError(result.message)
    }
  }, [email, startCountdown])

  // Send OTP as soon as screen mounts
  useEffect(() => {
    sendOtp()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const handleChange = (idx: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 1)
    const next = [...otp]
    next[idx] = clean
    setOtp(next)
    setError('')
    if (clean && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleKeyPress = (idx: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const isComplete = otp.every(d => d !== '')

  const handleVerify = async () => {
    if (!isComplete) return
    setVerifying(true)
    setError('')
    const code = otp.join('')
    const result = verifyEmailOtp(email, code)
    setVerifying(false)
    if (result.success) {
      // Proceed to Kitchen Info (Step 2)
      setScreen('register_2', { ...navParams })
    } else {
      setError(result.message)
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }

  return (
    <View style={s.container}>
      {/* Header */}
      <TouchableOpacity onPress={() => setScreen('register_1', navParams)} style={s.backBtn}>
        <Text style={s.backText}>←</Text>
      </TouchableOpacity>

      {/* Step indicator */}
      <View style={s.steps}>
        {[1, 2, 3, 4, 5].map(i => (
          <View key={i} style={[s.step, i === 1 && s.stepDone, i === 2 && s.stepActive]} />
        ))}
      </View>

      {/* Title */}
      <Text style={s.title}>Verify Email</Text>
      <Text style={s.sub}>
        Enter the 6-digit code sent to{'\n'}
        <Text style={s.emailHighlight}>{email}</Text>
      </Text>

      {/* Card */}
      <View style={s.card}>

        {/* Sending state */}
        {sending ? (
          <View style={s.sendingRow}>
            <ActivityIndicator color="#000" size="small" />
            <Text style={s.sendingText}>Sending verification code…</Text>
          </View>
        ) : (
          <>
            {/* OTP boxes */}
            <View style={s.otpRow}>
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
                  style={[
                    s.otpBox,
                    val ? s.otpBoxFilled : null,
                    error ? s.otpBoxError : null,
                  ]}
                />
              ))}
            </View>

            {/* Error / success */}
            {!!error && <Text style={s.errorText}>{error}</Text>}
            {!!success && <Text style={s.successText}>{success}</Text>}

            {/* Verify button */}
            <TouchableOpacity
              style={[s.verifyBtn, isComplete && !verifying && s.verifyBtnActive]}
              onPress={handleVerify}
              disabled={!isComplete || verifying}
            >
              {verifying
                ? <ActivityIndicator color="#000" size="small" />
                : <Text style={s.verifyBtnText}>Verify & Continue →</Text>
              }
            </TouchableOpacity>

            {/* Resend row */}
            <View style={s.resendRow}>
              <Text style={s.resendLabel}>Didn't receive it? </Text>
              {countdown > 0 ? (
                <Text style={s.resendCountdown}>Resend in {countdown}s</Text>
              ) : (
                <TouchableOpacity onPress={sendOtp}>
                  <Text style={s.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>

      {/* Info note */}
      <Text style={s.note}>
        Check your spam folder if you don't see it in your inbox.
      </Text>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1, width: '100%', backgroundColor: '#FFF8E7', padding: 24,
  },
  backBtn: { marginBottom: 20 },
  backText: { fontSize: 24, color: '#000' },

  steps: { flexDirection: 'row', gap: 5, marginBottom: 28 },
  step: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#000', opacity: 0.15 },
  stepDone: { width: 14, backgroundColor: '#22C55E', opacity: 1 },
  stepActive: { width: 22, opacity: 1, backgroundColor: '#000' },

  title: {
    fontFamily: 'BarlowCondensed_700Bold', fontSize: 34,
    color: '#000', marginBottom: 8,
  },
  sub: {
    fontFamily: 'Inter_400Regular', fontSize: 14,
    color: '#000', opacity: 0.55, lineHeight: 22, marginBottom: 28,
  },
  emailHighlight: {
    fontFamily: 'Inter_700Bold', color: '#000', opacity: 1,
  },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },

  sendingRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 16 },
  sendingText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#000', opacity: 0.5 },

  otpRow: { flexDirection: 'row', gap: 9, justifyContent: 'center', marginBottom: 18 },
  otpBox: {
    width: 44, height: 54, textAlign: 'center',
    fontFamily: 'BarlowCondensed_700Bold', fontSize: 26, color: '#000',
    backgroundColor: '#F5F5F5', borderWidth: 2, borderColor: '#ddd', borderRadius: 12,
  },
  otpBoxFilled: {
    backgroundColor: '#FFC50A', borderColor: '#000',
    shadowColor: '#000', shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  otpBoxError: { borderColor: '#FF3B30', backgroundColor: '#FEF3F2' },

  errorText: {
    fontFamily: 'Inter_700Bold', fontSize: 12, color: '#FF3B30',
    textAlign: 'center', marginBottom: 12,
  },
  successText: {
    fontFamily: 'Inter_700Bold', fontSize: 12, color: '#22C55E',
    textAlign: 'center', marginBottom: 12,
  },

  verifyBtn: {
    backgroundColor: '#E5E5E5', borderRadius: 12, padding: 14,
    alignItems: 'center', marginBottom: 16,
  },
  verifyBtnActive: {
    backgroundColor: '#FFC50A',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  verifyBtnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },

  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resendLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#000', opacity: 0.45 },
  resendCountdown: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#000', opacity: 0.35 },
  resendLink: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#000', textDecorationLine: 'underline' },

  note: {
    fontFamily: 'Inter_400Regular', fontSize: 12,
    color: '#000', opacity: 0.3, textAlign: 'center', marginTop: 20,
  },
})
