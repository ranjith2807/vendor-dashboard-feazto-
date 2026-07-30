import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'

export default function NewPasswordScreen({ setScreen }: { setScreen: SetScreen }) {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const valid = pw.length >= 8 && pw === confirm

  if (done) return (
    <View style={styles.success}>
      <View style={styles.tick}><Text style={styles.tickIcon}>✓</Text></View>
      <Text style={styles.successTitle}>Password Changed!</Text>
      <Text style={styles.successSub}>Your password has been updated. You can now log in.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => setScreen('auth')}>
        <Text style={styles.btnText}>Back to Login →</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setScreen('reset_otp')} style={styles.back}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>New Password</Text>
      <Text style={styles.sub}>Choose a strong password with at least 8 characters.</Text>
      <View style={styles.card}>
        {[{ label: 'New Password', val: pw, set: setPw }, { label: 'Confirm Password', val: confirm, set: setConfirm }].map(f => (
          <View key={f.label} style={styles.fieldWrap}>
            <Text style={styles.label}>{f.label.toUpperCase()}</Text>
            <TextInput
              secureTextEntry value={f.val} onChangeText={f.set}
              style={styles.input}
            />
          </View>
        ))}
        {confirm.length > 0 && !valid && (
          <Text style={styles.error}>Passwords don't match or too short</Text>
        )}
        <TouchableOpacity style={[styles.btn, valid && styles.btnActive]} onPress={() => valid && setDone(true)} disabled={!valid}>
          <Text style={styles.btnText}>Set Password →</Text>
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
    backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 14,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  fieldWrap: {},
  label: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.5, opacity: 0.5, marginBottom: 6 },
  input: {
    fontFamily: 'Inter_400Regular', fontSize: 15,
    backgroundColor: '#F8F9FA', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  error: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#FF3B30' },
  btn: { backgroundColor: '#ddd', borderRadius: 12, padding: 13, alignItems: 'center' },
  btnActive: {
    backgroundColor: '#FFC50A',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  success: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 32 },
  tick: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#22C55E',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  tickIcon: { fontSize: 36, color: '#fff' },
  successTitle: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 30, marginBottom: 8, textAlign: 'center' },
  successSub: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.5, marginBottom: 28, textAlign: 'center' },
})
