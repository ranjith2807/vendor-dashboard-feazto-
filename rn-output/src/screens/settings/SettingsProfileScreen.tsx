import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { C, F, shadow } from '../../theme'

const CUISINES = ['South Indian', 'North Indian', 'Chinese', 'Continental', 'Bakery', 'Fast Food', 'Desserts', 'Beverages']

export default function SettingsProfileScreen({ setScreen }: { setScreen: SetScreen }) {
  const [form, setForm] = useState({
    restaurantName: "Priya's Kitchen", ownerName: 'Priya Krishnan',
    phone: '9876543210', email: 'priya@priyaskitchen.com',
    address: '14, Kamaraj Street, RS Puram', city: 'Coimbatore',
    pincode: '641002', cuisines: ['South Indian'],
    tagline: 'Authentic homestyle South Indian food',
    minOrder: '100', deliveryRadius: '5',
  })
  const [saved, setSaved] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const toggleCuisine = (c: string) =>
    setForm(p => ({ ...p, cuisines: p.cuisines.includes(c) ? p.cuisines.filter(x => x !== c) : [...p.cuisines, c] }))

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('settings')}><Text style={s.back}>←</Text></TouchableOpacity>
        <Text style={s.title}>Vendor Profile</Text>
        <TouchableOpacity style={s.saveBtn} onPress={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
          <Text style={s.saveBtnText}>{saved ? '✓ SAVED' : 'SAVE'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Avatar */}
        <View style={s.avatarWrap}>
          <View style={s.avatar}><Text style={s.avatarText}>PK</Text></View>
          <View style={s.avatarEdit}><Text style={{ fontSize: 12 }}>✏️</Text></View>
        </View>

        <SLabel>RESTAURANT INFO</SLabel>
        <FField label="Restaurant Name" value={form.restaurantName} onChange={v => set('restaurantName', v)} />
        <FField label="Tagline" value={form.tagline} onChange={v => set('tagline', v)} placeholder="Short description…" />
        <FField label="Owner Name" value={form.ownerName} onChange={v => set('ownerName', v)} />

        <SLabel>CONTACT DETAILS</SLabel>
        <FField label="Phone Number" value={form.phone} onChange={v => set('phone', v)} keyboardType="phone-pad" />
        <FField label="Email Address" value={form.email} onChange={v => set('email', v)} keyboardType="email-address" />

        <SLabel>LOCATION</SLabel>
        <FField label="Street Address" value={form.address} onChange={v => set('address', v)} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><FField label="City" value={form.city} onChange={v => set('city', v)} /></View>
          <View style={{ width: 110 }}><FField label="Pincode" value={form.pincode} onChange={v => set('pincode', v)} keyboardType="numeric" /></View>
        </View>

        <SLabel>BUSINESS SETTINGS</SLabel>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><FField label="Min. Order (₹)" value={form.minOrder} onChange={v => set('minOrder', v)} keyboardType="numeric" /></View>
          <View style={{ flex: 1 }}><FField label="Radius (km)" value={form.deliveryRadius} onChange={v => set('deliveryRadius', v)} keyboardType="numeric" /></View>
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
  return <Text style={{ fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.35, marginBottom: 8, marginTop: 4 }}>{children}</Text>
}

function FField({ label, value, onChange, keyboardType, placeholder }: { label: string; value: string; onChange: (v: string) => void; keyboardType?: any; placeholder?: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.5, marginBottom: 5 }}>{label.toUpperCase()}</Text>
      <TextInput value={value} onChangeText={onChange} keyboardType={keyboardType} placeholder={placeholder}
        style={{ fontFamily: F.inter, fontSize: 14, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 10, padding: 11, paddingHorizontal: 13, color: C.black }} />
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.08)' },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black, flex: 1 },
  saveBtn: { backgroundColor: C.yellow, borderRadius: 9, paddingHorizontal: 16, paddingVertical: 8, ...shadow(3, 3) },
  saveBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.black },
  body: { padding: 20, paddingBottom: 32 },
  avatarWrap: { alignItems: 'center', marginBottom: 20, position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.yellow, ...shadow(4, 4), alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: F.barlow, fontSize: 30, color: C.black },
  avatarEdit: { position: 'absolute', bottom: -4, right: '50%', marginRight: -44, width: 28, height: 28, borderRadius: 14, backgroundColor: C.black,  borderColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)', flexShrink: 0 },
  chipActive: { backgroundColor: C.black, borderColor: C.black },
  chipText: { fontFamily: F.interBold, fontSize: 12, color: C.black, includeFontPadding: false },
  chipTextActive: { color: C.yellow },
})
