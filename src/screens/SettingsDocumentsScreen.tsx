import type { Screen } from '../App'
import { vendorDocuments, type VendorDocument } from '../data/mockData'
import { useToast } from '../components/Toast'

const STATUS_META: Record<VendorDocument['status'], { label: string; color: string; bg: string }> = {
  verified: { label: 'VERIFIED', color: '#22C55E', bg: '#DCFCE7' },
  pending:  { label: 'PENDING',  color: '#F59E0B', bg: '#FEF3C7' },
  rejected: { label: 'REJECTED', color: '#FF3B30', bg: '#FEE2E2' },
  missing:  { label: 'MISSING',  color: '#6B7280', bg: '#F3F4F6' },
}

export default function SettingsDocumentsScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { showToast } = useToast()

  const verified = vendorDocuments.filter(d => d.status === 'verified').length
  const total = vendorDocuments.length

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2.5px solid rgba(0,0,0,0.08)' }}>
        <button onClick={() => setScreen('settings')} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>←</button>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '26px' }}>Documents</div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Compliance score */}
        <div style={{ backgroundColor: verified === total ? '#DCFCE7' : '#FEF3C7', border: `2.5px solid ${verified === total ? '#22C55E' : '#F59E0B'}`, borderRadius: '14px', boxShadow: `4px 4px 0px ${verified === total ? '#22C55E' : '#F59E0B'}`, padding: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>{verified === total ? '✅' : '⚠️'}</div>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px' }}>{verified}/{total} Documents Verified</div>
            <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.6 }}>{verified === total ? 'All documents are up to date' : `${total - verified} document(s) need attention`}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ backgroundColor: '#ddd', borderRadius: '4px', height: '8px', border: '1.5px solid #000', marginBottom: '18px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(verified / total) * 100}%`, backgroundColor: '#22C55E', transition: 'width 0.4s' }} />
        </div>

        {/* Document cards */}
        {vendorDocuments.map(doc => {
          const meta = STATUS_META[doc.status]
          return (
            <div
              key={doc.id}
              style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FFF8E7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{doc.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>{doc.name}</div>
                <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>{doc.type}{doc.expiresAt ? ` · Expires ${doc.expiresAt}` : ''}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <div style={{ backgroundColor: meta.bg, color: meta.color, border: `2px solid ${meta.color}`, borderRadius: '6px', padding: '2px 8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em' }}>
                  {meta.label}
                </div>
                {doc.status !== 'verified' && (
                  <button
                    onClick={() => showToast(`Uploading ${doc.name}...`, 'info')}
                    style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', backgroundColor: '#000', color: '#FFC50A', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {/* Info footer */}
        <div style={{ backgroundColor: '#DBEAFE', border: '2px solid #3B82F6', borderRadius: '12px', padding: '12px 14px', marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>ℹ️</span>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.7, lineHeight: 1.5 }}>
            Documents are verified within 1–2 business days. Ensure files are clear, not expired, and under 5MB (PDF/JPG/PNG).
          </div>
        </div>
      </div>
    </div>
  )
}
