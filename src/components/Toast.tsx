import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#DCFCE7', border: '#22C55E', icon: '✓' },
  error:   { bg: '#FEE2E2', border: '#FF3B30', icon: '✕' },
  info:    { bg: '#DBEAFE', border: '#3B82F6', icon: 'ℹ' },
  warning: { bg: '#FEF3C7', border: '#F59E0B', icon: '!' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast_${Date.now()}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '110px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none', width: '320px' }}>
        {toasts.map(t => {
          const c = TOAST_COLORS[t.type]
          return (
            <div
              key={t.id}
              style={{ backgroundColor: c.bg, border: `2.5px solid ${c.border}`, borderRadius: '12px', boxShadow: `3px 3px 0px ${c.border}`, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideUp 0.2s ease', pointerEvents: 'auto' }}
            >
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: c.border, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                {c.icon}
              </div>
              <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '13px', flex: 1 }}>{t.message}</div>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </ToastContext.Provider>
  )
}
