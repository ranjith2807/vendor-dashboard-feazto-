/**
 * vendorDb.ts
 * Firestore operations for the Vendor table.
 *
 * Firestore collection: "vendors"
 * Document ID: vendor's email (unique, used as natural PK)
 *
 * Schema:
 *   vendor_id    → Firestore document ID (email-based)
 *   vendor_name  → string
 *   company_name → string
 *   email        → string
 *   phone_number → string
 *   address      → string
 *   city         → string
 *   state        → string
 *   country      → string
 *   postal_code  → string
 *   documents    → { fssai?: string; gst?: string; pan?: string; aadhaar?: string }
 *   bank         → { bank_name: string; account_number: string; ifsc: string; account_holder: string }
 *   status       → 'pending' | 'approved' | 'rejected'
 *   created_at   → Firestore serverTimestamp
 *   updated_at   → Firestore serverTimestamp
 */

import {
  doc, setDoc, getDoc, updateDoc,
  serverTimestamp, DocumentData,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const COLLECTION = 'vendors'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface VendorDocuments {
  fssai?: string    // download URL
  gst?: string
  pan?: string
  aadhaar?: string
}

export interface VendorBank {
  bank_name: string
  account_number: string
  ifsc: string
  account_holder: string
}

export interface VendorProfile {
  vendor_name: string
  company_name: string
  email: string
  phone_number: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  documents?: VendorDocuments
  bank?: VendorBank
}

export interface VendorRecord extends VendorProfile {
  status: 'pending' | 'approved' | 'rejected'
  created_at: unknown
  updated_at: unknown
}

// ── Store document as base64 data URI in Firestore ───────────────────────────
//
// Firebase Storage REST API does not support the new .firebasestorage.app
// bucket format from Expo/RN without native modules.
// We store the compressed base64 image directly in Firestore (as a data URI).
// The document size stays within Firestore's 1MB limit at quality 0.5.
// An admin process can migrate these to Storage later if needed.

export async function uploadVendorDocument(
  _email: string,
  _docType: 'fssai' | 'gst' | 'pan' | 'aadhaar',
  base64Data: string,   // pure base64 string (no data-URI prefix)
  mimeType: string,     // e.g. 'image/jpeg'
): Promise<{ success: boolean; url?: string; message: string }> {
  try {
    // Wrap as a data URI so it can be displayed with <Image source={{ uri }} />
    const dataUri = `data:${mimeType};base64,${base64Data}`
    return { success: true, url: dataUri, message: 'Document saved' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to process document'
    return { success: false, message: msg }
  }
}

// ── Create vendor (called on registration submit) ─────────────────────────────

export async function createVendor(
  profile: VendorProfile
): Promise<{ success: boolean; message: string }> {
  try {
    const docRef = doc(db, COLLECTION, profile.email.toLowerCase())

    // Check if vendor already exists
    const existing = await getDoc(docRef)
    if (existing.exists()) {
      return { success: false, message: 'An account with this email already exists.' }
    }

    // Strip undefined values from documents and bank before writing
    const cleanDocs: Record<string, string> = {}
    for (const [k, v] of Object.entries(profile.documents ?? {})) {
      if (v !== undefined) cleanDocs[k] = v
    }
    const cleanBank: Record<string, string> = {}
    for (const [k, v] of Object.entries(profile.bank ?? {})) {
      if (v !== undefined) cleanBank[k] = v
    }

    await setDoc(docRef, {
      vendor_name:  profile.vendor_name,
      company_name: profile.company_name,
      email:        profile.email.toLowerCase(),
      phone_number: profile.phone_number,
      address:      profile.address,
      city:         profile.city,
      state:        profile.state,
      country:      profile.country,
      postal_code:  profile.postal_code,
      documents:    cleanDocs,
      bank:         cleanBank,
      status:       'pending',
      created_at:   serverTimestamp(),
      updated_at:   serverTimestamp(),
    })

    return { success: true, message: 'Registration successful' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save vendor data'
    return { success: false, message: msg }
  }
}

// ── Get vendor by email ───────────────────────────────────────────────────────

export async function getVendorByEmail(
  email: string
): Promise<VendorRecord | null> {
  try {
    const docRef = doc(db, COLLECTION, email.toLowerCase())
    const snap = await getDoc(docRef)
    if (!snap.exists()) return null
    return snap.data() as VendorRecord
  } catch {
    return null
  }
}

// ── Update vendor profile ─────────────────────────────────────────────────────

export async function updateVendor(
  email: string,
  updates: Partial<VendorProfile>
): Promise<{ success: boolean; message: string }> {
  try {
    const docRef = doc(db, COLLECTION, email.toLowerCase())

    // Firestore rejects undefined values — flatten and strip them out.
    // For nested objects like `documents`, expand to dot-notation fields
    // so we only write the keys that actually have values.
    const flat: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) continue

      if (key === 'documents' && typeof value === 'object' && value !== null) {
        // Expand documents to dot-notation: "documents.fssai", etc.
        for (const [dk, dv] of Object.entries(value as Record<string, unknown>)) {
          if (dv !== undefined) flat[`documents.${dk}`] = dv
        }
      } else if (key === 'bank' && typeof value === 'object' && value !== null) {
        // Expand bank similarly
        for (const [bk, bv] of Object.entries(value as Record<string, unknown>)) {
          if (bv !== undefined) flat[`bank.${bk}`] = bv
        }
      } else {
        flat[key] = value
      }
    }

    flat['updated_at'] = serverTimestamp()

    await updateDoc(docRef, flat as DocumentData)
    return { success: true, message: 'Profile updated' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update profile'
    return { success: false, message: msg }
  }
}

// ── Check vendor status (called after login) ──────────────────────────────────

export async function getVendorStatus(
  email: string
): Promise<'pending' | 'approved' | 'rejected' | 'not_found'> {
  const vendor = await getVendorByEmail(email)
  if (!vendor) return 'not_found'
  return vendor.status
}
