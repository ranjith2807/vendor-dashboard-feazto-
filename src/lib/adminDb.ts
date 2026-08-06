/**
 * adminDb.ts
 * Firestore operations for the Admin Panel.
 * Reads vendors collection, updates status.
 */

import {
  collection, getDocs, doc, updateDoc,
  query, orderBy, serverTimestamp, DocumentData,
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'vendors'

export interface VendorDoc {
  id: string          // doc id = email
  vendor_name: string
  company_name: string
  email: string
  phone_number: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: { seconds: number } | null
  documents?: {
    fssai?: string
    gst?: string
    pan?: string
    aadhaar?: string
  }
  bank?: {
    bank_name?: string
    account_number?: string
    ifsc?: string
    account_holder?: string
  }
}

export async function getAllVendors(): Promise<VendorDoc[]> {
  try {
    const q = query(collection(db, COLLECTION), orderBy('created_at', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as VendorDoc))
  } catch {
    // Fallback without ordering if index missing
    const snap = await getDocs(collection(db, COLLECTION))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as VendorDoc))
  }
}

export async function updateVendorStatus(
  email: string,
  status: 'approved' | 'rejected',
): Promise<{ success: boolean; message: string }> {
  try {
    const docRef = doc(db, COLLECTION, email.toLowerCase())
    await updateDoc(docRef, {
      status,
      updated_at: serverTimestamp(),
    } as DocumentData)
    return { success: true, message: `Vendor ${status}` }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed'
    return { success: false, message: msg }
  }
}
