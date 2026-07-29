import { useState } from 'react'
import type { Screen } from '../App'
import { analyticsStats, revenueData, peakHoursData, topDishes } from '../data/mockData'

const PERIOD_TABS = [
  { id: 'per_week', label: '7D' },
  { id: 'per_month', label: '30D' },
  { id: 'per_quarter', label: '90D' },
]

function BarChart({ data, maxValue, color = '#FFC50A', height = 80 }: {
  data: Array<{ id: string; label: string; value: number }>
  maxValue: number
  color?: string
  height?: number
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: `${height + 20}px`, paddingBottom: '20px', position: 'relative' }}>
      {data.map(d => {
        const pct = d.value / maxValue
        const barH = Math.max(pct * height, 4)
        return (
          <div key={d.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', height: `${height + 20}px`, justifyContent: 'flex-end' }}>
            <div
              style={{
                width: '100%',
                height: `${barH}px`,
                backgroundColor: color,
                border: 'none',
                borderRadius: '5px 5px 0 0',
                boxShadow: '2px 0px 0px #000',
                transition: 'height 0.3s',
              }}
            />
            <div style={{ fontFamily: 'Inter', fontSize: '9px', opacity: 0.45, textAlign: 'center', marginTop: '3px' }}>{d.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function AnalyticsScreen({ setScreen: _setScreen }: { setScreen: (s: Screen) => void }) {
  const [activePeriod, setActivePeriod] = useState('per_week')
  const maxRevenue = Math.max(...revenueData.map(d => d.value))
  const maxPeak = Math.max(...peakHoursData.map(d => d.value))

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px' }}>Analytics</div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {PERIOD_TABS.map(t => {
            const isA = activePeriod === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActivePeriod(t.id)}
                style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', backgroundColor: isA ? '#000' : '#fff', color: isA ? '#FFC50A' : '#000', border: 'none', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', boxShadow: isA ? 'none' : '2px 2px 0px #000' }}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {analyticsStats.map(stat => (
          <div key={stat.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '4px 4px 0px #000', padding: '12px' }}>
            <div style={{ fontSize: '20px', marginBottom: '2px' }}>{stat.icon}</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>{stat.label}</div>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '10px', color: stat.positive ? '#22C55E' : '#FF3B30', marginTop: '2px' }}>{stat.delta}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div style={{ margin: '0 20px 14px', backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px' }}>Revenue</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.4 }}>Last 7 days</div>
          </div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', color: '#22C55E' }}>₹ 44,820</div>
        </div>
        <BarChart data={revenueData} maxValue={maxRevenue} color="#FFC50A" height={90} />
      </div>

      {/* Peak hours */}
      <div style={{ margin: '0 20px 14px', backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>Peak Hours</div>
        <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.4, marginBottom: '0' }}>Order volume by hour</div>
        <BarChart data={peakHoursData} maxValue={maxPeak} color="#000" height={70} />
      </div>

      {/* Top dishes */}
      <div style={{ margin: '0 20px 20px', backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>Best Selling Dishes</div>
        {topDishes.map((dish, i) => (
          <div key={dish.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: i < topDishes.length - 1 ? '2px dashed rgba(0,0,0,0.1)' : 'none', marginBottom: i < topDishes.length - 1 ? '10px' : 0 }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: i === 0 ? '#FFC50A' : '#FFF8E7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>{dish.name}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>{dish.orders} orders</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px' }}>₹ {dish.revenue.toLocaleString()}</div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', color: dish.positive ? '#22C55E' : '#FF3B30' }}>{dish.growth}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
