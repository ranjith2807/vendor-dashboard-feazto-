import { useState, useEffect, useCallback } from 'react'
import { getAllVendors, updateVendorStatus, type VendorDoc } from '../lib/adminDb'

// ── Simple PIN gate — change this to a strong secret in production ────────────
const ADMIN_PIN = '1234'

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:  { bg: '#FFC50A', color: '#000', label: 'PENDING' },
  approved: { bg: '#22C55E', color: '#fff', label: 'APPROVED' },
  rejected: { bg: '#FF3B30', color: '#fff', label: 'REJECTED' },
}

function fmtDate(ts: { seconds: number } | null) {
  if (!ts) return '—'
  return new Date(ts.seconds * 1000).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DocChip({ label, url }: { label: string; url?: string }) {
  if (!url) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: '#9CA3AF', background: '#F3F4F6', border: '1.5px solid #E5E7EB', borderRadius: 6, padding: '2px 8px' }}>
        {label} ✗
      </span>
    )
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: '#000', background: '#FFF8E7', border: '1.5px solid #000', borderRadius: 6, padding: '2px 8px', textDecoration: 'none', boxShadow: '1px 1px 0 #000' }}
    >
      {label} ↗
    </a>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending
  return (
    <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', background: s.bg, color: s.color, borderRadius: 6, padding: '2px 10px', border: '1.5px solid #000', boxShadow: '1px 1px 0 #000', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

// ── Vendor detail modal ───────────────────────────────────────────────────────

function VendorModal({
  vendor,
  onClose,
  onApprove,
  onReject,
  busy,
}: {
  vendor: VendorDoc
  onClose: () => void
  onApprove: (v: VendorDoc) => void
  onReject: (v: VendorDoc) => void
  busy: boolean
}) {
  const docs = vendor.documents ?? {}
  const bank = vendor.bank ?? {}

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 18, border: '2.5px solid #000', boxShadow: '8px 8px 0 #000', width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', padding: 24 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 26, lineHeight: 1 }}>{vendor.company_name}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, opacity: 0.5, marginTop: 2 }}>{vendor.vendor_name} · {vendor.email}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusBadge status={vendor.status} />
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', opacity: 0.4, lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            ['📞 Phone', vendor.phone_number],
            ['📍 City', `${vendor.city}, ${vendor.state}`],
            ['🏠 Address', vendor.address],
            ['📮 Postal', vendor.postal_code],
            ['🌏 Country', vendor.country],
            ['📅 Applied', fmtDate(vendor.created_at)],
          ].map(([label, value]) => (
            <div key={label} style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(0,0,0,0.07)' }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', opacity: 0.45, marginBottom: 3 }}>{label}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 13 }}>{value || '—'}</div>
            </div>
          ))}
        </div>

        {/* Documents */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Documents</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <DocChip label="FSSAI" url={docs.fssai} />
            <DocChip label="GST" url={docs.gst} />
            <DocChip label="PAN" url={docs.pan} />
            <DocChip label="Aadhaar" url={docs.aadhaar} />
          </div>
          {/* Show doc images inline if they are data URIs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
            {[
              { key: 'FSSAI', url: docs.fssai },
              { key: 'GST', url: docs.gst },
              { key: 'PAN', url: docs.pan },
              { key: 'Aadhaar', url: docs.aadhaar },
            ]
              .filter(d => !!d.url)
              .map(d => (
                <div key={d.key} style={{ position: 'relative' }}>
                  <img
                    src={d.url}
                    alt={d.key}
                    style={{ width: 110, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid #000', boxShadow: '2px 2px 0 #000' }}
                  />
                  <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#000', color: '#FFC50A', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', borderRadius: 4, padding: '1px 6px' }}>
                    {d.key}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Bank details */}
        {bank.bank_name && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Bank Account</div>
            <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(0,0,0,0.07)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                ['Bank', bank.bank_name],
                ['IFSC', bank.ifsc],
                ['Account No.', bank.account_number],
                ['Holder', bank.account_holder],
              ].map(([lbl, val]) => (
                <div key={lbl}>
                  <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', opacity: 0.45, marginBottom: 2 }}>{lbl}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 13 }}>{val || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {vendor.status === 'pending' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => onApprove(vendor)}
              disabled={busy}
              style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '0.05em', background: busy ? '#ddd' : '#22C55E', color: '#fff', border: '2px solid #000', borderRadius: 10, padding: '11px 0', cursor: busy ? 'not-allowed' : 'pointer', boxShadow: busy ? 'none' : '3px 3px 0 #000' }}
            >
              ✓ APPROVE
            </button>
            <button
              onClick={() => onReject(vendor)}
              disabled={busy}
              style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '0.05em', background: busy ? '#ddd' : '#FF3B30', color: '#fff', border: '2px solid #000', borderRadius: 10, padding: '11px 0', cursor: busy ? 'not-allowed' : 'pointer', boxShadow: busy ? 'none' : '3px 3px 0 #000' }}
            >
              ✕ REJECT
            </button>
          </div>
        )}
        {vendor.status !== 'pending' && (
          <div style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 13, opacity: 0.4, paddingTop: 4 }}>
            This application has already been {vendor.status}.
          </div>
        )}
      </div>
    </div>
  )
}

