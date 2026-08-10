import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { mockReviews, type Review } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i: number) => (
        <Text key={i} style={{ fontSize: size, color: i <= rating ? C.yellow : '#ddd' }}>★</Text>
      ))}
    </View>
  )
}

export default function ReviewsScreen({ setScreen, navParams: _navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const [filter, setFilter] = useState<number>(0)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)

  // Compute stats dynamically from real reviews
  const total = reviews.length
  const avg = total > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
    : '0.0'
  const dist = [5, 4, 3, 2, 1].map(stars => ({
    id: `dist_${stars}`,
    stars,
    count: reviews.filter(r => r.rating === stars).length,
  }))

  const filtered = filter === 0 ? reviews : reviews.filter((r: Review) => r.rating === filter)
  const bookmark = (id: string) => setReviews((p: Review[]) => p.map((r: Review) => r.id === id ? { ...r, bookmarked: !r.bookmarked } : r))

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('dashboard')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Reviews & Ratings</Text>
      </View>

      {/* Empty state — no reviews at all */}
      {total === 0 ? (
        <View style={s.emptyWrap}>
          <View style={s.emptyIconWrap}>
            <Text style={s.emptyIcon}>⭐</Text>
          </View>
          <Text style={s.emptyTitle}>No reviews yet</Text>
          <Text style={s.emptySub}>
            Customer reviews will appear here{'\n'}once they rate your orders.
          </Text>
        </View>
      ) : (
        <>
          {/* Summary card — computed from real data */}
          <View style={s.summaryCard}>
            <View style={s.ratingBig}>
              <Text style={s.avgText}>{avg}</Text>
              <Stars rating={Math.round(parseFloat(avg))} size={16} />
              <Text style={s.totalText}>{total} review{total !== 1 ? 's' : ''}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {dist.map(d => (
                <View key={d.id} style={s.distRow}>
                  <Text style={s.distStar}>{d.stars}</Text>
                  <Text style={s.distStarIcon}>★</Text>
                  <View style={s.distBar}>
                    <View style={[s.distFill, { width: total ? `${(d.count / total) * 100}%` as any : '0%' }]} />
                  </View>
                  <Text style={s.distCount}>{d.count}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtersScroll} contentContainerStyle={s.filtersContent}>
            {[{ id: 'rf_all', label: 'All', val: 0 }, ...[5, 4, 3, 2, 1].map(n => ({ id: `rf_${n}`, label: `${n} ★`, val: n }))].map(f => {
              const active = filter === f.val
              return (
                <TouchableOpacity key={f.id} onPress={() => setFilter(f.val)} style={[s.chip, active && s.chipActive]}>
                  <Text style={[s.chipText, active && s.chipTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          <ScrollView style={s.scroll} contentContainerStyle={s.list}>
            {filtered.length === 0 ? (
              <View style={s.empty}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>⭐</Text>
                <Text style={s.emptyTitle}>No {filter}★ Reviews Yet</Text>
              </View>
            ) : filtered.map((rev: Review) => (
              <TouchableOpacity key={rev.id} style={s.card} onPress={() => setScreen('review_detail', { id: rev.id })}>
                <View style={s.cardTop}>
                  <View style={s.avatar}><Text style={s.avatarText}>{rev.avatar}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.customerName}>{rev.customerName}</Text>
                    <Text style={s.meta}>{rev.date} · {rev.dish}</Text>
                  </View>
                  <TouchableOpacity onPress={() => bookmark(rev.id)} style={{ opacity: rev.bookmarked ? 1 : 0.3 }}>
                    <Text style={{ fontSize: 18 }}>🔖</Text>
                  </TouchableOpacity>
                </View>
                <Stars rating={rev.rating} />
                <Text style={s.comment} numberOfLines={2}>{rev.comment}</Text>
                {rev.hasPhoto && <Text style={s.photoTag}>📷 Photo attached</Text>}
                <Text style={s.helpful}>👍 {rev.helpful} found helpful</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 26, color: C.black },
  summaryCard: { marginHorizontal: 20, backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(5, 5), padding: 16, marginBottom: 14, flexDirection: 'row', gap: 16, alignItems: 'center' },
  ratingBig: { alignItems: 'center', flexShrink: 0 },
  avgText: { fontFamily: F.barlow, fontSize: 52, color: C.black, lineHeight: 56 },
  totalText: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45, marginTop: 3 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  distStar: { fontFamily: F.interBold, fontSize: 11, color: C.black, width: 14, textAlign: 'right' },
  distStarIcon: { fontSize: 10, color: C.yellow },
  distBar: { flex: 1, height: 6, backgroundColor: '#e5e5e5', borderRadius: 3, overflow: 'hidden' },
  distFill: { height: '100%', backgroundColor: C.yellow, borderRadius: 3 },
  distCount: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45, width: 14 },
  filtersScroll: { flexGrow: 0 },
  filtersContent: { paddingHorizontal: 20, gap: 7, paddingBottom: 12, alignItems: 'center' },
  chip: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#000000', flexShrink: 0, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  chipActive: { backgroundColor: '#f9be08', borderWidth: 2, borderColor: '#000000', shadowColor: '#000000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  chipText: { fontFamily: F.barlow, fontSize: 13, color: C.black, includeFontPadding: false, textAlign: 'center' },
  chipTextActive: { color: '#000000' },
  scroll: { flex: 1 },
  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 10 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60, gap: 12 },
  emptyIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.yellow, ...shadow(4, 4), alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyIcon: { fontSize: 36 },
  emptySub: { fontFamily: F.inter, fontSize: 14, color: C.black, opacity: 0.4, textAlign: 'center', lineHeight: 21 },
  card: { backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...shadow(3, 3), padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: F.barlow, fontSize: 14, color: C.black },
  customerName: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  meta: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  comment: { fontFamily: F.inter, fontSize: 13, color: C.black, opacity: 0.7, lineHeight: 20, marginTop: 6 },
  photoTag: { fontFamily: F.interBold, fontSize: 11, color: C.blue, marginTop: 8 },
  helpful: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.35, marginTop: 8 },
})
