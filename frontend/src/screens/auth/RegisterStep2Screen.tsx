import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'

export default function RegisterStep2Screen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const [form, setForm] = useState({
    company_name: navParams.company_name ?? '',
    address:      navParams.address      ?? '',
    city:         navParams.city         ?? '',
    state:        navParams.state        ?? '',
    country:      navParams.country      ?? 'India',
    postal_code:  navParams.postal_code  ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.company_name.trim()) e.company_name = 'Kitchen name is required'
    if (!form.address.trim())      e.address      = 'Address is required'
    if (!form.city.trim())         e.city         = 'City is required'
    if (!form.state.trim())        e.state        = 'State is required'
    if (!form.postal_code.trim())  e.postal_code  = 'Postal code is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (!validate()) return
    setScreen('register_3', {
      ...navParams,
      company_name: form.company_name,
      address:      form.address,
      city:         form.city,
      state:        form.state,
      country:      form.country,
      postal_code:  form.postal_code,
    })
  }

  const fields = [
    { key: 'company_name', label: 'Kitchen / Company Name', placeholder: "Priya's Kitchen" },
    { key: 'address',      label: 'Address',                placeholder: '14, Kamaraj Street' },
    { key: 'city',         label: 'City',                   placeholder: 'Coimbatore' },
    { key: 'state',        label: 'State',                  placeholder: 'Tamil Nadu' },
    { key: 'country',      label: 'Country',                placeholder: 'India' },
    { key: 'postal_code',  label: 'Postal Code',            placeholder: '641001' },
  ]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('register_email_otp', navParams)}><Text style={styles.back}>←</Text></TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Register — Step 3 of 5</Text>
          <Text style={styles.sub}>Kitchen Details</Text>
        </View>
        <View style={styles.steps}>
          {[1,2,3,4,5].map(i => <View key={i} style={[styles.step, i <= 3 && styles.stepActive]} />)}
        </View>
      </View>

      <View style={styles.card}>
        {fields.map(f => (
          <View key={f.key} style={styles.fieldWrap}>
            <Text style={styles.label}>{f.label.toUpperCase()}</Text>
            <TextInput
              placeholder={f.placeholder}
              value={(form as Record<string, string>)[f.key]}
              onChangeText={v => set(f.key, v)}
              style={[styles.input, errors[f.key] && styles.inputError]}
            />
            {errors[f.key] ? <Text style={styles.errorText}>{errors[f.key]}</Text> : null}
          </View>
        ))}
        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Next: Documents →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF' },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  back: { fontSize: 22 },
  title: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 22 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.45 },
  steps: { flexDirection: 'row', gap: 4 },
  step: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#000', opacity: 0.2 },
  stepActive: { width: 22, opacity: 1 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18, gap: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  fieldWrap: {},
  label: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.5, opacity: 0.5, marginBottom: 5 },
  input: {
    fontFamily: 'Inter_400Regular', fontSize: 14,
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 10,
    paddingHorizontal: 13, paddingVertical: 11,
  },
  inputError: { borderColor: '#FF3B30', backgroundColor: '#FEF3F2' },
  errorText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#FF3B30', marginTop: 3 },
  btn: {
    backgroundColor: '#FFC50A', borderRadius: 12, padding: 13, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
})
