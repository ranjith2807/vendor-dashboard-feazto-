import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { vendorDocuments, type VendorDocument } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

const STATUS_META: Record<VendorDocument['status'], { label: string; color: string; bg: string }> = {
  verified: { label: 'VERIFIED', color: C.green,  bg: '#DCFCE7' },
  pending:  { label: 'PENDING',  color: C.amber,  bg: '#FEF3C7' },
  rejected: { label: 'REJECTED', color: C.red,    bg: '#FEE2E2' },
  missing:  { label: 'MISSING',  color: '#6B7280', bg: '#F3F4F6' },
}

export default function SettingsDocumentsScreen({ setScreen }: { setScreen: SetScreen }) {
  const [toast, setToast] = useState<string>('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2200) }

  const verifiedCount = vendorDocuments.filter((d: VendorDocument) => d.status === 'verified').length
  const total = vendorDocuments.length
  const allVerified = verifiedCount === total

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('settings')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Documents</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Compliance score */}
        <View style={[s.complianceCard, { backgroundColor: allVerified ? '#DCFCE7' : '#FEF3C7', borderColor: allVerified ? C.green : C.amber }]}>
          <Text style={{ fontSize: 32 }}>{allVerified ? '✅' : '⚠️'}</Text>
          <View>
            <Text style={s.complianceTitle}>{verifiedCount}/{total} Documents Verified</Text>
            <Text style={s.complianceSub}>
              {allVerified ? 'All documents are up to date' : `${total - verifiedCount} document(s) need attention`}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width: `${(verifiedCount / total) * 100}%` as any }]} />
        </View>

        {/* Document cards */}
        {vendorDocuments.map((doc: VendorDocument) => {
          const meta = STATUS_META[doc.status]
          return (
            <View key={doc.id} style={s.docCard}>
              <View style={s.docIcon}><Text style={{ fontSize: 22 }}>{doc.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.docName}>{doc.name}</Text>
                <Text style={s.docMeta}>{doc.type}{doc.expiresAt ? ` · Expires ${doc.expiresAt}` : ''}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <View style={[s.statusBadge, { backgroundColor: meta.bg, borderColor: meta.color }]}>
                  <Text style={[s.statusBadgeText, { color: meta.color }]}>{meta.label}</Text>
                </View>
                {doc.status !== 'verified' && (
                  <TouchableOpacity style={s.uploadBtn} onPress={() => showToast(`Uploading ${doc.name}...`)}>
                    <Text style={s.uploadBtnText}>Upload</Text>
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
            Documents are verified within 1–2 business days. Ensure files are clear, not expired, and under 5MB (PDF/JPG/PNG).
          </Text>
        </View>
      </ScrollView>

      {/* Toast */}
      {!!toast && (
        <View style={s.toast}><Text style={s.toastText}>{toast}</Text></View>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.08)' },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black },
  body: { padding: 20, paddingBottom: 32, gap: 10 },
  complianceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', padding: 14, ...shadow(4, 4) } as any,
  complianceTitle: { fontFamily: F.barlow, fontSize: 20, color: C.black },
  complianceSub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.6 },
  progressBg: { height: 8, backgroundColor: '#ddd', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.green },
  docCard: { backgroundColor: C.white, borderRadius: 14, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(4, 4), padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  docIcon: { width: 42, height: 42, borderRadius: 10, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  docName: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  docMeta: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  statusBadgeText: { fontFamily: F.barlow, fontSize: 10, letterSpacing: 1 },
  uploadBtn: { backgroundColor: C.black, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#000' },
  uploadBtnText: { fontFamily: F.interBold, fontSize: 11, color: C.yellow },
  infoCard: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#DBEAFE',  borderColor: C.blue, borderRadius: 12, padding: 12 },
  infoText: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.7, lineHeight: 18, flex: 1 },
  toast: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: C.black,  borderColor: C.yellow, borderRadius: 12, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  toastText: { fontFamily: F.interBold, fontSize: 13, color: C.yellow },
})
