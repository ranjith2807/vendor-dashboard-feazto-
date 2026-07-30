import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import type { SetScreen } from '../../types'
import { communityPosts, leaderboard, communityGroups, tagMeta } from '../../data/mockData'
import { C, F, shadow } from '../../theme'

const SUBTABS = [
  { id: 'st_feed',        label: 'Feed' },
  { id: 'st_trending',    label: 'Trending' },
  { id: 'st_groups',      label: 'Groups' },
  { id: 'st_leaderboard', label: 'Leaderboard' },
]

const TAB_HEADERS: Record<string, { title: string; sub: string; emoji: string }> = {
  st_feed:        { title: 'Community Feed',      sub: 'Latest posts from your fellow vendors',        emoji: '🍽️' },
  st_trending:    { title: 'Trending Now',         sub: 'Most liked posts this week',                  emoji: '🔥' },
  st_groups:      { title: 'Groups',               sub: 'Join communities that match your kitchen',    emoji: '👥' },
  st_leaderboard: { title: 'Chef Leaderboard',     sub: 'Top community contributors this week',        emoji: '🏆' },
}

export default function CommunityScreen({ setScreen: _setScreen }: { setScreen: SetScreen }) {
  const [activeTab, setActiveTab] = useState('st_feed')
  const [showCreate, setShowCreate] = useState(false)
  const [draftPost, setDraftPost] = useState('')
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(communityGroups.map(g => [g.id, g.joined]))
  )
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(
    Object.fromEntries(communityPosts.map(p => [p.id, p.liked]))
  )
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(
    Object.fromEntries(communityPosts.map(p => [p.id, p.likes]))
  )

  const feedPosts = activeTab === 'st_trending'
    ? [...communityPosts].sort((a, b) => b.likes - a.likes)
    : communityPosts

  const hdr = TAB_HEADERS[activeTab]

  const handleLike = (postId: string) => {
    const wasLiked = likedPosts[postId]
    setLikedPosts(p => ({ ...p, [postId]: !wasLiked }))
    setLikeCounts(p => ({ ...p, [postId]: wasLiked ? p[postId] - 1 : p[postId] + 1 }))
  }

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Community</Text>
        <TouchableOpacity style={s.postBtn} onPress={() => setShowCreate(true)}>
          <Text style={s.postBtnText}>✍ Post</Text>
        </TouchableOpacity>
      </View>

      {/* Sub-tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll} contentContainerStyle={s.tabsContent}>
        {SUBTABS.map(tab => {
          const active = activeTab === tab.id
          return (
            <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)} style={[s.tab, active && s.tabActive]}>
              <Text style={[s.tabText, active && s.tabTextActive]}>{tab.label.toUpperCase()}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Content */}
      <ScrollView style={s.scroll} contentContainerStyle={s.list}>

        {/* Section header — same for all tabs */}
        <View style={s.sectionHeader}>
          <View style={s.sectionHeaderLeft}>
            <Text style={s.sectionHeaderEmoji}>{hdr.emoji}</Text>
            <View>
              <Text style={s.sectionHeaderTitle}>{hdr.title}</Text>
              <Text style={s.sectionHeaderSub}>{hdr.sub}</Text>
            </View>
          </View>
        </View>

        {/* FEED & TRENDING */}
        {(activeTab === 'st_feed' || activeTab === 'st_trending') && (
          feedPosts.length === 0 ? (
            <View style={s.empty}>
              <Text style={{ fontSize: 40 }}>📭</Text>
              <Text style={s.emptyText}>No posts yet</Text>
            </View>
          ) : (
            feedPosts.map(post => {
              const tag = tagMeta[post.tag] ?? { label: post.tag, bg: '#e5e5e5', text: C.black }
              const liked = likedPosts[post.id] ?? false
              return (
                <View key={post.id} style={s.card}>
                  <View style={s.authorRow}>
                    <View style={s.avatar}><Text style={s.avatarText}>{post.authorAvatar}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.authorName}>{post.authorName}</Text>
                      <Text style={s.authorMeta}>{post.authorRole} · {post.timeAgo}</Text>
                    </View>
                    <View style={[s.tagBadge, { backgroundColor: tag.bg }]}>
                      <Text style={[s.tagText, { color: tag.text }]}>{tag.label.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={s.content}>{post.content}</Text>
                  <View style={s.actions}>
                    <TouchableOpacity style={s.actionBtn} onPress={() => handleLike(post.id)}>
                      <Text style={s.actionEmoji}>{liked ? '❤️' : '🤍'}</Text>
                      <Text style={[s.actionCount, liked && { color: C.red }]}>{likeCounts[post.id]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.actionBtn}>
                      <Text style={s.actionEmoji}>💬</Text>
                      <Text style={s.actionCount}>{post.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.actionBtn}>
                      <Text style={s.actionEmoji}>📤</Text>
                      <Text style={s.actionCount}>{post.shares}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })
          )
        )}

        {/* GROUPS */}
        {activeTab === 'st_groups' && communityGroups.map(grp => (
          <View key={grp.id} style={s.grpCard}>
            <View style={s.grpIcon}>
              <Text style={{ fontSize: 20 }}>
                {grp.name.includes('Chef') ? '👨‍🍳' : grp.name.includes('Photo') ? '📸' : grp.name.includes('Business') ? '📈' : grp.name.includes('Recipe') ? '📝' : '🏪'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.grpName}>{grp.name}</Text>
              <Text style={s.grpMembers}>{grp.members.toLocaleString()} members</Text>
            </View>
            <TouchableOpacity
              onPress={() => setJoinedGroups(p => ({ ...p, [grp.id]: !p[grp.id] }))}
              style={[s.joinBtn, joinedGroups[grp.id] && s.joinBtnActive]}
            >
              <Text style={[s.joinBtnText, joinedGroups[grp.id] && s.joinBtnTextActive]}>
                {joinedGroups[grp.id] ? 'Joined ✓' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* LEADERBOARD */}
        {activeTab === 'st_leaderboard' && leaderboard.map(chef => (
          <View key={chef.id} style={s.lbCard}>
            <View style={[s.lbRank, {
              backgroundColor: chef.rank === 1 ? C.yellow : chef.rank === 2 ? '#E0E0E0' : chef.rank === 3 ? '#F4A460' : C.cream
            }]}>
              <Text style={s.lbRankText}>{chef.rank}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.lbName}>{chef.name}</Text>
              <Text style={s.lbStreak}>🔥 {chef.streak} day streak</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.lbPoints}>{chef.points.toLocaleString()}</Text>
              <Text style={s.lbPtsLabel}>pts</Text>
            </View>
            <Text style={s.lbBadge}>{chef.badge}</Text>
          </View>
        ))}

      </ScrollView>

      {/* Create post modal */}
      <Modal visible={showCreate} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={() => setShowCreate(false)}>
                <Text style={{ fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={draftPost}
              onChangeText={setDraftPost}
              placeholder="Share a tip, recipe, or story…"
              multiline
              numberOfLines={4}
              style={s.postInput}
              textAlignVertical="top"
            />
            <View style={s.tagRow}>
              {Object.entries(tagMeta).map(([key, val]) => (
                <View key={key} style={[s.tagChip, { backgroundColor: val.bg }]}>
                  <Text style={[s.tagChipText, { color: val.text }]}>{val.label}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowCreate(false)}>
                <Text style={s.cancelBtnText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.publishBtn} onPress={() => { setShowCreate(false); setDraftPost('') }}>
                <Text style={s.publishBtnText}>PUBLISH POST</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, width: '100%', backgroundColor: C.cream },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 0 },
  title: { fontFamily: F.barlow, fontSize: 28, color: C.black },
  postBtn: { backgroundColor: C.yellow, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, ...shadow(3, 3) },
  postBtnText: { fontFamily: F.barlow, fontSize: 14, color: C.black },

  // Tabs
  tabsScroll: { flexGrow: 0 },
  tabsContent: { paddingHorizontal: 20, gap: 6, paddingVertical: 10, alignItems: 'center' },
  tab: { backgroundColor: C.white, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 2, borderRightWidth: 2, borderBottomColor: '#000', borderRightColor: '#000', flexShrink: 0, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  tabActive: { backgroundColor: C.black, borderColor: C.black },
  tabText: { fontFamily: F.barlow, fontSize: 13, color: C.black, includeFontPadding: false, textAlign: 'center' },
  tabTextActive: { color: C.yellow },

  // Section header (same yellow banner for all tabs)
  sectionHeader: { backgroundColor: C.yellow, borderRadius: 14, ...shadow(4, 4), padding: 14, marginBottom: 12 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionHeaderEmoji: { fontSize: 28 },
  sectionHeaderTitle: { fontFamily: F.barlow, fontSize: 20, color: C.black },
  sectionHeaderSub: { fontFamily: F.inter, fontSize: 12, color: C.black, opacity: 0.65 },

  // Scroll + list
  scroll: { flex: 1 },
  list: { paddingHorizontal: 20, paddingBottom: 28, gap: 10 },

  // Post cards
  card: { backgroundColor: C.white, borderRadius: 14, ...shadow(4, 4), padding: 14 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: F.barlow, fontSize: 14, color: C.black },
  authorName: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  authorMeta: { fontFamily: F.inter, fontSize: 10, color: C.black, opacity: 0.45 },
  tagBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, borderBottomWidth: 1.5, borderRightWidth: 1.5, borderBottomColor: '#000', borderRightColor: '#000' },
  tagText: { fontFamily: F.barlow, fontSize: 10, letterSpacing: 1 },
  content: { fontFamily: F.inter, fontSize: 13, color: C.black, lineHeight: 20, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 6, paddingTop: 10, borderTopWidth: 1.5, borderTopColor: 'rgba(0,0,0,0.08)' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4 },
  actionEmoji: { fontSize: 14 },
  actionCount: { fontFamily: F.interBold, fontSize: 12, color: '#888' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 32, gap: 8 },
  emptyText: { fontFamily: F.barlow, fontSize: 20, color: C.black, opacity: 0.4 },

  // Groups
  grpCard: { backgroundColor: C.white, borderRadius: 12, ...shadow(3, 3), padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  grpIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  grpName: { fontFamily: F.interBold, fontSize: 13, color: C.black },
  grpMembers: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.45 },
  joinBtn: { backgroundColor: C.yellow, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, flexShrink: 0, borderBottomWidth: 2, borderRightWidth: 2, borderBottomColor: '#000', borderRightColor: '#000' },
  joinBtnActive: { backgroundColor: C.black },
  joinBtnText: { fontFamily: F.barlow, fontSize: 13, color: C.black },
  joinBtnTextActive: { color: C.cream },

  // Leaderboard
  lbCard: { backgroundColor: C.white, borderRadius: 12, ...shadow(3, 3), padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  lbRank: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  lbRankText: { fontFamily: F.barlow, fontSize: 16, color: C.black },
  lbName: { fontFamily: F.interBold, fontSize: 14, color: C.black },
  lbStreak: { fontFamily: F.inter, fontSize: 11, color: C.black, opacity: 0.5 },
  lbPoints: { fontFamily: F.barlow, fontSize: 20, color: C.black },
  lbPtsLabel: { fontFamily: F.inter, fontSize: 10, color: C.black, opacity: 0.4 },
  lbBadge: { fontSize: 24 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: C.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32, borderTopWidth: 2, borderTopColor: '#000' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontFamily: F.barlow, fontSize: 22, color: C.black },
  postInput: { fontFamily: F.inter, fontSize: 14, backgroundColor: C.cream, borderRadius: 12, padding: 12, height: 100, ...shadow(3, 3) },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tagChip: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, borderBottomWidth: 1.5, borderRightWidth: 1.5, borderBottomColor: '#000', borderRightColor: '#000' },
  tagChipText: { fontFamily: F.barlow, fontSize: 11 },
  cancelBtn: { flex: 1, backgroundColor: C.white, borderWidth: 2, borderColor: C.black, borderRadius: 11, padding: 12, alignItems: 'center', ...shadow(3, 3) },
  cancelBtnText: { fontFamily: F.barlow, fontSize: 17, color: C.black },
  publishBtn: { flex: 2, backgroundColor: C.yellow, borderRadius: 11, padding: 12, alignItems: 'center', ...shadow(4, 4) },
  publishBtnText: { fontFamily: F.barlow, fontSize: 17, color: C.black },
})
