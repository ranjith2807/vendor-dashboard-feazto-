import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { C, F, shadow } from '../../theme'
import { useVendor } from '../../context/VendorContext'

const CUISINES = ['South Indian', 'North Indian', 'Chinese', 'Continental', 'Bakery', 'Fast Food', 'Desserts', 'Beverages']

export default function SettingsProfileScreen({ setScreen }: { setScreen: SetScreen }) {
  const { vendor, updateVendorProfile } = useVendor()

  const [form, setForm] = useState({
    vendor_name:  vendor?.vendor_name  ?? '',
    company_name: vendor?.company_name ?? '',
    phone_number: vendor?.phone_number ?? '',
    email:        vendor?.email        ?? '',
    address:      vendor?.address      ?? '',
    city:         vendor?.city         ?? '',
    state:        vendor?.state        ?? '',
    country:      vendor?.country      ?? 'India',
    postal_code:  vendor?.postal_code  ?? '',
    cuisines:     ['South Indian'] as string[],
    tagline:      '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState('')
  const [photoUri, setPhotoUri] = useState<string | null>(vendor?.photoUrl ?? null)

  const pickImage = async (source: 'camera' | 'gallery') => {
    const permResult = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permResult.granted) {
      Alert.alert(
        'Permission Required',
        `Please allow ${source === 'camera' ? 'camera' : 'photo library'} access to set a profile photo.`,
      )
      return
    }

    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8, mediaTypes: ImagePicker.MediaTypeOptions.Images })

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri)
    }
  }

  const handlePickPhoto = () => {
    Alert.alert('Profile Photo', 'Choose a source', [
      { text: '📷  Camera',        onPress: () => pickImage('camera') },
      { text: '🖼️  Photo Library', onPress: () => pickImage('gallery') },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const toggleCuisine = (c: string) =>
    setForm(p => ({ ...p, cuisines: p.cuisines.includes(c) ? p.cuisines.filter(x => x !== c) : [...p.cuisines, c] }))

  const initials = form.company_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const result = await updateVendorProfile({
      vendor_name:  form.vendor_name,
      company_name: form.company_name,
      phone_number: form.phone_number,
      address:      form.address,
      city:         form.city,
      state:        form.state,
      country:      form.country,
      postal_code:  form.postal_code,
    })
    setSaving(false)
    if (result.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      setError(result.message)
    }
  }

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('settings')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Vendor Profile</Text>
        <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#000" size="small" />
            : <Text style={s.saveBtnText}>{saved ? '✓ SAVED' : 'SAVE'}</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Avatar */}
        <View style={s.avatarWrap}>
          <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.85} style={s.avatarTouchable}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={s.avatarImage} />
            ) : (
              <View style={s.avatar}>
                <Text style={s.avatarText}>{initials || '?'}</Text>
              </View>
            )}
            {/* Camera badge overlay */}
            <View style={s.cameraBadge}>
              <Text style={s.cameraBadgeText}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={s.avatarHint}>Tap to change photo</Text>
        </View>

        {error ? <Text style={s.errorText}>{error}</Text> : null}

        <SLabel>KITCHEN INFO</SLabel>
        <FField label="Kitchen / Company Name" value={form.company_name} onChange={v => set('company_name', v)} />
        <FField label="Owner Name"             value={form.vendor_name}  onChange={v => set('vendor_name', v)} />
        <FField label="Tagline"                value={form.tagline}      onChange={v => set('tagline', v)} placeholder="Short description…" />

        <SLabel>CONTACT DETAILS</SLabel>
        <FField label="Phone Number"   value={form.phone_number} onChange={v => set('phone_number', v)} keyboardType="phone-pad" />
        <FField label="Email Address"  value={form.email}        onChange={() => {}} editable={false} />

        <SLabel>LOCATION</SLabel>
        <FField label="Address"     value={form.address}     onChange={v => set('address', v)} />
        <FField label="City"        value={form.city}        onChange={v => set('city', v)} />
        <FField label="State"       value={form.state}       onChange={v => set('state', v)} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <FField label="Country"     value={form.country}     onChange={v => set('country', v)} />
          </View>
          <View style={{ width: 120 }}>
            <FField label="Postal Code" value={form.postal_code} onChange={v => set('postal_code', v)} keyboardType="numeric" />
          </View>
        </View>

        <SLabel>CUISINE TYPES</SLabel>
        <View style={s.chips}>
          {CUISINES.map(c => {
            const active = form.cuisines.includes(c)
            return (
              <TouchableOpacity key={c} onPress={() => toggleCuisine(c)} style={[s.chip, active && s.chipActive]}>
                <Text style={[s.chipText, active && s.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

function SLabel({ children }: { children: string }) {
  return (
    <Text style={{ fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.35, marginBottom: 8, marginTop: 4 }}>
      {children}
    </Text>
  )
}

function FField({ label, value, onChange, keyboardType, placeholder, editable = true }: {
  label: string; value: string; onChange: (v: string) => void
  keyboardType?: any; placeholder?: string; editable?: boolean
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.5, marginBottom: 5 }}>
        {label.toUpperCase()}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={placeholder}
        editable={editable}
        style={{
          fontFamily: F.inter, fontSize: 14,
          backgroundColor: editable ? '#F9FAFB' : '#F0F0F0',
          borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 10,
          padding: 11, paddingHorizontal: 13, color: C.black,
          opacity: editable ? 1 : 0.6,
        }}
      />
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.08)' },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black, flex: 1 },
  saveBtn: { backgroundColor: C.yellow, borderRadius: 9, paddingHorizontal: 16, paddingVertical: 8, minWidth: 60, alignItems: 'center', ...shadow(3, 3) },
  saveBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.black },
  body: { padding: 20, paddingBottom: 32 },
  avatarWrap: { alignItems: 'center', marginBottom: 20 },
  avatarTouchable: { position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: C.yellow, ...shadow(4, 4), alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 90, height: 90, borderRadius: 45, ...shadow(4, 4) },
  avatarText: { fontFamily: F.barlow, fontSize: 32, color: C.black },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.black, borderWidth: 2, borderColor: C.white,
    alignItems: 'center', justifyContent: 'center',
  },
  cameraBadgeText: { fontSize: 13 },
  avatarHint: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.4, marginTop: 8 },
  errorText: { fontFamily: F.interBold, fontSize: 12, color: C.red, textAlign: 'center', marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)', flexShrink: 0 },
  chipActive: { backgroundColor: C.black, borderColor: C.black },
  chipText: { fontFamily: F.interBold, fontSize: 12, color: C.black, includeFontPadding: false },
  chipTextActive: { color: C.yellow },
})
