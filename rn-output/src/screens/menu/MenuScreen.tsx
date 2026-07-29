import React, { useState, useCallback } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Modal, Alert, FlatList, Image,
} from 'react-native'
import type { SetScreen } from '../../types'
import { C, F, shadow } from '../../theme'
import { DEFAULT_MENU_ITEMS, type MenuItem } from '../../data/menuStore'

const FILTER_TABS = [
  { id: 'all',         label: 'All' },
  { id: 'available',   label: 'Available' },
  { id: 'unavailable', label: 'Unavailable' },
]

const CATEGORY_TABS = [
  { id: 'cat_all',       label: 'All' },
  { id: 'cat_breakfast', label: 'Breakfast' },
  { id: 'cat_snacks',    label: 'Snacks' },
  { id: 'cat_lunch',     label: 'Lunch' },
  { id: 'cat_other',     label: 'Other' },
]

export default function MenuScreen({
  setScreen,
  menuItems,
  setMenuItems,
}: {
  setScreen: SetScreen
  menuItems: MenuItem[]
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
}) {
  const items = menuItems
  const setItems = setMenuItems

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState('cat_all')
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null)
  const [toast, setToast] = useState('')

  // ── derived ───────────────────────────────────────────────────────────────
  const availableCount = items.filter(i => i.isAvailable).length
  const unavailableCount = items.length - availableCount

  const displayed = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'available' ? item.isAvailable :
      !item.isAvailable
    const matchCat =
      category === 'cat_all' ? true :
      category === 'cat_breakfast' ? item.category === 'Breakfast' :
      category === 'cat_snacks' ? item.category === 'Snacks' :
      category === 'cat_lunch' ? item.category === 'Lunch' :
      !['Breakfast', 'Snacks', 'Lunch'].includes(item.category)
    return matchSearch && matchFilter && matchCat
  })

  // ── actions ───────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const toggleAvailability = useCallback((id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable, updatedAt: new Date().toISOString() } : i))
  }, [setItems])

  const confirmDelete = () => {
    if (!deleteTarget) return
    const name = deleteTarget.name
    setItems(prev => prev.filter(i => i.id !== deleteTarget.id))
    setDeleteTarget(null)
    showToast(`${name} removed from menu`)
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <TouchableOpacity onPress={() => setScreen('settings')}>
            <Text style={s.back}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={s.title}>Menu</Text>
            <Text style={s.subtitle}>Manage items and availability</Text>
          </View>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setScreen('menu_add_dish')}>
          <Text style={s.addBtnText}>+ Add Food</Text>
        </TouchableOpacity>
      </View>

      {/* Summary bar */}
      <View style={s.summaryRow}>
        <View style={s.summaryCard}>
          <Text style={s.summaryNum}>{items.length}</Text>
          <Text style={s.summaryLabel}>Total Items</Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryCard}>
          <Text style={[s.summaryNum, { color: C.green }]}>{availableCount}</Text>
          <Text style={s.summaryLabel}>Available</Text>
        </View>
        <View style={s.summaryDivider} />
        <View style={s.summaryCard}>
          <Text style={[s.summaryNum, { color: '#888' }]}>{unavailableCount}</Text>
          <Text style={s.summaryLabel}>Unavailable</Text>
        </View>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search menu items…"
          placeholderTextColor="rgba(0,0,0,0.35)"
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ fontSize: 14, opacity: 0.4, paddingHorizontal: 8 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Availability filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll} contentContainerStyle={s.tabsContent}>
        {FILTER_TABS.map(t => {
          const active = filter === t.id
          return (
            <TouchableOpacity key={t.id} onPress={() => setFilter(t.id)} style={[s.tab, active && s.tabActive]}>
              <Text style={[s.tabText, active && s.tabTextActive]}>{t.label.toUpperCase()}</Text>
            </TouchableOpacity>
          )
        })}
        <View style={s.tabDivider} />
        {CATEGORY_TABS.map(t => {
          const active = category === t.id
          return (
            <TouchableOpacity key={t.id} onPress={() => setCategory(t.id)} style={[s.tab, active && s.tabActive]}>
              <Text style={[s.tabText, active && s.tabTextActive]}>{t.label.toUpperCase()}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* List */}
      {displayed.length === 0 ? (
        <View style={s.empty}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🍽️</Text>
          <Text style={s.emptyTitle}>{items.length === 0 ? 'No food items yet' : 'No items match'}</Text>
          <Text style={s.emptySub}>{items.length === 0 ? 'Add your first item to start receiving orders.' : 'Try a different filter or search term.'}</Text>
          {items.length === 0 && (
            <TouchableOpacity style={s.addBtn} onPress={() => setScreen('menu_add_dish')}>
              <Text style={s.addBtnText}>+ Add Food</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={displayed}
          keyExtractor={item => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MenuItemCard
              item={item}
              onToggle={() => toggleAvailability(item.id)}
              onEdit={() => setScreen('menu_edit_dish', { id: item.id })}
              onDelete={() => setDeleteTarget(item)}
            />
          )}
        />
      )}

      {/* Delete confirm modal */}
      <Modal visible={!!deleteTarget} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Delete "{deleteTarget?.name}"?</Text>
            <Text style={s.modalBody}>
              Are you sure you want to remove this item from your menu? This cannot be undone.
            </Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setDeleteTarget(null)}>
                <Text style={s.cancelBtnText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.deleteBtn} onPress={confirmDelete}>
                <Text style={s.deleteBtnText}>DELETE</Text>
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

// ─── MenuItemCard ─────────────────────────────────────────────────────────────

function MenuItemCard({
  item, onToggle, onEdit, onDelete,
}: {
  item: MenuItem
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const isUri = item.imageUri.startsWith('http') || item.imageUri.startsWith('file') || item.imageUri.startsWith('content')

  return (
    <View style={[mc.card, !item.isAvailable && mc.cardDim]}>
      {/* Image */}
      <View style={mc.imageBox}>
        {isUri ? (
          <Image source={{ uri: item.imageUri }} style={mc.image} resizeMode="cover" />
        ) : (
          <Text style={mc.imageEmoji}>{item.imageUri || '🍽️'}</Text>
        )}
      </View>

      {/* Info */}
      <View style={mc.info}>
        <Text style={mc.name}>{item.name}</Text>
        <View style={mc.priceRow}>
          <Text style={mc.price}>₹{item.price}</Text>
          <Text style={mc.qty}>Qty: {item.quantity}</Text>
        </View>
        <View style={mc.availRow}>
          <View style={[mc.availDot, { backgroundColor: item.isAvailable ? C.green : '#bbb' }]} />
          <Text style={[mc.availLabel, { color: item.isAvailable ? C.green : '#999' }]}>
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={mc.controls}>
        {/* Toggle */}
        <TouchableOpacity
          onPress={onToggle}
          style={[mc.toggle, { backgroundColor: item.isAvailable ? C.green : '#ddd' }]}
          activeOpacity={0.8}
          accessibilityLabel={item.isAvailable ? 'Mark unavailable' : 'Mark available'}
        >
          <View style={[mc.toggleThumb, { left: item.isAvailable ? 22 : 2 }]} />
        </TouchableOpacity>

        {/* Edit & Delete */}
        <View style={mc.actionRow}>
          <TouchableOpacity style={mc.editBtn} onPress={onEdit}>
            <Text style={mc.editText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={mc.delBtn} onPress={onDelete}>
            <Text style={mc.delText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const mc = StyleSheet.create({
  card: { backgroundColor: C.white, borderRadius: 14, ...shadow(4, 4), flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  cardDim: { opacity: 0.6 },
  imageBox: { width: 72, height: 72, borderRadius: 12, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  imageEmoji: { fontSize: 36 },
  image: { width: '100%', height: '100%', borderRadius: 12 },
  info: { flex: 1, minWidth: 0 },
  name: { fontFamily: F.interBold, fontSize: 15, color: C.black, marginBottom: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  price: { fontFamily: F.barlow, fontSize: 18, color: C.black },
  qty: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.5 },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  availDot: { width: 7, height: 7, borderRadius: 4 },
  availLabel: { fontFamily: F.interBold, fontSize: 11 },
  controls: { alignItems: 'center', gap: 8, flexShrink: 0 },
  toggle: { width: 46, height: 26, borderRadius: 13, position: 'relative' },
  toggleThumb: { position: 'absolute', top: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: C.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 2 },
  actionRow: { flexDirection: 'row', gap: 6 },
  editBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' },
  editText: { fontSize: 14 },
  delBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  delText: { fontSize: 14 },
})

// ─── Main StyleSheet ──────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { fontSize: 24, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 28, color: C.black },
  subtitle: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45 },
  addBtn: { backgroundColor: C.yellow, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, ...shadow(3, 3), alignSelf: 'flex-start' },
  addBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.black },
  summaryRow: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: C.white, borderRadius: 12, ...shadow(3, 3), padding: 12, marginBottom: 12 },
  summaryCard: { flex: 1, alignItems: 'center' },
  summaryNum: { fontFamily: F.barlow, fontSize: 26, color: C.black, lineHeight: 28 },
  summaryLabel: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  summaryDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.08)', marginVertical: 4 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, backgroundColor: C.white, borderRadius: 12, paddingHorizontal: 12, marginBottom: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 3, elevation: 2 },
  searchIcon: { fontSize: 15, opacity: 0.4, marginRight: 6 },
  searchInput: { flex: 1, fontFamily: F.inter, fontSize: 14, color: C.black, paddingVertical: 11 },
  tabsScroll: { flexGrow: 0 },
  tabsContent: { paddingHorizontal: 20, gap: 6, paddingVertical: 10, alignItems: 'center' },
  tab: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.10)', flexShrink: 0, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  tabActive: { backgroundColor: C.black, borderColor: C.black },
  tabText: { fontFamily: F.barlow, fontSize: 12, color: C.black, includeFontPadding: false, textAlign: 'center' },
  tabTextActive: { color: C.yellow },
  tabDivider: { width: 1, height: 24, backgroundColor: 'rgba(0,0,0,0.12)', marginHorizontal: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 28, gap: 10 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginBottom: 6, textAlign: 'center' },
  emptySub: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.4, textAlign: 'center', marginBottom: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: C.cream, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
  modalTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginBottom: 8 },
  modalBody: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.55, marginBottom: 20, lineHeight: 20 },
  modalBtns: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: C.white, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: 13, alignItems: 'center' },
  cancelBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  deleteBtn: { flex: 1, backgroundColor: C.red, borderRadius: 12, padding: 13, alignItems: 'center', ...shadow(3, 3) },
  deleteBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.white },
  toast: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: C.black, borderRadius: 12, padding: 14, alignItems: 'center', ...shadow(3, 3, C.yellow) },
  toastText: { fontFamily: F.interBold, fontSize: 13, color: C.yellow },
})
