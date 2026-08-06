import React, { useState, useCallback } from 'react'
import {
  View, Text, ScrollView, StyleSheet, Image, Modal, Alert, ActivityIndicator,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { C, F, shadow } from '../../theme'
import { useVendor } from '../../context/VendorContext'
import { uploadVendorDocument, type VendorDocuments } from '../../lib/vendorDb'

// ── Document config ───────────────────────────────────────────────────────────

type DocKey = 'fssai' | 'gst' | 'pan' | 'aadhaar'

interface DocConfig {
  key: DocKey
  label: string
  type: string
  icon: string
  required: boolean
}

const DOC_CONFIG: DocConfig[] = [
  { key: 'fssai',   label: 'FSSAI License',   type: 'Food Safety',  icon: '🏛', required: true },
  { key: 'gst',     label: 'GST Certificate', type: 'Tax',          icon: '📄', required: true },
  { key: 'pan',     label: 'PAN Card',        type: 'Identity',     icon: '🪪', required: true },
  { key: 'aadhaar', label: 'Aadhaar Card',    type: 'Identity',     icon: '🪪', required: false },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function docStatus(url?: string): 'uploaded' | 'missing' {
  return url ? 'uploaded' : 'missing'
}

const STATUS_META = {
  uploaded: { label: 'UPLOADED',  color: C.green,   bg: '#DCFCE7' },
  missing:  { label: 'MISSING',   color: '#6B7280',  bg: '#F3F4F6' },
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function SettingsDocumentsScreen({ setScreen }: { setScreen: SetScreen }) {
  const { vendor, updateVendorProfile, refreshVendor } = useVendor()
  const email = vendor?.email ?? ''

  // Local copy of document URLs — starts from Firestore data
  const [docs, setDocs] = useState<VendorDocuments>({
    fssai:   vendor?.documents?.fssai,
    gst:     vendor?.documents?.gst,
    pan:     vendor?.documents?.pan,
    aadhaar: vendor?.documents?.aadhaar,
  })

  const [uploading, setUploading] = useState<DocKey | null>(null)
  const [preview,   setPreview]   = useState<{ key: DocKey; url: string } | null>(null)
  const [toast,     setToast]     = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // ── Pick + upload ─────────────────────────────────────────────────────────

  const handlePick = useCallback(async (docKey: DocKey, fromCamera: boolean) => {
    if (fromCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera access is needed to take a photo.')
        return
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery access is needed to pick a photo.')
        return
      }
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'], allowsEditing: false, quality: 0.5, base64: true,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'], allowsEditing: false, quality: 0.5, base64: true,
        })

    if (result.canceled || !result.assets?.[0]) return

    const asset = result.assets[0]
    if (!asset.base64) {
      showToast('Could not read image. Try again.')
      return
    }

    const mime = asset.mimeType ?? 'image/jpeg'

    setUploading(docKey)
    const uploadResult = await uploadVendorDocument(email, docKey, asset.base64, mime)

    if (!uploadResult.success || !uploadResult.url) {
      setUploading(null)
      showToast(`Failed: ${uploadResult.message}`)
      return
    }

    const newDocs: VendorDocuments = { ...docs, [docKey]: uploadResult.url }

    // Persist to Firestore
    const saveResult = await updateVendorProfile({ documents: newDocs })
    setUploading(null)

    if (saveResult.success) {
      setDocs(newDocs)
      showToast(`✓ ${DOC_CONFIG.find(d => d.key === docKey)?.label} updated`)
      await refreshVendor()
    } else {
      showToast(`Save failed: ${saveResult.message}`)
    }
  }, [docs, email, updateVendorProfile, refreshVendor])

  // ── Show upload options sheet ─────────────────────────────────────────────

  const [actionTarget, setActionTarget] = useState<DocKey | null>(null)

  const handleUploadPress = (key: DocKey) => {
    setActionTarget(key)
  }

  const confirmUpload = (fromCamera: boolean) => {
    const key = actionTarget
    setActionTarget(null)
    if (key) handlePick(key, fromCamera)
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  const uploadedCount = DOC_CONFIG.filter(d => !!docs[d.key]).length
  const total         = DOC_CONFIG.length
  const allUploaded   = uploadedCount === total
  const requiredDone  = DOC_CONFIG.filter(d => d.required).every(d => !!docs[d.key])

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('settings')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.title}>Documents</Text>
          <Text style={s.subtitle}>Tap any document to replace it</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>

        {/* Compliance card */}
        <View style={[
          s.complianceCard,
          { backgroundColor: requiredDone ? '#DCFCE7' : '#FEF3C7', borderColor: requiredDone ? C.green : C.amber },
        ]}>
          <Text style={{ fontSize: 32 }}>{requiredDone ? '✅' : '⚠️'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.complianceTitle}>{uploadedCount}/{total} Documents Uploaded</Text>
            <Text style={s.complianceSub}>
              {allUploaded
                ? 'All documents are on file'
                : requiredDone
                ? 'Required documents complete · Aadhaar optional'
                : `${DOC_CONFIG.filter(d => d.required && !docs[d.key]).length} required document(s) missing`}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width: `${(uploadedCount / total) * 100}%` as any }]} />
        </View>

        {/* Document cards */}
        {DOC_CONFIG.map(cfg => {
          const url    = docs[cfg.key]
          const status = docStatus(url)
          const meta   = STATUS_META[status]
          const busy   = uploading === cfg.key

          return (
            <View key={cfg.key} style={s.docCard}>
              {/* Icon / thumbnail */}
              <TouchableOpacity
                style={s.docThumb}
                onPress={() => url ? setPreview({ key: cfg.key, url }) : handleUploadPress(cfg.key)}
                disabled={busy}
              >
                {url ? (
                  <Image source={{ uri: url }} style={s.docThumbImage} resizeMode="cover" />
                ) : (
                  <Text style={{ fontSize: 22 }}>{cfg.icon}</Text>
                )}
                {url && (
                  <View style={s.viewOverlay}>
                    <Text style={s.viewOverlayText}>👁</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <View style={s.docNameRow}>
                  <Text style={s.docName}>{cfg.label}</Text>
                  {cfg.required && (
                    <Text style={s.requiredTag}>Required</Text>
                  )}
                </View>
                <Text style={s.docType}>{cfg.type}</Text>
                <View style={[s.statusBadge, { backgroundColor: meta.bg }]}>
                  <Text style={[s.statusBadgeText, { color: meta.color }]}>{meta.label}</Text>
                </View>
              </View>

              {/* Upload / Replace button */}
              <View style={{ alignItems: 'center' }}>
                {busy ? (
                  <ActivityIndicator size="small" color={C.black} />
                ) : (
                  <TouchableOpacity
                    style={[s.uploadBtn, url && s.replaceBtn]}
                    onPress={() => handleUploadPress(cfg.key)}
                  >
                    <Text style={[s.uploadBtnText, url && s.replaceBtnText]}>
                      {url ? 'Replace' : 'Upload'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )
        })}

        {/* Info footer */}
        <View style={s.infoCard}>
          <Text style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</Text>
          <Text style={s.infoText}>
            Documents are stored securely. Make sure images are clear and fully visible. Tap a thumbnail to preview your uploaded document.
          </Text>
        </View>

      </ScrollView>

      {/* Upload options bottom sheet */}
      <Modal visible={!!actionTarget} transparent animationType="slide">
        <View style={s.sheetOverlay}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>
              {actionTarget ? DOC_CONFIG.find(d => d.key === actionTarget)?.label : ''}
            </Text>
            <Text style={s.sheetSub}>Choose how to upload</Text>

            <TouchableOpacity style={s.sheetOption} onPress={() => confirmUpload(false)}>
              <Text style={s.sheetOptionIcon}>🖼️</Text>
              <View>
                <Text style={s.sheetOptionTitle}>Choose from Gallery</Text>
                <Text style={s.sheetOptionSub}>Pick an existing photo or scan</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.sheetOption} onPress={() => confirmUpload(true)}>
              <Text style={s.sheetOptionIcon}>📷</Text>
              <View>
                <Text style={s.sheetOptionTitle}>Take a Photo</Text>
                <Text style={s.sheetOptionSub}>Capture the document with your camera</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.cancelSheetBtn} onPress={() => setActionTarget(null)}>
              <Text style={s.cancelSheetText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Preview modal */}
      <Modal visible={!!preview} transparent animationType="fade">
        <View style={s.previewOverlay}>
          <TouchableOpacity style={s.previewClose} onPress={() => setPreview(null)}>
            <Text style={s.previewCloseText}>✕ Close</Text>
          </TouchableOpacity>
          {preview && (
            <>
              <Text style={s.previewLabel}>
                {DOC_CONFIG.find(d => d.key === preview.key)?.label}
              </Text>
              <Image
                source={{ uri: preview.url }}
                style={s.previewImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={s.previewReplaceBtn}
                onPress={() => { setPreview(null); handleUploadPress(preview.key) }}
              >
                <Text style={s.previewReplaceBtnText}>Replace Document</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* Toast */}
      {!!toast && (
        <View style={s.toast}>
          <Text style={s.toastText}>{toast}</Text>
        </View>
      )}
    </View>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 20, paddingBottom: 14,
    borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black, lineHeight: 28 },
  subtitle: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.4 },

  body: { padding: 20, paddingBottom: 40, gap: 10 },

  // Compliance card
  complianceCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, padding: 14, borderWidth: 1.5, ...shadow(4, 4),
  } as any,
  complianceTitle: { fontFamily: F.barlow, fontSize: 20, color: C.black },
  complianceSub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.6, marginTop: 2 },

  // Progress
  progressBg: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.green },

  // Doc card
  docCard: {
    backgroundColor: C.white, borderRadius: 14, borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4),
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  docThumb: {
    width: 54, height: 54, borderRadius: 10, backgroundColor: '#F3F4F6',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', flexShrink: 0, position: 'relative',
  },
  docThumbImage: { width: '100%', height: '100%' },
  viewOverlay: {
    position: 'absolute', inset: 0 as any, backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  viewOverlayText: { fontSize: 16 },

  docNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 1 },
  docName: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  requiredTag: {
    fontFamily: F.interBold, fontSize: 9, color: C.red, letterSpacing: 0.5,
    backgroundColor: '#FEE2E2', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1,
  },
  docType: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.4, marginBottom: 5 },

  statusBadge: { alignSelf: 'flex-start', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  statusBadgeText: { fontFamily: F.barlow, fontSize: 10, letterSpacing: 0.8 },

  uploadBtn: {
    backgroundColor: C.black, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7,
    ...shadow(2, 2),
  },
  uploadBtnText: { fontFamily: F.interBold, fontSize: 12, color: C.yellow },
  replaceBtn: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)' },
  replaceBtnText: { color: C.black },

  // Info footer
  infoCard: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: '#DBEAFE', borderRadius: 12, padding: 12,
  },
  infoText: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.7, lineHeight: 18, flex: 1 },

  // Upload options sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: C.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, paddingBottom: 36, gap: 12,
  },
  sheetTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black },
  sheetSub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45, marginTop: -6 },
  sheetOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
  },
  sheetOptionIcon: { fontSize: 26 },
  sheetOptionTitle: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  sheetOptionSub: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45, marginTop: 2 },
  cancelSheetBtn: {
    backgroundColor: '#F3F4F6', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 4,
  },
  cancelSheetText: { fontFamily: F.barlow, fontSize: 15, color: C.black, letterSpacing: 0.5 },

  // Preview modal
  previewOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  previewClose: { position: 'absolute', top: 52, right: 20 },
  previewCloseText: { fontFamily: F.interBold, fontSize: 14, color: '#fff', opacity: 0.7 },
  previewLabel: {
    fontFamily: F.barlow, fontSize: 20, color: '#fff',
    marginBottom: 16, position: 'absolute', top: 52, left: 20,
  },
  previewImage: { width: '100%', height: '70%', borderRadius: 12 },
  previewReplaceBtn: {
    marginTop: 20, backgroundColor: C.yellow, borderRadius: 12,
    paddingHorizontal: 28, paddingVertical: 12, ...shadow(3, 3),
  },
  previewReplaceBtnText: { fontFamily: F.barlow, fontSize: 16, color: C.black, letterSpacing: 0.5 },

  // Toast
  toast: {
    position: 'absolute', bottom: 40, left: 20, right: 20,
    backgroundColor: C.black, borderRadius: 12, padding: 12,
    alignItems: 'center', ...shadow(3, 3, C.yellow),
  },
  toastText: { fontFamily: F.interBold, fontSize: 13, color: C.yellow },
})
