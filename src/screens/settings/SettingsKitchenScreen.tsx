import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { C, F, shadow } from '../../theme'

const KITCHEN_TYPES = ['Home Kitchen', 'Cloud Kitchen', 'Restaurant', 'Bakery', 'Food Truck', 'Catering']

export default function SettingsKitchenScreen({ setScreen }: { setScreen: SetScreen }) {
  const [kitchenType, setKitchenType] = useState('Home Kitchen')
  const [capacity, setCapacity] = useState('30')
  const [prepTime, setPrepTime] = useState('20')
  const [maxOrders, setMaxOrders] = useState('5')
  const [hasAC, setHasAC] = useState(true)
  const [hasParking, setHasParking] = useState(false)
  const [isVegOnly, setIsVegOnly] = useState(false)
  const [gst, setGst] = useState('33AAAPF1234A1Z5')
  const [fssai, setFssai] = useState('FBO-12345678')
  const [saved, setSaved] = useState(false)

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('settings')}><Text style={s.back}>←</Text></TouchableOpacity>
        <Text style={s.title}>Kitchen Details</Text>
        <TouchableOpacity style={s.saveBtn} onPress={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
          <Text style={s.saveBtnText}>{saved ? '✓ SAVED' : 'SAVE'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        <Text style={s.sLabel}>KITCHEN TYPE</Text>
        <View style={s.chips}>
          {KITCHEN_TYPES.map(t => (
            <TouchableOpacity key={t} onPress={() => setKitchenType(t)} style={[s.chip, kitchenType === t && s.chipActive]}>
              <Text style={[s.chipText, kitchenType === t && s.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.sLabel}>CAPACITY & TIMING</Text>
        <View style={s.statsRow}>
          {[
            { label: 'Daily Capacity', unit: 'orders', val: capacity, set: setCapacity },
            { label: 'Avg Prep Time', unit: 'mins', val: prepTime, set: setPrepTime },
            { label: 'Max Live Orders', unit: 'at once', val: maxOrders, set: setMaxOrders },
          ].map(c => (
            <View key={c.label} style={s.numberCard}>
              <TextInput value={c.val} onChangeText={v => c.set(v.replace(/\D/g, ''))} keyboardType="numeric"
                style={s.numberInput} />
              <Text style={s.numberLabel}>{c.label}</Text>
              <Text style={s.numberUnit}>{c.unit}</Text>
            </View>
          ))}
        </View>

        <Text style={s.sLabel}>FACILITIES & FEATURES</Text>
        <View style={s.toggleCard}>
          {[
            { id: 'ac', icon: '❄️', label: 'Air Conditioned', val: hasAC, set: setHasAC },
            { id: 'park', icon: '🅿️', label: 'Parking Available', val: hasParking, set: setHasParking },
            { id: 'veg', icon: '🥦', label: 'Pure Vegetarian', val: isVegOnly, set: setIsVegOnly },
          ].map((item, idx) => (
            <View key={item.id} style={[s.toggleRow, idx < 2 && s.toggleRowBorder]}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <Text style={s.toggleLabel}>{item.label}</Text>
              <TouchableOpacity onPress={() => item.set(!item.val)} style={[s.toggle, { backgroundColor: item.val ? C.green : '#ddd' }]}>
                <View style={[s.toggleThumb, { left: item.val ? 18 : 2 }]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={s.sLabel}>BUSINESS LICENCES</Text>
        <View style={{ marginBottom: 12 }}>
          <Text style={s.inputLabel}>GST NUMBER</Text>
          <TextInput value={gst} onChangeText={setGst} autoCapitalize="characters"
            style={s.textInput} />
        </View>
        <View style={{ marginBottom: 24 }}>
          <Text style={s.inputLabel}>FSSAI LICENSE NO.</Text>
          <TextInput value={fssai} onChangeText={setFssai}
            style={s.textInput} />
        </View>
      </ScrollView>
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
  sLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.35, marginBottom: 8, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)', flexShrink: 0 },
  chipActive: { backgroundColor: C.black, borderColor: C.black },
  chipText: { fontFamily: F.interBold, fontSize: 12, color: C.black, includeFontPadding: false },
  chipTextActive: { color: C.yellow },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  numberCard: { flex: 1, backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(3, 3), padding: 10, alignItems: 'center' },
  numberInput: { fontFamily: F.barlow, fontSize: 26, color: C.black, textAlign: 'center', width: '100%', borderBottomWidth: 2, borderBottomColor: C.black },
  numberLabel: { fontFamily: F.interBold, fontSize: 9, letterSpacing: 1, color: C.black, opacity: 0.4, textAlign: 'center', marginTop: 4 },
  numberUnit: { fontFamily: F.inter, fontSize: 10, color: C.black, opacity: 0.35 },
  toggleCard: { backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), overflow: 'hidden', marginBottom: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, paddingHorizontal: 14 },
  toggleRowBorder: { borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.06)' },
  toggleLabel: { fontFamily: F.interBold, fontSize: 14, color: C.black, flex: 1 },
  toggle: { width: 46, height: 26, borderRadius: 13, position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  toggleThumb: { position: 'absolute', top: 2, width: 18, height: 18, borderRadius: 9, backgroundColor: C.white },
  inputLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.5, marginBottom: 5 },
  textInput: { fontFamily: F.inter, fontSize: 14, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 10, padding: 11, paddingHorizontal: 13, color: C.black },
})
