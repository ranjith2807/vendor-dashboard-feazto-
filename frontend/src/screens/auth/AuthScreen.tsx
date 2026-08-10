import React, { useState } from 'react'
import {
  View, Text, TextInput, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import { getVendorByEmail } from '../../../../backend/services/vendorService'
import { getVendorStatus } from '../../../../backend/services/vendorService'
import { useVendor } from '../../context/VendorContext'
import type { Screen } from '../../types'

export default function AuthScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { loadVendor, clearVendor } = useVendor()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const canSubmit = isValidEmail(email) && password.length >= 1 && !loading

  const handleLogin = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')

    try {
      // Check vendor exists and get their status
      const status = await getVendorStatus(email.trim().toLowerCase())

      if (status === 'not_found') {
        setError('No account found for this email. Please register first.')
        setLoading(false)
        return
      }

      // Fetch the full vendor record to verify password
      const vendorRecord = await getVendorByEmail(email.trim().toLowerCase())

      if (!vendorRecord) {
        setError('Account not found. Please register first.')
        setLoading(false)
        return
      }

      // Password check — compare against stored password field
      if (vendorRecord.password && vendorRecord.password !== password) {
        setError('Incorrect password. Please try again.')
        setLoading(false)
        return
      }

      // Load vendor into context
      await loadVendor(email.trim().toLowerCase())
      setLoading(false)

      switch (status) {
        case 'approved':  setScreen('dashboard');    break
        case 'pending':   setScreen('app_review');   break
        case 'rejected':  setScreen('app_rejected'); break
        default:          setScreen('dashboard');    break
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={s.mascot}>
          <Text style={s.mascotIcon}>🍽️</Text>
        </View>
        <Text style={s.brand}>FEAZTO</Text>
        <Text style={s.sub}>Vendor Partner App</Text>

        {/* Login card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Welcome back!</Text>
          <Text style={s.cardSub}>Sign in to your vendor account</Text>

          {/* Email */}
          <Text style={s.label}>EMAIL ADDRESS</Text>
          <TextInput
            placeholder="you@example.com"
            value={email}
            onChangeText={t => { setEmail(t.trim()); setError('') }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={[s.input, !!error && s.inputError]}
            returnKeyType="next"
            editable={!loading}
          />

          {/* Password */}
          <Text style={s.label}>PASSWORD</Text>
          <View style={s.pwdWrap}>
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={t => { setPassword(t); setError('') }}
              secureTextEntry={!showPwd}
              style={[s.input, s.pwdInput, !!error && s.inputError]}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!loading}
            />
            <TouchableOpacity
              style={s.eyeBtn}
              onPress={() => setShowPwd(v => !v)}
            >
              <Text style={s.eyeIcon}>{showPwd ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {/* Error */}
          {!!error && <Text style={s.errorText}>{error}</Text>}

          {/* Login button */}
          <TouchableOpacity
            style={[s.btn, canSubmit && s.btnActive]}
            onPress={handleLogin}
            disabled={!canSubmit}
          >
            {loading
              ? <ActivityIndicator color="#000" />
              : <Text style={s.btnText}>Login →</Text>
            }
          </TouchableOpacity>

          {/* Forgot password */}
          <TouchableOpacity style={s.forgotBtn} onPress={() => setScreen('forgot_password')}>
            <Text style={s.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Register link */}
        <View style={s.footer}>
          <View style={s.row}>
            <Text style={s.footerText}>New vendor? </Text>
            <TouchableOpacity onPress={() => setScreen('register_1')}>
              <Text style={s.link}>Register here →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.tos}>
          By continuing you agree to FEAZTO's Terms &amp; Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
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
  cardTitle: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 26, marginBottom: 4 },
  cardSub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.5, marginBottom: 20 },

  label: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1, marginBottom: 6, opacity: 0.6 },
  input: {
    width: '100%', fontFamily: 'Inter_400Regular', fontSize: 15,
    backgroundColor: '#FFF8E7', borderWidth: 2, borderColor: '#000',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16,
  },
  inputError: { borderColor: '#e53e3e' },

  pwdWrap: { position: 'relative', width: '100%' },
  pwdInput: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: 14, top: 0, bottom: 16, justifyContent: 'center' },
  eyeIcon: { fontSize: 18, opacity: 0.5 },

  errorText: {
    fontFamily: 'Inter_700Bold', fontSize: 12, color: '#e53e3e',
    textAlign: 'center', marginBottom: 12, marginTop: -8,
  },
  btn: {
    backgroundColor: '#ddd', borderRadius: 12, padding: 14,
    alignItems: 'center', marginBottom: 8,
  },
  btnActive: {
    backgroundColor: '#FFC50A',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 18, letterSpacing: 1 },

  forgotBtn: { alignItems: 'center', paddingVertical: 8 },
  forgotText: { fontFamily: 'Inter_700Bold', fontSize: 13, opacity: 0.45, textDecorationLine: 'underline' },

  footer: { marginTop: 20, alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.5 },
  link: { fontFamily: 'Inter_700Bold', fontSize: 13, textDecorationLine: 'underline' },
  tos: {
    marginTop: 16, fontFamily: 'Inter_400Regular', fontSize: 11,
    opacity: 0.3, textAlign: 'center', paddingBottom: 8,
  },
})
