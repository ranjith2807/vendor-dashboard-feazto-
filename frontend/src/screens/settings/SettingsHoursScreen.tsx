import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import Toggle from '../../components/Toggle'
import type { SetScreen } from '../../types'
import { operatingHours, type DayHours } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

export default function SettingsHoursScreen({ setScreen }: { setScreen: SetScreen }) {
  const [hours, setHours] = useState<DayHours[]>(operatingHours)
  const [saved, setSaved] = useState<boolean>(false)

  const toggle = (id: string) =>
    setHours(prev => prev.map((d: DayHours) => d.id === id ? { ...d, open: !d.open } : d))

  const setTime = (id: string, field: 'from' | 'to', val: string) =>
    setHours(prev => prev.map((d: DayHours) => d.id === id ? { ...d, [field]: val } : d))

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const PRESETS = [
    { id: 'pr_all',        label: 'Open All Days',  action: () => setHours((h: DayHours[]) => h.map((d: DayHours) => ({ ...d, open: true }))) },
    { id: 'pr_weekdays',   label: 'Weekdays Only',  action: () => setHours((h: DayHours[]) => h.map((d: DayHours) => ({ ...d, open: ['oh_mon','oh_tue','oh_wed','oh_thu','oh_fri'].includes(d.id) }))) },
    { id: 'pr_except_sun', label: 'Except Sunday',  action: () => setHours((h: DayHours[]) => h.map((d: DayHours) => ({ ...d, open: d.id !== 'oh_sun' }))) },
  ]

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('settings')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Operating Hours</Text>
        <TouchableOpacity style={s.saveBtn} onPress={save}>
          <Text style={s.saveBtnText}>{saved ? '✓ SAVED' : 'SAVE'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Presets */}
        <Text style={s.sLabel}>QUICK PRESETS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingBottom: 14 }}>
          {PRESETS.map(p => (
            <TouchableOpacity key={p.id} style={s.presetChip} onPress={p.action}>
              <Text style={s.presetChipText}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Days */}
        {hours.map((day: DayHours) => (
          <View key={day.id} style={[s.dayCard, !day.open && s.dayCardClosed]}>
            <View style={s.dayRow}>
              <View style={[s.dayBadge, !day.open && s.dayBadgeClosed]}>
                <Text style={s.dayBadgeText}>{day.short}</Text>
              </View>
              <Text style={[s.dayName, !day.open && s.textMuted]}>{day.day}</Text>
              <Text style={s.hoursLabel}>{day.open ? `${day.from} – ${day.to}` : 'Closed'}</Text>
              <Toggle value={day.open} onToggle={() => toggle(day.id)} />
            </View>

            {day.open && (
              <View style={s.timesRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.timeLabel}>OPENS AT</Text>
                  <TextInput
                    value={day.from}
                    onChangeText={v => setTime(day.id, 'from', v)}
                    placeholder="07:00"
                    style={s.timeInput}
                  />
                </View>
                <Text style={s.arrow}>→</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.timeLabel}>CLOSES AT</Text>
                  <TextInput
                    value={day.to}
                    onChangeText={v => setTime(day.id, 'to', v)}
                    placeholder="22:00"
                    style={s.timeInput}
                  />
                </View>
              </View>
            )}
          </View>
        ))}
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
  sLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.35, marginBottom: 8 },
  presetChip: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)' },
  presetChipText: { fontFamily: F.interBold, fontSize: 11, color: C.black },
  dayCard: { backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 13, marginBottom: 8 },
  dayCardClosed: { backgroundColor: '#f8f4ec', borderColor: '#ccc', shadowOpacity: 0 },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dayBadge: { width: 46, height: 28, borderRadius: 6, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  dayBadgeClosed: { backgroundColor: '#ddd' },
  dayBadgeText: { fontFamily: F.barlow, fontSize: 11, color: C.black },
  dayName: { fontFamily: F.interBold, fontSize: 14, color: C.black, flex: 1 },
  textMuted: { color: '#999' },
  hoursLabel: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45, marginRight: 8 },
  toggle: {},
  toggleThumb: {},
  timesRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  timeLabel: { fontFamily: F.interBold, fontSize: 10, letterSpacing: 1, color: C.black, opacity: 0.4, marginBottom: 4 },
  timeInput: { fontFamily: F.interBold, fontSize: 15, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', borderRadius: 8, padding: 8, paddingHorizontal: 10, color: C.black },
  arrow: { fontFamily: F.inter, fontSize: 16, color: C.black, opacity: 0.3, paddingTop: 16 },
})