// ── Vendor row ────────────────────────────────────────────────────────────────

function VendorRow({ vendor, onClick }: { vendor: VendorDoc; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ width: '100%', textAlign: 'left', background: '#fff', border: '2px solid #000', borderRadius: 12, padding: '12px 16px', marginBottom: 8, cursor: 'pointer', boxShadow: '3px 3px 0 #000', display: 'flex', alignItems: 'center', gap: 14, transition: 'transform 0.1s' }}
      onMouseOver={e => (e.currentTarget.style.transform = 'translate(-1px,-1px)')}
      onMouseOut={e => (e.currentTarget.style.transform = 'none')}
    >
      {/* Avatar */}
      <div style={{ width: 42, height: 42, borderRadius: 10, background: '#FFF8E7', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 18 }}>
        {vendor.company_name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 17, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {vendor.company_name}
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 12, opacity: 0.5, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {vendor.vendor_name} · {vendor.city}, {vendor.state}
        </div>
      </div>

      {/* Date + status */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <StatusBadge status={vendor.status} />
        <div style={{ fontFamily: 'Inter', fontSize: 10, opacity: 0.4 }}>{fmtDate(vendor.created_at)}</div>
      </div>
    </button>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

type Filter = 'all' | 'pending' | 'approved' | 'rejected'

export default function AdminPanelScreen() {
  // ── PIN gate ───────────────────────────────────────────────────────────────
  const [pinInput, setPinInput] = useState('')
  const [authed, setAuthed] = useState(false)
  const [pinError, setPinError] = useState(false)

  const handlePin = () => {
    if (pinInput === ADMIN_PIN) {
      setAuthed(true)
    } else {
      setPinError(true)
      setPinInput('')
      setTimeout(() => setPinError(false), 1500)
    }
  }

  // ── Data ───────────────────────────────────────────────────────────────────
  const [vendors, setVendors] = useState<VendorDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>('pending')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<VendorDoc | null>(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')

  const loadVendors = useCallback(async () => {
    setLoading(true)
    setError('')
    const data = await getAllVendors()
    if (!data) {
      setError('Failed to load vendors. Check Firestore rules.')
    } else {
      setVendors(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authed) loadVendors()
  }, [authed, loadVendors])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleApprove = async (vendor: VendorDoc) => {
    setBusy(true)
    const result = await updateVendorStatus(vendor.email, 'approved')
    if (result.success) {
      setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, status: 'approved' } : v))
      setSelected(prev => prev?.id === vendor.id ? { ...prev, status: 'approved' } : prev)
      showToast(`✓ ${vendor.company_name} approved`)
    } else {
      showToast(`Error: ${result.message}`)
    }
    setBusy(false)
  }

  const handleReject = async (vendor: VendorDoc) => {
    setBusy(true)
    const result = await updateVendorStatus(vendor.email, 'rejected')
    if (result.success) {
      setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, status: 'rejected' } : v))
      setSelected(prev => prev?.id === vendor.id ? { ...prev, status: 'rejected' } : prev)
      showToast(`✕ ${vendor.company_name} rejected`)
    } else {
      showToast(`Error: ${result.message}`)
    }
    setBusy(false)
  }

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = vendors.filter(v => {
    if (filter !== 'all' && v.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        v.company_name.toLowerCase().includes(q) ||
        v.vendor_name.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q)
      )
    }
    return true
  })

  const counts = {
    all: vendors.length,
    pending: vendors.filter(v => v.status === 'pending').length,
    approved: vendors.filter(v => v.status === 'approved').length,
    rejected: vendors.filter(v => v.status === 'rejected').length,
  }

  // ── PIN screen ─────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8E7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '2.5px solid #000', borderRadius: 18, boxShadow: '6px 6px 0 #000', padding: 32, width: '100%', maxWidth: 340, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 28, marginBottom: 4 }}>Admin Panel</div>
          <div style={{ fontFamily: 'Inter', fontSize: 12, opacity: 0.45, marginBottom: 24 }}>FEAZTO · Vendor Applications</div>

          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', opacity: 0.5, marginBottom: 6, textAlign: 'left' }}>ADMIN PIN</div>
          <input
            type="password"
            inputMode="numeric"
            placeholder="Enter PIN"
            value={pinInput}
            onChange={e => { setPinInput(e.target.value); setPinError(false) }}
            onKeyDown={e => e.key === 'Enter' && handlePin()}
            style={{ width: '100%', fontFamily: 'Inter', fontSize: 18, textAlign: 'center', letterSpacing: '0.3em', background: pinError ? '#FEF3F2' : '#F9FAFB', border: `2px solid ${pinError ? '#FF3B30' : '#000'}`, borderRadius: 10, padding: '12px 14px', marginBottom: 6, outline: 'none', boxSizing: 'border-box' }}
          />
          {pinError && <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#FF3B30', marginBottom: 10 }}>Incorrect PIN</div>}
          <button
            onClick={handlePin}
            disabled={!pinInput}
            style={{ width: '100%', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: '0.05em', background: pinInput ? '#FFC50A' : '#ddd', color: '#000', border: '2px solid #000', borderRadius: 10, padding: '13px 0', cursor: pinInput ? 'pointer' : 'not-allowed', boxShadow: pinInput ? '4px 4px 0 #000' : 'none', marginTop: 4 }}
          >
            Enter →
          </button>
        </div>
      </div>
    )
  }

  // ── Admin panel ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', fontFamily: 'Inter, sans-serif' }}>

      {/* Top bar */}
      <div style={{ background: '#000', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 24, color: '#FFC50A', letterSpacing: '0.04em' }}>FEAZTO</span>
          <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#fff', opacity: 0.5, marginLeft: 10 }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {counts.pending > 0 && (
            <div style={{ background: '#FFC50A', color: '#000', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 13, borderRadius: 20, padding: '2px 10px', border: '2px solid #fff' }}>
              {counts.pending} PENDING
            </div>
          )}
          <button
            onClick={loadVendors}
            style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 8, padding: '6px 14px', fontFamily: 'Inter', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {(['all', 'pending', 'approved', 'rejected'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ background: filter === f ? '#000' : '#fff', color: filter === f ? '#FFC50A' : '#000', border: '2px solid #000', borderRadius: 10, padding: '10px 0', cursor: 'pointer', boxShadow: filter === f ? '3px 3px 0 #000' : '2px 2px 0 #000', transition: 'all 0.1s' }}
            >
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 22 }}>{counts[f]}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>{f}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          placeholder="Search by name, email, city…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', fontFamily: 'Inter', fontSize: 14, background: '#fff', border: '2px solid #000', borderRadius: 10, padding: '11px 16px', marginBottom: 16, outline: 'none', boxSizing: 'border-box', boxShadow: '3px 3px 0 #000' }}
        />

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, fontFamily: 'Inter', opacity: 0.4 }}>Loading vendors…</div>
        ) : error ? (
          <div style={{ background: '#FEF3F2', border: '2px solid #FF3B30', borderRadius: 10, padding: 16, fontFamily: 'Inter', fontSize: 13, color: '#FF3B30' }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, fontFamily: 'Inter', opacity: 0.35 }}>
            {search ? `No results for "${search}"` : `No ${filter === 'all' ? '' : filter} vendors`}
          </div>
        ) : (
          filtered.map(v => (
            <VendorRow key={v.id} vendor={v} onClick={() => setSelected(v)} />
          ))
        )}
      </div>

      {/* Vendor detail modal */}
      {selected && (
        <VendorModal
          vendor={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          busy={busy}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#000', color: '#FFC50A', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '0.05em', padding: '10px 22px', borderRadius: 12, border: '2px solid #FFC50A', boxShadow: '4px 4px 0 #000', zIndex: 2000, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
