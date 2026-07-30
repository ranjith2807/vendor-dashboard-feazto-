import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import type { SetScreen } from '../../types'
import { searchCategories, recentSearches, mockMenu } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

const TYPE_COLOR: Record<string, string> = {
  menu: C.yellow, customer: C.blue, order: C.green, community: C.purple,
}

export default function SearchScreen({ setScreen }: { setScreen: SetScreen }) {
  const [query, setQuery] = useState('')

  const results = query.length > 1
    ? mockMenu.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <View style={s.root}>
      {/* Search bar */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('dashboard')}><Text style={s.back}>←</Text></TouchableOpacity>
        <View style={s.inputWrap}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search orders, menu, customers…"
            style={s.input}
            returnKeyType="search"
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={s.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {query.length === 0 ? (
          <>
            {/* Recent */}
            <Text style={s.sectionLabel}>RECENT</Text>
            {recentSearches.map(rs => (
              <TouchableOpacity key={rs.id} style={s.recentRow} onPress={() => setQuery(rs.query)}>
                <Text style={s.recentIcon}>{rs.icon}</Text>
                <Text style={s.recentQuery}>{rs.query}</Text>
                <Text style={s.recentArrow}>↗</Text>
              </TouchableOpacity>
            ))}

            {/* Browse */}
            <Text style={[s.sectionLabel, { marginTop: 8 }]}>BROWSE</Text>
            <View style={s.browseGrid}>
              {searchCategories.map(cat => (
                <TouchableOpacity key={cat.id} style={s.browseCard} onPress={() => setQuery(cat.label)}>
                  <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
                  <View>
                    <Text style={s.browseLabel}>{cat.label}</Text>
                    <Text style={[s.browseType, { color: TYPE_COLOR[cat.type] ?? '#888' }]}>{cat.type.toUpperCase()}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : results.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
            <Text style={s.emptyTitle}>No results found</Text>
            <Text style={s.emptySub}>Try a different search term</Text>
          </View>
        ) : (
          <>
            <Text style={s.sectionLabel}>{results.length} RESULT{results.length !== 1 ? 'S' : ''}</Text>
            {results.map(item => (
              <TouchableOpacity key={item.id} style={s.resultCard} onPress={() => setScreen('menu')}>
                <View style={[s.resultIcon, { backgroundColor: item.veg ? '#DCFCE7' : '#FEE2E2' }]}>
                  <Text style={{ fontSize: 20 }}>{item.veg ? '🥦' : '🍗'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.resultName} numberOfLines={1}>{item.name}</Text>
                  <Text style={s.resultMeta}>{item.category} · ₹{item.price}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.resultPrice}>₹{item.price}</Text>
                  <Text style={[s.resultAvail, { color: item.available ? C.green : C.red }]}>
                    {item.available ? 'Available' : 'Off'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 22, color: C.black },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: C.white,  borderRadius: 12, paddingHorizontal: 12, ...shadow(3, 3) },
  searchIcon: { fontSize: 16, opacity: 0.4, marginRight: 6 },
  input: { flex: 1, fontFamily: F.inter, fontSize: 14, color: C.black, paddingVertical: 11 },
  clearBtn: { fontSize: 16, color: C.black, opacity: 0.4 },
  body: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.35, marginBottom: 10 },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, paddingHorizontal: 14, backgroundColor: C.white, borderRadius: 10, marginBottom: 6, borderBottomWidth: 2, borderRightWidth: 2, borderBottomColor: '#000', borderRightColor: '#000' },
  recentIcon: { fontSize: 14, opacity: 0.35 },
  recentQuery: { fontFamily: F.inter, fontSize: 13, color: C.black, flex: 1 },
  recentArrow: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.25 },
  browseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  browseCard: { width: '47%', backgroundColor: C.white, borderRadius: 12, ...shadow(3, 3), padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  browseLabel: { fontFamily: F.interBold, fontSize: 12, color: C.black },
  browseType: { fontFamily: F.interBold, fontSize: 10, letterSpacing: 1 },
  empty: { alignItems: 'center', paddingTop: 48 },
  emptyTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginBottom: 6 },
  emptySub: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.4 },
  resultCard: { backgroundColor: C.white, borderRadius: 12, ...shadow(3, 3), padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  resultIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  resultName: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  resultMeta: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  resultPrice: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  resultAvail: { fontFamily: F.interBold, fontSize: 10 },
})
