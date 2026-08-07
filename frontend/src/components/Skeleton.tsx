interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, style }: SkeletonProps) {
  return (
    <div
      style={{ width, height, borderRadius, background: 'linear-gradient(90deg, #e8e0d0 25%, #f4ede0 50%, #e8e0d0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', ...style }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div style={{ backgroundColor: '#fff', border: '2.5px solid #ddd', borderRadius: '14px', padding: '14px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
        <Skeleton width={44} height={44} borderRadius={10} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={11} />
        </div>
      </div>
      <Skeleton width="100%" height={11} style={{ marginBottom: '5px' }} />
      <Skeleton width="80%" height={11} />
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={`skel_${i}`} />
      ))}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </>
  )
}
