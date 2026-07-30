import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'

export default function RegisterStep1Screen({ setScreen }: { setScreen: SetScreen }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (form.phone.length !== 10) e.phone = 'Enter valid 10-digit number'
    if (!form.email.includes('@')) e.email = 'Enter valid email'
    if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) e.confirm = "Passwords don't match"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'Priya Krishnan', secure: false, keyboard: 'default' as const },
    { key: 'phone', label: 'Mobile Number', placeholder: '98765 43210', secure: false, keyboard: 'phone-pad' as const },
    { key: 'email', label: 'Email Address', placeholder: 'you@email.com', secure: false, keyboard: 'email-address' as const },
    { key: 'password', label: 'Password', placeholder: 'Min. 8 characters', secure: true, keyboard: 'default' as const },
    { key: 'confirm', label: 'Confirm Password', placeholder: 'Re-enter password', secure: true, keyboard: 'default' as const },
  ]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('onboarding')}><Text style={styles.back}>←</Text></TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Register — Step 1 of 4</Text>
          <Text style={styles.sub}>Personal Information</Text>
        </View>
        <View style={styles.steps}>
          {[1,2,3,4].map(i => <View key={i} style={[styles.step, i === 1 && styles.stepActive]} />)}
        </View>
      </View>

      <View style={styles.card}>
        {fields.map(f => (
          <View key={f.key} style={styles.fieldWrap}>
            <Text style={styles.label}>{f.label.toUpperCase()}</Text>
            <TextInput
              placeholder={f.placeholder}
              value={(form as any)[f.key]}
              onChangeText={v => set(f.key, v)}
              secureTextEntry={f.secure}
              keyboardType={f.keyboard}
              style={[styles.input, errors[f.key] && styles.inputError]}
            />
            {errors[f.key] ? <Text style={styles.errorText}>{errors[f.key]}</Text> : null}
          </View>
        ))}
        <TouchableOpacity style={styles.btn} onPress={() => validate() && setScreen('register_2')}>
          <Text style={styles.btnText}>Next: Kitchen Info →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already registered? </Text>
        <TouchableOpacity onPress={() => setScreen('auth')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF' },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  back: { fontSize: 22, marginRight: 4 },
  title: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 22 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.45 },
  steps: { flexDirection: 'row', gap: 4 },
  step: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#000', opacity: 0.2 },
  stepActive: { width: 22, opacity: 1 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18, gap: 14,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  fieldWrap: {},
  label: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.5, opacity: 0.5, marginBottom: 5 },
  input: {
    fontFamily: 'Inter_400Regular', fontSize: 14,
    backgroundColor: '#FFFFFF', borderRadius: 10,
    paddingHorizontal: 13, paddingVertical: 11,
  },
  inputError: { borderColor: '#FF3B30', backgroundColor: '#FEF3F2' },
  errorText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#FF3B30', marginTop: 3 },
  btn: {
    backgroundColor: '#FFC50A', borderRadius: 12, padding: 13, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  loginText: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.5 },
  loginLink: { fontFamily: 'Inter_700Bold', fontSize: 13, textDecorationLine: 'underline' },
})
