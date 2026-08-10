import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import TouchableOpacity from '../../components/TouchableOpacity'
import { uploadVendorDocument } from '../../../../backend/services/vendorService'
import type { SetScreen, NavParams } from '../../types'

// ── Document config ───────────────────────────────────────────────────────────

type DocKey = 'fssai' | 'gst' | 'pan' | 'aadhaar'

interface DocConfig {
  id: DocKey
  label: string
  icon: string
  required: boolean
}

const DOCS: DocConfig[] = [
  { id: 'fssai',   label: 'FSSAI License',   icon: '🏛', required: true },
  { id: 'gst',     label: 'GST Certificate', icon: '📄', required: true },
  { id: 'pan',     label: 'PAN Card',        icon: '🪪', required: true },
  { id: 'aadhaar', label: 'Aadhaar Card',    icon: '🪪', required: false },
]

// ── Per-doc state ─────────────────────────────────────────────────────────────

interface DocState {
  base64: string | null      // base64 image data (no data-URI prefix)
  mimeType: string           // e.g. 'image/jpeg'
  fileName: string | null    // display name
  uploadedUrl: string | null // Firebase Storage URL after upload
  uploading: boolean
  error: string
}

const EMPTY_DOC: DocState = {
  base64: null, mimeType: 'image/jpeg', fileName: null,
  uploadedUrl: null, uploading: false, error: '',
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function RegisterStep3Screen({
  setScreen,
  navParams,
}: {
  setScreen: SetScreen
  navParams: NavParams
}) {
  const [docs, setDocs] = useState<Record<DocKey, DocState>>({
    fssai:   { ...EMPTY_DOC },
    gst:     { ...EMPTY_DOC },
    pan:     { ...EMPTY_DOC },
    aadhaar: { ...EMPTY_DOC },
  })

  const setDoc = (id: DocKey, patch: Partial<DocState>) =>
    setDocs(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }))

  // ── Pick file from gallery ────────────────────────────────────────────────

  const handlePick = async (id: DocKey) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.4,   // compress aggressively — keeps base64 under Firestore 1MB doc limit
      base64: true,
    })

    if (result.canceled || !result.assets?.length) return

    const asset = result.assets[0]
    if (!asset.base64) {
      setDoc(id, { error: 'Could not read image data. Please try again.' })
      return
    }

    const mime = asset.mimeType ?? 'image/jpeg'
    const fileName = asset.uri.split('/').pop() ?? `${id}_doc`

    setDoc(id, {
      base64: asset.base64,
      mimeType: mime,
      fileName,
      uploadedUrl: null,
      error: '',
    })

    // Auto-upload immediately after picking
    await handleUpload(id, asset.base64, mime)
  }

  // ── Upload to Firebase Storage ────────────────────────────────────────────

  const handleUpload = async (id: DocKey, base64: string, mimeType: string) => {
    const email = navParams.email ?? 'unknown'
    setDoc(id, { uploading: true, error: '' })

    const result = await uploadVendorDocument(email, id, base64, mimeType)

    if (result.success && result.url) {
      setDoc(id, { uploading: false, uploadedUrl: result.url })
    } else {
      setDoc(id, { uploading: false, error: result.message })
    }
  }

  // ── Validate & proceed ────────────────────────────────────────────────────

  const handleNext = () => {
    const missing = DOCS.filter(d => d.required && !docs[d.id].uploadedUrl)
    if (missing.length > 0) {
      const names = missing.map(d => d.label).join(', ')
      Alert.alert('Documents required', `Please upload: ${names}`)
      return
    }
    setScreen('register_4', {
      ...navParams,
      doc_fssai:   docs.fssai.uploadedUrl   ?? '',
      doc_gst:     docs.gst.uploadedUrl     ?? '',
      doc_pan:     docs.pan.uploadedUrl     ?? '',
      doc_aadhaar: docs.aadhaar.uploadedUrl ?? '',
    })
  }

  // ── Row component ─────────────────────────────────────────────────────────

  const allRequiredUploaded = DOCS.filter(d => d.required).every(
    d => !!docs[d.id].uploadedUrl,
  )

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('register_2', navParams)}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Register — Step 4 of 5</Text>
          <Text style={styles.sub}>Upload Documents</Text>
        </View>
        <View style={styles.steps}>
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i} style={[styles.step, i <= 4 && styles.stepActive]} />
          ))}
        </View>
      </View>

      {/* Document rows */}
      <View style={styles.card}>
        {DOCS.map(docCfg => {
          const state = docs[docCfg.id]
          const isUploaded = !!state.uploadedUrl
          return (
            <View key={docCfg.id} style={styles.docRow}>
              {/* Icon */}
              <View style={[styles.docIcon, isUploaded && styles.docIconDone]}>
                <Text style={styles.docIconText}>
                  {isUploaded ? '✅' : docCfg.icon}
                </Text>
              </View>

              {/* Label + status */}
              <View style={{ flex: 1 }}>
                <Text style={styles.docLabel}>{docCfg.label}</Text>
                {isUploaded ? (
                  <Text style={styles.docUploaded}>Uploaded ✓</Text>
                ) : state.error ? (
                  <Text style={styles.docError}>{state.error}</Text>
                ) : state.base64 && !state.uploading ? (
                  <Text style={styles.docFileName} numberOfLines={1}>
                    {state.fileName}
                  </Text>
                ) : (
                  docCfg.required && (
                    <Text style={styles.docRequired}>Required</Text>
                  )
                )}
              </View>

              {/* Upload / retry / uploading button */}
              {state.uploading ? (
                <View style={styles.uploadBtn}>
                  <ActivityIndicator size="small" color="#000" />
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.uploadBtn, isUploaded && styles.uploadBtnDone]}
                  onPress={() => {
                    // If we already have base64 data (retry case), re-upload directly
                    if (state.base64 && !isUploaded) {
                      handleUpload(docCfg.id, state.base64, state.mimeType)
                    } else {
                      handlePick(docCfg.id)
                    }
                  }}
                >
                  <Text style={styles.uploadBtnText}>
                    {isUploaded ? 'Change' : state.error && state.base64 ? 'Retry' : 'Upload'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )
        })}

        {/* Next button */}
        <TouchableOpacity
          style={[styles.btn, !allRequiredUploaded && styles.btnDisabled]}
          onPress={handleNext}
        >
          <Text style={styles.btnText}>Next: Bank Details →</Text>
        </TouchableOpacity>

        {!allRequiredUploaded && (
          <Text style={styles.hint}>Upload all required documents to continue</Text>
        )}
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

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18, gap: 12,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5,
  },

  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  docIcon: {
    width: 44, height: 44, borderRadius: 10, backgroundColor: '#F9FAFB',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center',
  },
  docIconDone: { backgroundColor: '#F0FFF4', borderColor: 'rgba(0,180,0,0.2)' },
  docIconText: { fontSize: 22 },
  docLabel: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  docRequired: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#FF3B30', marginTop: 1 },
  docUploaded: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#22C55E', marginTop: 1 },
  docError: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#FF3B30', marginTop: 1 },
  docFileName: {
    fontFamily: 'Inter_400Regular', fontSize: 11, color: '#6B7280',
    marginTop: 1, maxWidth: 130,
  },

  uploadBtn: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, minWidth: 68, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 2,
  },
  uploadBtnDone: {
    backgroundColor: '#F0FFF4', borderColor: 'rgba(0,180,0,0.25)',
  },
  uploadBtnText: { fontFamily: 'Inter_700Bold', fontSize: 12 },

  btn: {
    backgroundColor: '#FFC50A', borderRadius: 12, padding: 13, alignItems: 'center', marginTop: 4,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  btnDisabled: { backgroundColor: '#E5E7EB', shadowOpacity: 0, elevation: 0 },
  btnText: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 17, letterSpacing: 1 },
  hint: {
    fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF',
    textAlign: 'center', marginTop: -4,
  },
})
