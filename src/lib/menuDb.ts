/**
 * menuDb.ts
 * Firestore operations for vendor menu items.
 *
 * Collection path: vendors/{email}/menu_items/{itemId}
 */

import {
  collection, doc, getDocs, setDoc, updateDoc,
  deleteDoc, onSnapshot,
  type Unsubscribe, type DocumentData,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { MenuItem } from '../data/menuStore'

const menuCol = (email: string) =>
  collection(db, 'vendors', email.toLowerCase(), 'menu_items')

// ── Fetch all menu items once ─────────────────────────────────────────────────

export async function fetchMenuItems(email: string): Promise<MenuItem[]> {
  try {
    const snap = await getDocs(menuCol(email))
    return snap.docs.map(d => d.data() as MenuItem)
  } catch {
    return []
  }
}

// ── Real-time listener ────────────────────────────────────────────────────────

export function subscribeMenuItems(
  email: string,
  onChange: (items: MenuItem[]) => void
): Unsubscribe {
  return onSnapshot(menuCol(email), snap => {
    onChange(snap.docs.map(d => d.data() as MenuItem))
  })
}

// ── Save (create or update) a menu item ──────────────────────────────────────

export async function saveMenuItem(
  email: string,
  item: MenuItem
): Promise<{ success: boolean; message: string }> {
  try {
    const ref = doc(menuCol(email), item.id)
    await setDoc(ref, {
      ...item,
      updatedAt: new Date().toISOString(),
    })
    return { success: true, message: 'Saved' }
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Failed to save' }
  }
}

// ── Update specific fields ────────────────────────────────────────────────────

export async function updateMenuItem(
  email: string,
  itemId: string,
  updates: Partial<MenuItem>
): Promise<void> {
  try {
    const ref = doc(menuCol(email), itemId)
    await updateDoc(ref, {
      ...updates as DocumentData,
      updatedAt: new Date().toISOString(),
    })
  } catch {
    // silently fail — local state already updated
  }
}

// ── Delete a menu item ────────────────────────────────────────────────────────

export async function deleteMenuItem(
  email: string,
  itemId: string
): Promise<{ success: boolean; message: string }> {
  try {
    await deleteDoc(doc(menuCol(email), itemId))
    return { success: true, message: 'Deleted' }
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Failed to delete' }
  }
}
