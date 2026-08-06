import React, { useState } from 'react'
import {
  View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import { createVendor } from '../../lib/vendorDb'
import type { SetScreen, NavParams } from '../../types'

export default function RegisterStep4Screen({
  setScreen,
  navParams,
}: {
  setScreen: SetScreen
  navParams: NavParams
}) {
  const [form, setForm] = useState({
    bank_name:      '',
    account_number: '',
    ifsc:           '',
    account_holder: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const set = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
    setSubmitError('')
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.bank_name.trim())      e.bank_name      = 'Bank name is required'
    if (!form.account_number.trim()) e.account_number = 'Account number is required'
    if (form.ifsc.trim().length < 11) e.ifsc          = 'Enter a valid 11-character IFSC code'
    if (!form.account_holder.trim()) e.account_holder = 'Account holder name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setSubmitError('')

    const result = await createVendor({
      vendor_name:  navParams.vendor_name  ?? '',
      company_name: navParams.company_name ?? '',
      email:        navParams.email        ?? '',
      phone_number: navParams.phone_number ?? '',
      address:      navParams.address      ?? '',
      city:         navParams.city         ?? '',
      state:        navParams.state        ?? '',
      country:      navParams.country      ?? 'India',
      postal_code:  navParams.postal_code  ?? '',
      documents: {
        fssai:   navParams.doc_fssai   || undefined,
        gst:     navParams.doc_gst     || undefined,
        pan:     navParams.doc_pan     || undefined,
        aadhaar: navParams.doc_aadhaar || undefined,
      },
      bank: {
        bank_name:      form.bank_name.trim(),
        account_number: form.account_number.trim(),
        ifsc:           form.ifsc.trim().toUpperCase(),
        account_holder: form.account_holder.trim(),
      },
    })

    setLoading(false)

    if (result.success) {
      setScreen('register_success')
    } else {
      setSubmitError(result.message)
    }
  }

  const fields: { key: keyof typeof form; label: string; placeholder: string; keyboard?: 'default' | 'numeric' }[] = [
    { key: 'bank_name',      label: 'Bank Name',           placeholder: 'HDFC Bank' },
    { key: 'account_number', label: 'Account Number',      placeholder: '1234 5678 9012', keyboard: 'numeric' },
    { key: 'ifsc',           label: 'IFSC Code',           placeholder: 'HDFC0001234' },
    { key: 'account_holder', label: 'Account Holder Name', placeholder: "Priya's Kitchen" },
  ]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('register_3', navParams)}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Register — Step 4 of 4</Text>
          <Text style={styles.sub}>Bank Account Details</Text>
        </View>
        <View style={styles.steps}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.step, styles.stepActive]} />
          ))}
        </View>
      </View>

      {/* Registration summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Registration Summary</Text>
        <Text style={styles.summaryLine}>👤  {navParams.vendor_name}</Text>
        <Text style={styles.summaryLine}>🍽️  {navParams.company_name}</Text>
        <Text style={styles.summaryLine}>✉️  {navParams.email}</Text>
        <Text style={styles.summaryLine}>📍  {navParams.city}, {navParams.state}</Text>
        <Text style={styles.summaryLine}>
          📄  {[
            navParams.doc_fssai   ? 'FSSAI ✓' : null,
            navParams.doc_gst     ? 'GST ✓'   : null,
            navParams.doc_pan     ? 'PAN ✓'   : null,
            navParams.doc_aadhaar ? 'Aadhaar ✓' : null,
          ].filter(Boolean).join('  ') || 'No documents'}
        </Text>
      </View>

      {/* Bank fields */}
      <View style={styles.card}>
        {fields.map(f => (
          <View key={f.key} style={styles.fieldWrap}>
            <Text style={styles.label}>{f.label.toUpperCase()}</Text>
            <TextInput
              placeholder={f.placeholder}
              value={form[f.key]}
              onChangeText={v => set(f.key, v)}
              style={[styles.input, errors[f.key] && styles.inputError]}
              autoCapitalize={f.key === 'ifsc' ? 'characters' : 'words'}
              keyboardType={f.keyboard ?? 'default'}
            />
            {errors[f.key] ? (
              <Text style={styles.errorText}>{errors[f.key]}</Text>
            ) : null}
          </View>
        ))}

        {submitError ? (
          <Text style={styles.submitError}>{submitError}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#000" />
            : <Text style={styles.btnText}>Submit Application →</Text>
          }
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

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

  summary: {
    backgroundColor: '#FFF8E7', borderRadius: 12, padding: 14, marginBottom: 16, gap: 4,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
  },
  summaryTitle: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 16, marginBottom: 6 },
  summaryLine: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.7, marginBottom: 2 },

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
  submitError: {
    fontFamily: 'Inter_700Bold', fontSize: 12, color: '#FF3B30',
    textAlign: 'center', marginTop: -4,
  },
  btn: {
    backgroundColor: '#FFC50A', borderRadius: 12, padding: 13, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
})
