import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'

export default function RegisterStep4Screen({ setScreen }: { setScreen: SetScreen }) {
  const [form, setForm] = useState({ bank: '', account: '', ifsc: '', holder: '' })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('register_3')}><Text style={styles.back}>←</Text></TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Register — Step 4 of 4</Text>
          <Text style={styles.sub}>Bank Account Details</Text>
        </View>
        <View style={styles.steps}>
          {[1,2,3,4].map(i => <View key={i} style={[styles.step, styles.stepActive]} />)}
        </View>
      </View>

      <View style={styles.card}>
        {[
          { key: 'bank', label: 'Bank Name', placeholder: 'HDFC Bank' },
          { key: 'account', label: 'Account Number', placeholder: '1234 5678 9012' },
          { key: 'ifsc', label: 'IFSC Code', placeholder: 'HDFC0001234' },
          { key: 'holder', label: 'Account Holder Name', placeholder: "Priya's Kitchen" },
        ].map(f => (
          <View key={f.key} style={styles.fieldWrap}>
            <Text style={styles.label}>{f.label.toUpperCase()}</Text>
            <TextInput
              placeholder={f.placeholder}
              value={(form as any)[f.key]}
              onChangeText={v => set(f.key, v)}
              style={styles.input}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.btn} onPress={() => setScreen('register_success')}>
          <Text style={styles.btnText}>Submit Application →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFF8E7' },
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
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  fieldWrap: {},
  label: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.5, opacity: 0.5, marginBottom: 5 },
  input: {
    fontFamily: 'Inter_400Regular', fontSize: 14,
    backgroundColor: '#FFF8E7',  borderRadius: 10,
    paddingHorizontal: 13, paddingVertical: 11,
  },
  btn: {
    backgroundColor: '#FFC50A', borderRadius: 12, padding: 13, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
})
