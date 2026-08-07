/**
 * VendorContext — global state for the logged-in vendor.
 * Fetches vendor data from Firestore once on login and makes it
 * available to all screens without prop drilling.
 */

import React, { createContext, useContext, useState, useCallback } from 'react'
import { getVendorByEmail, updateVendor, type VendorProfile, type VendorRecord } from '../../../backend/services/vendorService'

interface VendorContextValue {
  vendor: VendorRecord | null
  loading: boolean
  loadVendor: (email: string) => Promise<void>
  refreshVendor: () => Promise<void>
  updateVendorProfile: (updates: Partial<VendorProfile>) => Promise<{ success: boolean; message: string }>
  clearVendor: () => void
}

const VendorContext = createContext<VendorContextValue>({
  vendor: null,
  loading: false,
  loadVendor: async () => {},
  refreshVendor: async () => {},
  updateVendorProfile: async () => ({ success: false, message: '' }),
  clearVendor: () => {},
})

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [vendor, setVendor] = useState<VendorRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentEmail, setCurrentEmail] = useState<string>('')

  const loadVendor = useCallback(async (email: string) => {
    setLoading(true)
    setCurrentEmail(email)
    const data = await getVendorByEmail(email)
    setVendor(data)
    setLoading(false)
  }, [])

  const refreshVendor = useCallback(async () => {
    if (!currentEmail) return
    const data = await getVendorByEmail(currentEmail)
    setVendor(data)
  }, [currentEmail])

  const updateVendorProfile = useCallback(async (updates: Partial<VendorProfile>) => {
    if (!currentEmail) return { success: false, message: 'Not logged in' }
    const result = await updateVendor(currentEmail, updates)
    if (result.success) await refreshVendor()
    return result
  }, [currentEmail, refreshVendor])

  const clearVendor = useCallback(() => {
    setVendor(null)
    setCurrentEmail('')
  }, [])

  return (
    <VendorContext.Provider value={{ vendor, loading, loadVendor, refreshVendor, updateVendorProfile, clearVendor }}>
      {children}
    </VendorContext.Provider>
  )
}

export const useVendor = () => useContext(VendorContext)
