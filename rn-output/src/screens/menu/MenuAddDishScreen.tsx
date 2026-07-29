import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Image, Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import type { SetScreen } from '../../types'
import { C, F, shadow } from '../../theme'
import { DEFAULT_MENU_ITEMS, type MenuItem } from '../../data/menuStore'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts', 'Specials']

export default function MenuAddDishScreen({
  setScreen,
  setMenuItems,
}: {
  setScreen: SetScreen
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
}) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState('Breakfast')
  const [description, setDescription] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [isVeg, setIsVeg] = useState(true)
  const [imageUri, setImageUri] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [savedName, setSavedName] = useState('')

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access gallery is required to choose a food photo.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri)
      setErrors(p => ({ ...p, image: '' }))
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access camera is required to take a food photo.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri)
      setErrors(p => ({ ...p, image: '' }))
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Food name is required'
    const p = Number(price)
    if (!price || isNaN(p) || p <= 0) e.price = 'Enter a valid price'
    if (quantity < 1) e.quantity = 'Minimum quantity is 1'
    if (!imageUri) e.image = 'Food photo is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const newItem: MenuItem = {
      id: `menu_${Date.now()}`,
      name: name.trim(),
      price: Number(price),
      quantity,
      imageUri,
      isAvailable,
      category,
      isVeg,
      description: description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Save to the global shared state
    setMenuItems(prev => [...prev, newItem])
    setSavedName(name.trim())
    setSaved(true)
  }

  if (saved) return (
    <View style={s.success}>
      <View style={s.successCircle}><Text style={{ fontSize: 36, color: C.white }}>✓</Text></View>
      <Text style={s.successTitle}>Item Added!</Text>
      <Text style={s.successSub}>"{savedName}" is now in your menu.</Text>
      <View style={s.successBtns}>
        <TouchableOpacity style={s.outlineBtn} onPress={() => {
          setName(''); setPrice(''); setQuantity(1); setDescription(''); setImageUri(''); setSaved(false)
        }}>
          <Text style={s.outlineBtnText}>Add Another</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.primaryBtn} onPress={() => setScreen('menu')}>
          <Text style={s.primaryBtnText}>VIEW MENU →</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('menu')}><Text style={s.back}>←</Text></TouchableOpacity>
        <View>
          <Text style={s.title}>Add Food</Text>
          <Text style={s.subtitle}>Fill in the details below</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">

        {/* Photo picker */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>FOOD PHOTO</Text>
          <Text style={s.fieldHint}>Upload or capture a photo of the food item</Text>
          
          <View style={s.photoContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={s.photoPreview} resizeMode="cover" />
            ) : (
              <View style={s.photoPlaceholder}>
                <Text style={{ fontSize: 36, opacity: 0.3 }}>📸</Text>
                <Text style={s.photoPlaceholderText}>No Photo Selected</Text>
              </View>
            )}
          </View>

          <View style={s.photoActions}>
            <TouchableOpacity style={s.photoBtn} onPress={pickImage}>
              <Text style={s.photoBtnText}>🖼️ Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.photoBtn} onPress={takePhoto}>
              <Text style={s.photoBtnText}>📷 Camera</Text>
            </TouchableOpacity>
            {!!imageUri && (
              <TouchableOpacity style={[s.photoBtn, s.photoBtnDanger]} onPress={() => setImageUri('')}>
                <Text style={s.photoBtnTextDanger}>✕ Remove</Text>
              </TouchableOpacity>
            )}
          </View>
          {!!errors.image && <Text style={s.errText}>{errors.image}</Text>}
        </View>

        {/* Name */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>FOOD NAME</Text>
          <TextInput
            value={name}
            onChangeText={v => { setName(v); setErrors(p => ({ ...p, name: '' })) }}
            placeholder="e.g. Chicken Biryani"
            placeholderTextColor="rgba(0,0,0,0.3)"
            style={[s.input, !!errors.name && s.inputErr]}
          />
          {!!errors.name && <Text style={s.errText}>{errors.name}</Text>}
        </View>

        {/* Price */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>PRICE</Text>
          <View style={s.priceWrap}>
            <Text style={s.pricePrefix}>₹</Text>
            <TextInput
              value={price}
              onChangeText={v => { setPrice(v.replace(/[^0-9.]/g, '')); setErrors(p => ({ ...p, price: '' })) }}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="rgba(0,0,0,0.3)"
              style={[s.priceInput, !!errors.price && s.inputErr]}
            />
          </View>
          {!!errors.price && <Text style={s.errText}>{errors.price}</Text>}
        </View>

        {/* Quantity */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>QUANTITY PER ORDER</Text>
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
          {!!errors.quantity && <Text style={s.errText}>{errors.quantity}</Text>}
        </View>

        {/* Category */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>CATEGORY</Text>
          <View style={s.chips}>
            {CATEGORIES.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[s.chip, category === c && s.chipActive]}
              >
                <Text style={[s.chipText, category === c && s.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Veg/Non-veg */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>TYPE</Text>
          <View style={s.typeRow}>
            <TouchableOpacity
              style={[s.typeBtn, isVeg && s.typeBtnActive]}
              onPress={() => setIsVeg(true)}
            >
              <Text style={s.typeBtnIcon}>🟢</Text>
              <Text style={[s.typeBtnText, isVeg && s.typeBtnTextActive]}>Vegetarian</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.typeBtn, !isVeg && s.typeBtnActiveRed]}
              onPress={() => setIsVeg(false)}
            >
              <Text style={s.typeBtnIcon}>🔴</Text>
              <Text style={[s.typeBtnText, !isVeg && s.typeBtnTextActive]}>Non-Veg</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Availability */}
        <View style={s.card}>
          <TouchableOpacity style={s.availRow} onPress={() => setIsAvailable(v => !v)} activeOpacity={0.8}>
            <View style={{ flex: 1 }}>
              <Text style={s.availTitle}>Available for orders</Text>
              <Text style={s.availSub}>{isAvailable ? 'Customers can order this item' : 'Item hidden from customers'}</Text>
            </View>
            <View style={[s.toggle, { backgroundColor: isAvailable ? C.green : '#ddd' }]}>
              <View style={[s.toggleThumb, { left: isAvailable ? 22 : 2 }]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>DESCRIPTION (optional)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Short description of the dish…"
            placeholderTextColor="rgba(0,0,0,0.3)"
            multiline
            numberOfLines={3}
            style={[s.input, { height: 72, textAlignVertical: 'top' }]}
          />
        </View>

        {/* Save button */}
        <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
          <Text style={s.saveBtnText}>ADD FOOD →</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, paddingBottom: 12 },
  back: { fontSize: 24, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black },
  subtitle: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45 },
  body: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },
  card: { backgroundColor: C.white, borderRadius: 14, ...shadow(4, 4), padding: 16 },
  fieldLabel: { fontFamily: F.interBold, fontSize: 11, letterSpacing: 1, color: C.black, opacity: 0.5, marginBottom: 5 },
  fieldHint: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.35, marginBottom: 10 },
  photoContainer: { height: 160, borderRadius: 14, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%' },
  photoPlaceholder: { alignItems: 'center', gap: 4 },
  photoPlaceholderText: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.35 },
  photoActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  photoBtn: { flex: 1, backgroundColor: C.cream, borderRadius: 10, paddingVertical: 10, alignItems: 'center', ...shadow(2, 2) },
  photoBtnDanger: { backgroundColor: '#FEE2E2' },
  photoBtnText: { fontFamily: F.interBold, fontSize: 12, color: C.black },
  photoBtnTextDanger: { fontFamily: F.interBold, fontSize: 12, color: C.red },
  input: { fontFamily: F.inter, fontSize: 14, backgroundColor: C.cream, borderRadius: 10, padding: 12, paddingHorizontal: 14, color: C.black },
  inputErr: { borderWidth: 1.5, borderColor: C.red },
  errText: { fontFamily: F.interBold, fontSize: 11, color: C.red, marginTop: 4 },
  priceWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.cream, borderRadius: 10, overflow: 'hidden' },
  pricePrefix: { fontFamily: F.barlow, fontSize: 20, color: C.black, paddingHorizontal: 14 },
  priceInput: { flex: 1, fontFamily: F.inter, fontSize: 16, padding: 12, color: C.black },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  stepBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', ...shadow(2, 2) },
  stepBtnDisabled: { backgroundColor: '#e0e0e0', shadowOpacity: 0 },
  stepBtnText: { fontFamily: F.barlow, fontSize: 24, color: C.black, lineHeight: 26 },
  stepVal: { fontFamily: F.barlow, fontSize: 30, color: C.black, minWidth: 44, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: C.cream, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  chipActive: { backgroundColor: C.black },
  chipText: { fontFamily: F.interBold, fontSize: 12, color: C.black },
  chipTextActive: { color: C.yellow },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.cream, borderRadius: 12, padding: 12 },
  typeBtnActive: { backgroundColor: '#DCFCE7' },
  typeBtnActiveRed: { backgroundColor: '#FEE2E2' },
  typeBtnIcon: { fontSize: 16 },
  typeBtnText: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  typeBtnTextActive: { color: C.black },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  availTitle: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  availSub: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  toggle: { width: 46, height: 26, borderRadius: 13, position: 'relative' },
  toggleThumb: { position: 'absolute', top: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: C.white },
  saveBtn: { backgroundColor: C.yellow, borderRadius: 14, padding: 16, alignItems: 'center', ...shadow(4, 4) },
  saveBtnText: { fontFamily: F.barlow, fontSize: 18, letterSpacing: 1, color: C.black },
  success: { flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.green, ...shadow(4, 4), alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontFamily: F.barlow, fontSize: 30, color: C.black, marginBottom: 8 },
  successSub: { fontFamily: F.inter, fontSize: 14, color: C.black, opacity: 0.5, textAlign: 'center', marginBottom: 28 },
  successBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  outlineBtn: { flex: 1, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 13, alignItems: 'center' },
  outlineBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
  primaryBtn: { flex: 1, backgroundColor: C.yellow, borderRadius: 12, padding: 13, alignItems: 'center', ...shadow(3, 3) },
  primaryBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
})
