import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen } from '../../types'
import { allFeatureCards, type FeatureCard } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

const MAX = 10

export default function FeatureCardsScreen({ setScreen }: { setScreen: SetScreen }) {
  const [cards, setCards] = useState<FeatureCard[]>(allFeatureCards)
  const [searchQ, setSearchQ] = useState('')
  const [tab, setTab] = useState<'active' | 'add'>('active')
  const [toast, setToast] = useState('')

  const active = cards.filter(c => c.active)
  const available = cards.filter(c => !c.active && (searchQ === '' || c.label.toLowerCase().includes(searchQ.toLowerCase())))

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const toggle = (id: string, on: boolean) => {
    if (on && active.length >= MAX) { showToast(`Maximum ${MAX} feature cards allowed`); return }
    setCards(p => p.map(c => c.id === id ? { ...c, active: on } : c))
    showToast(on ? 'Feature card added!' : 'Feature card removed')
  }

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('settings')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Feature Cards</Text>
          <Text style={s.sub}>Highlight what makes your kitchen special</Text>
        </View>
        <View style={[s.countBadge, { backgroundColor: active.length >= MAX ? C.red : C.yellow }]}>
          <Text style={s.countText}>{active.length}/{MAX}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabsRow}>
        {(['active', 'add'] as const).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[s.tab, tab === t && s.tabActive]}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>
              {t === 'active' ? `ACTIVE (${active.length})` : 'ADD FEATURE'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {tab === 'active' ? (
          active.length === 0 ? (
            <View style={s.empty}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🃏</Text>
              <Text style={s.emptyTitle}>No Feature Cards Yet</Text>
              <Text style={s.emptySub}>Add features to tell customers what makes your kitchen unique.</Text>
              <TouchableOpacity style={s.addFirstBtn} onPress={() => setTab('add')}>
                <Text style={s.addFirstBtnText}>ADD YOUR FIRST CARD →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {active.length <= 5 && (
                <View style={s.tipBanner}>
                  <Text style={{ fontSize: 18 }}>💡</Text>
                  <Text style={s.tipText}>
                    You have {active.length} feature card{active.length !== 1 ? 's' : ''}. Add {6 - active.length} more to improve visibility!
                  </Text>
                </View>
              )}
              {active.map(card => (
                <View key={card.id} style={s.cardRow}>
                  <View style={s.cardIcon}><Text style={{ fontSize: 22 }}>{card.icon}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardLabel}>{card.label}</Text>
                    <Text style={s.cardDesc}>{card.description}</Text>
                  </View>
                  <TouchableOpacity style={s.removeBtn} onPress={() => toggle(card.id, false)}>
                    <Text style={s.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )
        ) : (
          <>
            {/* Search */}
            <View style={s.searchRow}>
              <Text style={s.searchIcon}>🔍</Text>
              <TextInput
                value={searchQ}
                onChangeText={setSearchQ}
                placeholder="Search features…"
                style={s.searchInput}
              />
            </View>

            {active.length >= MAX && (
              <View style={s.maxBanner}>
                <Text style={s.maxText}>Maximum {MAX} cards reached. Remove one to add another.</Text>
              </View>
            )}

            {available.length === 0 && searchQ ? (
              <Text style={s.noResults}>No features match "{searchQ}"</Text>
            ) : available.map(card => (
              <View key={card.id} style={s.cardRow}>
                <View style={s.cardIcon}><Text style={{ fontSize: 22 }}>{card.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardLabel}>{card.label}</Text>
                  <Text style={s.cardDesc}>{card.description}</Text>
                </View>
                <TouchableOpacity
                  style={[s.addBtn, active.length >= MAX && s.addBtnDisabled]}
                  onPress={() => toggle(card.id, true)}
                  disabled={active.length >= MAX}
                >
                  <Text style={s.addBtnText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Toast */}
      {!!toast && (
        <View style={s.toast}>
          <Text style={s.toastText}>{toast}</Text>
        </View>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 0 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black },
  sub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45 },
  countBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  countText: { fontFamily: F.barlow, fontSize: 14, color: C.black },
  tabsRow: { flexDirection: 'row', gap: 8, padding: 12, paddingHorizontal: 20 },
  tab: { flex: 1, backgroundColor: C.white, borderRadius: 10, padding: 9, alignItems: 'center', borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000' },
  tabActive: { backgroundColor: C.black, shadowOpacity: 0 },
  tabText: { fontFamily: F.barlow, fontSize: 14, color: C.black },
  tabTextActive: { color: C.yellow },
  body: { paddingHorizontal: 20, paddingBottom: 100, gap: 8 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginBottom: 6 },
  emptySub: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.45, textAlign: 'center', maxWidth: 240, marginBottom: 16 },
  addFirstBtn: { backgroundColor: C.yellow, borderRadius: 10, paddingHorizontal: 22, paddingVertical: 11, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(3, 3) },
  addFirstBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  tipBanner: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#FEF3C7', borderColor: C.amber, borderRadius: 12, padding: 12 },
  tipText: { fontFamily: F.inter, fontSize: 12, color: C.black, lineHeight: 18, flex: 1 },
  cardRow: { backgroundColor: C.white, borderRadius: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', ...shadow(3, 3), padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { width: 42, height: 42, borderRadius: 10, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardLabel: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  cardDesc: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  removeBtn: { backgroundColor: '#FEE2E2', borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#000', borderRadius: 7, paddingHorizontal: 10, paddingVertical: 5 },
  removeBtnText: { fontFamily: F.interBold, fontSize: 11, color: C.red },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 12, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', paddingHorizontal: 12, ...shadow(3, 3) },
  searchIcon: { fontSize: 15, opacity: 0.4, marginRight: 6 },
  searchInput: { flex: 1, fontFamily: F.inter, fontSize: 14, color: C.black, paddingVertical: 11 },
  maxBanner: { backgroundColor: '#FEE2E2', borderColor: C.red, borderRadius: 12, padding: 12 },
  maxText: { fontFamily: F.interBold, fontSize: 12, color: C.red, textAlign: 'center' },
  noResults: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.4, textAlign: 'center', paddingTop: 32 },
  addBtn: { backgroundColor: C.yellow, borderRadius: 8, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000', paddingHorizontal: 12, paddingVertical: 7 },
  addBtnDisabled: { backgroundColor: '#ddd', borderColor: '#ccc', shadowOpacity: 0 },
  addBtnText: { fontFamily: F.barlow, fontSize: 13, color: C.black },
  toast: { position: 'absolute', bottom: 90, left: 20, right: 20, backgroundColor: C.black, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: C.yellow, borderRadius: 12, padding: 12, alignItems: 'center', ...shadow(3, 3, C.yellow) },
  toastText: { fontFamily: F.interBold, fontSize: 13, color: C.yellow },
})
