import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import type { SetScreen } from '../../types'

const DOCS = [
  { id: 'doc_fssai', label: 'FSSAI License', icon: '🏛', required: true },
  { id: 'doc_gst', label: 'GST Certificate', icon: '📄', required: true },
  { id: 'doc_pan', label: 'PAN Card', icon: '🪪', required: true },
  { id: 'doc_aadhaar', label: 'Aadhaar Card', icon: '🪪', required: false },
]

export default function RegisterStep3Screen({ setScreen }: { setScreen: SetScreen }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('register_2')}><Text style={styles.back}>←</Text></TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Register — Step 3 of 4</Text>
          <Text style={styles.sub}>Upload Documents</Text>
        </View>
        <View style={styles.steps}>
          {[1,2,3,4].map(i => <View key={i} style={[styles.step, i <= 3 && styles.stepActive]} />)}
        </View>
      </View>

      <View style={styles.card}>
        {DOCS.map(doc => (
          <View key={doc.id} style={styles.docRow}>
            <View style={styles.docIcon}><Text style={styles.docIconText}>{doc.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docLabel}>{doc.label}</Text>
              {doc.required && <Text style={styles.docRequired}>Required</Text>}
            </View>
            <TouchableOpacity style={styles.uploadBtn}>
              <Text style={styles.uploadBtnText}>Upload</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.btn} onPress={() => setScreen('register_4')}>
          <Text style={styles.btnText}>Next: Bank Details →</Text>
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
    backgroundColor: '#fff', borderRadius: 16, padding: 18, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  docIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  docIconText: { fontSize: 22 },
  docLabel: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  docRequired: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#FF3B30', marginTop: 1 },
  uploadBtn: {
    backgroundColor: '#FFFFFF',  borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
    shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 2,
  },
  uploadBtnText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  btn: {
    backgroundColor: '#FFC50A', borderRadius: 12, padding: 13, alignItems: 'center', marginTop: 4,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
})
