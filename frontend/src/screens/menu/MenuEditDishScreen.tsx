import React, { useState } from 'react'
import {
  View, Text, ScrollView, TextInput, StyleSheet, Modal, Image, Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { C, F, shadow } from '../../theme'
import { useVendor } from '../../context/VendorContext'
import { saveMenuItem, deleteMenuItem } from '../../../../backend/services/menuService'
import { type MenuItem } from '../../data/menuStore'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts', 'Specials']
const FOOD_EMOJIS = ['🍛','🍜','🍝','🥣','🥗','🥞','🍲','🫔','🫓','🍩','🥐','🧆','🍱','🍘','🍢','🥟','🫕','🥘']

export default function MenuEditDishScreen({
  setScreen, navParams, menuItems, setMenuItems,
}: {
  setScreen: SetScreen
  navParams: NavParams
  menuItems: MenuItem[]
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
}) {
  const { vendor } = useVendor()
  const email = vendor?.email ?? ''

  const dish = menuItems.find(d => d.id === navParams.id) ?? menuItems[0]

  const [name,        setName]       = useState(dish?.name        ?? '')
  const [price,       setPrice]      = useState(String(dish?.price ?? 0))
  const [quantity,    setQuantity]   = useState(dish?.quantity    ?? 1)
  const [category,    setCategory]   = useState(dish?.category    ?? 'Breakfast')
  const [description, setDesc]       = useState(dish?.description ?? '')
  const [isAvailable, setAvail]      = useState(dish?.isAvailable ?? true)
  const [isVeg,       setVeg]        = useState(dish?.isVeg       ?? true)
  const [imageUri,    setImageUri]   = useState(dish?.imageUri    ?? '')
  const [errors,      setErrors]     = useState<Record<string, string>>({})
  const [saving,      setSaving]     = useState(false)
  const [saved,       setSaved]      = useState(false)
  const [showDelete,  setShowDelete] = useState(false)
  const [showEmoji,   setShowEmoji]  = useState(false)
  const [showPhotoMenu, setShowPhotoMenu] = useState(false)

  const isImageUri =
    imageUri.startsWith('http') || imageUri.startsWith('data:') ||
    imageUri.startsWith('file') || imageUri.startsWith('content')

  // ── Image helpers ─────────────────────────────────────────────────────────

  const pickBase64 = async (fromCamera: boolean) => {
    setShowPhotoMenu(false)
    if (fromCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') { Alert.alert('Permission Denied', 'Camera access required.'); return }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') { Alert.alert('Permission Denied', 'Gallery access required.'); return }
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.6, base64: true })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.6, base64: true })

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0]
      const mime = asset.mimeType ?? 'image/jpeg'
      setImageUri(asset.base64 ? `data:${mime};base64,${asset.base64}` : asset.uri)
    }
  }

  // ── Validate & save ───────────────────────────────────────────────────────

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Food name is required'
    const p = Number(price)
    if (!price || isNaN(p) || p <= 0) e.price = 'Enter a valid price'
    if (quantity < 1) e.quantity = 'Minimum quantity is 1'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate() || !dish) return
    setSaving(true)
    const updated: MenuItem = {
      ...dish,
      name:        name.trim(),
      price:       Number(price),
      quantity,
      category,
      description: description.trim(),
      isAvailable,
      isVeg,
      imageUri,
      updatedAt:   new Date().toISOString(),
    }
    if (email) await saveMenuItem(email, updated)
    setMenuItems(prev => prev.map(i => i.id === updated.id ? updated : i))
    setSaving(false)
    setSaved(true)
  }

  const handleDelete = async () => {
    if (!dish || !email) return
    await deleteMenuItem(email, dish.id)
    setMenuItems(prev => prev.filter(i => i.id !== dish.id))
    setShowDelete(false)
    setScreen('menu')
  }

  // ── Success state ─────────────────────────────────────────────────────────

  if (saved) return (
    <View style={s.success}>
      <View style={s.successIcon}><Text style={{ fontSize: 32, color: C.white }}>✓</Text></View>
      <Text style={s.successTitle}>Saved!</Text>
      <Text style={s.successSub}>"{name}" has been updated.</Text>
      <TouchableOpacity style={s.primaryBtn} onPress={() => setScreen('menu')}>
        <Text style={s.primaryBtnText}>BACK TO MENU →</Text>
      </TouchableOpacity>
    </View>
  )

  if (!dish) return (
    <View style={s.success}>
      <Text style={s.successTitle}>Item not found</Text>
      <TouchableOpacity style={s.primaryBtn} onPress={() => setScreen('menu')}>
        <Text style={s.primaryBtnText}>← BACK</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('menu')}><Text style={s.back}>←</Text></TouchableOpacity>
        <Text style={s.title}>Edit Item</Text>
        <TouchableOpacity onPress={() => setShowDelete(true)} style={s.delHeaderBtn}>
          <Text style={s.delHeaderBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">

        {/* Photo */}
        <View style={s.card}>
          <Text style={s.label}>FOOD PHOTO</Text>
          <View style={s.photoContainer}>
            {isImageUri ? (
              <Image source={{ uri: imageUri }} style={s.photoPreview} resizeMode="cover" />
            ) : imageUri ? (
              <Text style={{ fontSize: 64 }}>{imageUri}</Text>
            ) : (
              <Text style={{ fontSize: 36, opacity: 0.3 }}>🍽️</Text>
            )}
          </View>
          <View style={s.photoActions}>
            <TouchableOpacity style={s.photoBtn} onPress={() => pickBase64(false)}>
              <Text style={s.photoBtnText}>🖼️ Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.photoBtn} onPress={() => pickBase64(true)}>
              <Text style={s.photoBtnText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.photoBtn} onPress={() => setShowEmoji(true)}>
              <Text style={s.photoBtnText}>😊 Emoji</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Name */}
        <View style={s.card}>
          <Text style={s.label}>FOOD NAME</Text>
          <TextInput
            value={name}
            onChangeText={v => { setName(v); setErrors(p => ({ ...p, name: '' })) }}
            style={[s.input, !!errors.name && s.inputErr]}
            placeholder="e.g. Idli"
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
          {!!errors.name && <Text style={s.errText}>{errors.name}</Text>}
        </View>

        {/* Price + Quantity */}
        <View style={s.card}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>PRICE (₹)</Text>
              <View style={s.priceWrap}>
                <Text style={s.pricePrefix}>₹</Text>
                <TextInput
                  value={price}
                  onChangeText={v => { setPrice(v.replace(/[^0-9.]/g, '')); setErrors(p => ({ ...p, price: '' })) }}
                  keyboardType="numeric"
                  style={[s.priceInput, !!errors.price && s.inputErr]}
                  placeholder="0"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                />
              </View>
              {!!errors.price && <Text style={s.errText}>{errors.price}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>QUANTITY</Text>
              <View style={s.stepperRow}>
                <TouchableOpacity
                  style={[s.stepBtn, quantity <= 1 && s.stepBtnDisabled]}
                  onPress={() => quantity > 1 && setQuantity(q => q - 1)}
                >
                  <Text style={s.stepBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={s.stepVal}>{quantity}</Text>
                <TouchableOpacity style={s.stepBtn} onPress={() => setQuantity(q => q + 1)}>
                  <Text style={s.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Category */}
        <View style={s.card}>
          <Text style={s.label}>CATEGORY</Text>
          <View style={s.chips}>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c} onPress={() => setCategory(c)} style={[s.chip, category === c && s.chipActive]}>
                <Text style={[s.chipText, category === c && s.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Veg + Availability */}
        <View style={s.card}>
          <Text style={s.label}>TYPE</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {[{ label: '🟢 Veg', val: true }, { label: '🔴 Non-Veg', val: false }].map(o => (
              <TouchableOpacity key={String(o.val)} onPress={() => setVeg(o.val)}
                style={[s.typeBtn, isVeg === o.val && s.typeBtnActive]}>
                <Text style={[s.typeBtnText, isVeg === o.val && s.typeBtnTextActive]}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.label}>AVAILABILITY</Text>
          <TouchableOpacity style={s.availRow} onPress={() => setAvail(v => !v)} activeOpacity={0.8}>
            <View style={{ flex: 1 }}>
              <Text style={s.availTitle}>{isAvailable ? 'Available for orders' : 'Not available'}</Text>
              <Text style={s.availSub}>{isAvailable ? 'Customers can order this item' : 'Hidden from customers'}</Text>
            </View>
            <View style={[s.toggle, { backgroundColor: isAvailable ? C.green : '#ddd' }]}>
              <View style={[s.toggleThumb, { left: isAvailable ? 22 : 2 }]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={s.card}>
          <Text style={s.label}>DESCRIPTION</Text>
          <TextInput
            value={description}
            onChangeText={setDesc}
            multiline
            numberOfLines={3}
            style={[s.input, { height: 72, textAlignVertical: 'top' }]}
            placeholder="Short description…"
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
        </View>

        <TouchableOpacity style={[s.primaryBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          <Text style={s.primaryBtnText}>{saving ? 'SAVING…' : 'SAVE CHANGES →'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Emoji picker modal */}
      <Modal visible={showEmoji} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={s.modalTitle}>Pick a Food Icon</Text>
              <TouchableOpacity onPress={() => setShowEmoji(false)}><Text style={{ fontSize: 20 }}>✕</Text></TouchableOpacity>
            </View>
            <View style={s.emojiGrid}>
              {FOOD_EMOJIS.map(e => (
                <TouchableOpacity key={e}
                  style={[s.emojiOption, imageUri === e && s.emojiOptionActive]}
                  onPress={() => { setImageUri(e); setShowEmoji(false) }}>
                  <Text style={{ fontSize: 28 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete confirm modal */}
      <Modal visible={showDelete} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Delete "{dish.name}"?</Text>
            <Text style={s.modalBody}>This will permanently remove the item from your menu.</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={s.outlineBtn} onPress={() => setShowDelete(false)}>
                <Text style={s.outlineBtnText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.dangerBtn} onPress={handleDelete}>
                <Text style={s.dangerBtnText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 24, color: C.black, flex: 1 },
  delHeaderBtn: { paddingHorizontal: 10, paddingVertical: 5 },
  delHeaderBtnText: { fontFamily: F.interBold, fontSize: 13, color: C.red },
  body: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },
  card: { backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(4, 4), padding: 16 },
  label: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.5, marginBottom: 6 },
  input: { fontFamily: F.inter, fontSize: 14, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12, paddingHorizontal: 14, color: C.black, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  inputErr: { borderWidth: 1.5, borderColor: C.red },
  errText: { fontFamily: F.interBold, fontSize: 11, color: C.red, marginTop: 4 },
  photoContainer: { height: 140, borderRadius: 12, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%' },
  photoActions: { flexDirection: 'row', gap: 8 },
  photoBtn: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 10, paddingVertical: 9, alignItems: 'center', ...shadow(2, 2) },
  photoBtnText: { fontFamily: F.interBold, fontSize: 12, color: C.black },
  priceWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  pricePrefix: { fontFamily: F.barlow, fontSize: 18, color: C.black, paddingHorizontal: 12 },
  priceInput: { flex: 1, fontFamily: F.inter, fontSize: 15, padding: 11, color: C.black },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', ...shadow(2, 2) },
  stepBtnDisabled: { backgroundColor: '#e0e0e0', shadowOpacity: 0 },
  stepBtnText: { fontFamily: F.barlow, fontSize: 20, color: C.black, lineHeight: 22 },
  stepVal: { fontFamily: F.barlow, fontSize: 22, color: C.black, minWidth: 28, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  chipActive: { backgroundColor: C.black },
  chipText: { fontFamily: F.interBold, fontSize: 12, color: C.black },
  chipTextActive: { color: C.yellow },
  typeBtn: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  typeBtnActive: { backgroundColor: C.black },
  typeBtnText: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  typeBtnTextActive: { color: C.yellow },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  availTitle: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  availSub: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  toggle: { width: 46, height: 26, borderRadius: 13, position: 'relative' },
  toggleThumb: { position: 'absolute', top: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: C.white },
  primaryBtn: { backgroundColor: C.yellow, borderRadius: 14, padding: 16, alignItems: 'center', ...shadow(4, 4) },
  primaryBtnText: { fontFamily: F.barlow, fontSize: 17, letterSpacing: 1, color: C.black },
  outlineBtn: { flex: 1, backgroundColor: C.white, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: 13, alignItems: 'center' },
  outlineBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  dangerBtn: { flex: 1, backgroundColor: C.red, borderRadius: 12, padding: 13, alignItems: 'center', ...shadow(3, 3) },
  dangerBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: C.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 36 },
  modalTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginBottom: 6 },
  modalBody: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.5, marginBottom: 18, lineHeight: 20 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  emojiOption: { width: 56, height: 56, borderRadius: 14, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' },
  emojiOptionActive: { backgroundColor: C.yellow, ...shadow(2, 2) },
  success: { flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.green, ...shadow(4, 4), alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontFamily: F.barlow, fontSize: 28, color: C.black, marginBottom: 8 },
  successSub: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.5, textAlign: 'center', marginBottom: 24 },
})
