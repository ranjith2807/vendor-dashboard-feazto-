import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, Modal, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { C, F, shadow } from '../../theme'

export default function SettingsSecurityScreen({ setScreen }: { setScreen: SetScreen }) {
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [otpEnabled, setOtpEnabled] = useState(true)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [twoFaEnabled, setTwoFaEnabled] = useState(false)
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const strength = newPwd.length === 0 ? 0 : newPwd.length < 6 ? 1 : newPwd.length < 10 ? 2 : /[A-Z]/.test(newPwd) && /[0-9]/.test(newPwd) ? 4 : 3
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', C.red, C.amber, C.blue, C.green]

  const handleSave = () => {
    if (!currentPwd) return showToast('Enter current password')
    if (newPwd.length < 8) return showToast('Password must be at least 8 characters')
    if (newPwd !== confirmPwd) return showToast('Passwords do not match')
    showToast('Password changed successfully!')
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
  }

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('settings')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Security</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Change password */}
        <Text style={s.sLabel}>CHANGE PASSWORD</Text>
        <View style={s.card}>
          <PwdField label="CURRENT PASSWORD" value={currentPwd} onChange={setCurrentPwd} show={showCurrent} onToggle={() => setShowCurrent(v => !v)} />
          <PwdField label="NEW PASSWORD" value={newPwd} onChange={setNewPwd} show={showNew} onToggle={() => setShowNew(v => !v)} />
          {newPwd.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map(i => (
                  <View key={i} style={[s.strengthBar, { backgroundColor: i <= strength ? strengthColor[strength] : '#ddd' }]} />
                ))}
              </View>
              <Text style={[s.strengthLabel, { color: strengthColor[strength] }]}>{strengthLabel[strength]}</Text>
            </View>
          )}
          <PwdField label="CONFIRM NEW PASSWORD" value={confirmPwd} onChange={setConfirmPwd} show={showNew} onToggle={() => setShowNew(v => !v)} />
          <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
            <Text style={s.saveBtnText}>UPDATE PASSWORD</Text>
          </TouchableOpacity>
        </View>

        {/* Auth settings */}
        <Text style={s.sLabel}>LOGIN & AUTHENTICATION</Text>
        <View style={s.toggleCard}>
          {[
            { id: 'otp',  icon: '📱', label: 'OTP Login',      sub: 'Receive OTP to +91 98765 43210', val: otpEnabled,      set: () => setOtpEnabled(v => !v) },
            { id: 'bio',  icon: '🔐', label: 'Biometric Login', sub: 'Use fingerprint or face ID',     val: biometricEnabled, set: () => setBiometricEnabled(v => !v) },
            { id: 'twofa',icon: '🔑', label: 'Two-Factor Auth', sub: 'Adds extra login verification',  val: twoFaEnabled,    set: () => setTwoFaEnabled(v => !v) },
          ].map((item, idx) => (
            <View key={item.id} style={[s.toggleRow, idx < 2 && s.toggleRowBorder]}>
              <View style={s.toggleIcon}><Text style={{ fontSize: 18 }}>{item.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.toggleLabel}>{item.label}</Text>
                <Text style={s.toggleSub}>{item.sub}</Text>
              </View>
              <TouchableOpacity onPress={item.set} style={[s.toggle, { backgroundColor: item.val ? C.green : '#ddd' }]}>
                <View style={[s.toggleThumb, { left: item.val ? 18 : 2 }]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Danger zone */}
        <Text style={s.sLabel}>DANGER ZONE</Text>
        <View style={s.dangerCard}>
          <Text style={s.dangerTitle}>Deactivate Account</Text>
          <Text style={s.dangerSub}>Permanently deactivates your vendor account and removes all data.</Text>
          <TouchableOpacity style={s.deactivateBtn} onPress={() => setConfirmDeactivate(true)}>
            <Text style={s.deactivateBtnText}>DEACTIVATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm dialog */}
      <Modal visible={confirmDeactivate} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Deactivate Account?</Text>
            <Text style={s.modalBody}>This action cannot be undone. All your data, orders, and settings will be permanently deleted.</Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setConfirmDeactivate(false)}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirm} onPress={() => { setConfirmDeactivate(false); showToast('Account deactivated') }}>
                <Text style={s.modalConfirmText}>DEACTIVATE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {!!toast && (
        <View style={s.toast}><Text style={s.toastText}>{toast}</Text></View>
      )}
    </View>
  )
}

function PwdField({ label, value, onChange, show, onToggle }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1, color: '#000', opacity: 0.5, marginBottom: 5 }}>{label}</Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          value={value}
          onChangeText={onChange}
          secureTextEntry={!show}
          style={{ fontFamily: 'Inter_400Regular', fontSize: 15, backgroundColor: '#FFF8E7',  borderRadius: 10, padding: 11, paddingHorizontal: 13, paddingRight: 44, color: '#000' }}
        />
        <TouchableOpacity
          onPress={onToggle}
          style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 16, opacity: 0.5 }}>{show ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.08)' },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black },
  body: { padding: 20, paddingBottom: 32 },
  sLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.35, marginBottom: 8, marginTop: 4 },
  card: { backgroundColor: C.white, borderRadius: 14, ...shadow(4, 4), padding: 16, marginBottom: 16 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontFamily: F.interBold, fontSize: 11 },
  saveBtn: { backgroundColor: C.yellow, borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3, 3), marginTop: 4 },
  saveBtnText: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  toggleCard: { backgroundColor: C.white, borderRadius: 14, ...shadow(4, 4), overflow: 'hidden', marginBottom: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, paddingHorizontal: 14 },
  toggleRowBorder: { borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.06)' },
  toggleIcon: { width: 36, height: 36, borderRadius: 9, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' },
  toggleLabel: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  toggleSub: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.4 },
  toggle: { width: 46, height: 26, borderRadius: 13, position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  toggleThumb: { position: 'absolute', top: 2, width: 18, height: 18, borderRadius: 9, backgroundColor: C.white },
  dangerCard: { backgroundColor: '#FEE2E2',  borderColor: C.red, borderRadius: 14, ...shadow(4, 4, C.red), padding: 14, marginBottom: 24 },
  dangerTitle: { fontFamily: F.interBold, fontSize: 13, color: C.black, marginBottom: 4 },
  dangerSub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.6, marginBottom: 12 },
  deactivateBtn: { backgroundColor: C.red, borderRadius: 9, paddingHorizontal: 18, paddingVertical: 9, alignSelf: 'flex-start', ...shadow(3, 3) },
  deactivateBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: C.white, borderRadius: 16, ...shadow(6, 6), padding: 20, width: '100%' },
  modalTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginBottom: 10 },
  modalBody: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.65, lineHeight: 20, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', gap: 10 },
  modalCancel: { flex: 1,  borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(2, 2) },
  modalCancelText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  modalConfirm: { flex: 1, backgroundColor: C.red,  borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  modalConfirmText: { fontFamily: F.barlow, fontSize: 15, color: C.white },
  toast: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: C.black,  borderColor: C.yellow, borderRadius: 12, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  toastText: { fontFamily: F.interBold, fontSize: 13, color: C.yellow },
})
