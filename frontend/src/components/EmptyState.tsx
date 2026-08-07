interface EmptyStateProps {
  icon?: string
  title: string
  body?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon = '📭', title, body, action }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '52px', marginBottom: '14px', filter: 'grayscale(0.3)' }}>{icon}</div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '6px' }}>{title}</div>
      {body && <div style={{ fontFamily: 'Inter', fontSize: '13px', opacity: 0.45, maxWidth: '240px', lineHeight: 1.5, marginBottom: '18px' }}>{body}</div>}
      {action && (
        <button
          onClick={action.onClick}
          style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#FFC50A', color: '#000', border: 'none', borderRadius: '10px', padding: '11px 22px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
