import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native'
import TouchableOpacity from '../../components/TouchableOpacity'
import type { SetScreen, NavParams } from '../../types'
import { mockReviews, type Review } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

export default function ReviewDetailScreen({ setScreen, navParams }: { setScreen: SetScreen; navParams: NavParams }) {
  const rev: Review = mockReviews.find((r: Review) => r.id === navParams.id) ?? mockReviews[0]
  const [helpful, setHelpful] = useState<number>(rev.helpful)
  const [voted, setVoted] = useState<boolean>(false)
  const [reply, setReply] = useState<string>('')

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('reviews')}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Review Detail</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body}>
        {/* Main review card */}
        <View style={s.reviewCard}>
          {/* Author */}
          <View style={s.authorRow}>
            <View style={s.avatar}><Text style={s.avatarText}>{rev.avatar}</Text></View>
            <View>
              <Text style={s.customerName}>{rev.customerName}</Text>
              <Text style={s.date}>{rev.date}</Text>
            </View>
          </View>

          {/* Stars + score */}
          <View style={s.starsRow}>
            {[1, 2, 3, 4, 5].map((i: number) => (
              <Text key={i} style={[s.star, { color: i <= rev.rating ? C.yellow : '#ddd' }]}>★</Text>
            ))}
            <Text style={s.ratingNum}>{rev.rating}.0</Text>
          </View>

          {/* Comment */}
          <View style={s.commentBox}>
            <Text style={s.commentText}>"{rev.comment}"</Text>
          </View>

          {/* Tags */}
          <View style={s.tagsRow}>
            <View style={s.dishTag}><Text style={s.dishTagText}>🍽️ {rev.dish}</Text></View>
            {rev.hasPhoto && (
              <View style={s.photoTag}><Text style={s.photoTagText}>📷 Has Photo</Text></View>
            )}
          </View>

          {/* Photo placeholder */}
          {rev.hasPhoto && (
            <View style={s.photoPlaceholder}>
              <Text style={{ fontSize: 32 }}>📷</Text>
            </View>
          )}

          {/* Helpful */}
          <View style={s.helpfulRow}>
            <Text style={s.helpfulLabel}>Was this review helpful?</Text>
            <TouchableOpacity
              onPress={() => { if (!voted) { setHelpful((h: number) => h + 1); setVoted(true) } }}
              style={[s.helpfulBtn, voted && s.helpfulBtnVoted]}
            >
              <Text style={[s.helpfulBtnText, voted && s.helpfulBtnTextVoted]}>👍 {helpful}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reply box */}
        <View style={s.replyCard}>
          <Text style={s.replyTitle}>Reply to Customer</Text>
          <TextInput
            value={reply}
            onChangeText={setReply}
            placeholder="Thank you for the feedback…"
            multiline
            numberOfLines={3}
            style={s.replyInput}
            textAlignVertical="top"
          />
          <TouchableOpacity style={s.replyBtn}>
            <Text style={s.replyBtnText}>SEND REPLY</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, paddingBottom: 14 },
  back: { fontSize: 22, color: C.black },
  title: { fontFamily: F.barlow, fontSize: 24, color: C.black },
  body: { paddingHorizontal: 20, paddingBottom: 24, gap: 12 },
  reviewCard: { backgroundColor: C.white, borderRadius: 16, ...shadow(5, 5), padding: 18 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.yellow, ...shadow(3, 3), alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: F.barlow, fontSize: 18, color: C.black },
  customerName: { fontFamily: F.interBold, fontSize: 15, color: C.black },
  date: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  star: { fontSize: 18 },
  ratingNum: { fontFamily: F.barlow, fontSize: 22, color: C.black, marginLeft: 6 },
  commentBox: { backgroundColor: C.cream, borderRadius: 10, padding: 14, marginBottom: 14 },
  commentText: { fontFamily: F.inter, fontSize: 14, color: C.black, opacity: 0.8, lineHeight: 22 },
  tagsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  dishTag: { backgroundColor: C.cream, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  dishTagText: { fontFamily: F.interBold, fontSize: 12, color: C.black },
  photoTag: { backgroundColor: '#DBEAFE', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  photoTagText: { fontFamily: F.interBold, fontSize: 12, color: C.blue },
  photoPlaceholder: { backgroundColor: '#e5e5e5', borderRadius: 12, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  helpfulRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 2, borderTopColor: 'rgba(0,0,0,0.08)' },
  helpfulLabel: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.45 },
  helpfulBtn: { backgroundColor: C.white,  borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, ...shadow(2, 2) },
  helpfulBtnVoted: { backgroundColor: C.green, borderColor: C.green, shadowOpacity: 0 },
  helpfulBtnText: { fontFamily: F.interBold, fontSize: 12, color: C.black },
  helpfulBtnTextVoted: { color: C.white },
  replyCard: { backgroundColor: C.white, borderRadius: 14, ...shadow(4, 4), padding: 14 },
  replyTitle: { fontFamily: F.barlow, fontSize: 16, color: C.black, marginBottom: 10 },
  replyInput: { fontFamily: F.inter, fontSize: 13, backgroundColor: C.cream,  borderRadius: 10, padding: 10, paddingHorizontal: 12, height: 90, marginBottom: 10 },
  replyBtn: { backgroundColor: C.yellow,  borderRadius: 10, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  replyBtnText: { fontFamily: F.barlow, fontSize: 15, color: C.black },
})
