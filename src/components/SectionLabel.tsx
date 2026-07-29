export default function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <h2
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          fontSize: '26px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#000',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </h2>
      <div style={{ flex: 1, height: '3px', backgroundColor: '#000', opacity: 0.12 }} />
    </div>
  )
}
