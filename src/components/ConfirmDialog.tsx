interface ConfirmDialogProps {
  open: boolean
  title: string
  body?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, body, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', backgroundColor: '#FFF8E7', border: 'none', borderRadius: '20px', boxShadow: '6px 6px 0px #000', padding: '22px', marginBottom: '12px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '6px' }}>{title}</div>
        {body && <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.55, marginBottom: '18px', lineHeight: 1.5 }}>{body}</div>}
        <div style={{ display: 'flex', gap: '10px', marginTop: body ? 0 : '16px' }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: danger ? '#FF3B30' : '#FFC50A', color: danger ? '#fff' : '#000', border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
