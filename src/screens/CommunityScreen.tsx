import { useState } from 'react'
import type { Screen } from '../App'
import {
  communityPosts, tagMeta, leaderboard, communityGroups,
  type CommunityPost,
} from '../data/mockData'

function TagBadge({ tag }: { tag: string }) {
  const meta = tagMeta[tag] ?? { label: tag, bg: '#e5e5e5', text: '#000' }
  return (
    <div style={{ backgroundColor: meta.bg, color: meta.text, border: 'none', borderRadius: '6px', padding: '2px 8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', display: 'inline-block' }}>
      {meta.label}
    </div>
  )
}

function PostCard({ post, onTap }: { post: CommunityPost; onTap: () => void }) {
  const [liked, setLiked] = useState(post.liked)
  const [bookmarked, setBookmarked] = useState(post.bookmarked)
  const [following, setFollowing] = useState(post.following)
  const [likes, setLikes] = useState(post.likes)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(l => !l)
    setLikes(l => liked ? l - 1 : l + 1)
  }
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setBookmarked(b => !b)
  }

  return (
    <div
      onClick={onTap}
      style={{ backgroundColor: '#fff', border: 'none', borderRadius: '14px', boxShadow: '4px 4px 0px #000', padding: '14px', marginBottom: '10px', cursor: 'pointer' }}
    >
      {/* Author row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FFC50A', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
          {post.authorAvatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>{post.authorName}</div>
          <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.45 }}>{post.authorRole} · {post.timeAgo}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TagBadge tag={post.tag} />
          <button
            onClick={e => { e.stopPropagation(); setFollowing(f => !f) }}
            style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '10px', backgroundColor: following ? '#000' : '#fff', color: following ? '#FFF8E7' : '#000', border: 'none', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer' }}
          >
            {following ? '✓ Following' : '+ Follow'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ fontFamily: 'Inter', fontSize: '13px', lineHeight: 1.6, color: '#000', marginBottom: '12px' }}>
        {post.content}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '10px', borderTop: '2px dashed rgba(0,0,0,0.1)' }}>
        <button onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '7px', backgroundColor: liked ? '#FFF8E7' : 'transparent' }}>
          <span style={{ fontSize: '14px' }}>{liked ? '❤️' : '🤍'}</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: liked ? '#FF3B30' : '#888' }}>{likes}</span>
        </button>
        <button onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
          <span style={{ fontSize: '14px' }}>💬</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: '#888' }}>{post.comments}</span>
        </button>
        <button onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
          <span style={{ fontSize: '14px' }}>📤</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', color: '#888' }}>{post.shares}</span>
        </button>
        <button onClick={handleBookmark} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '16px' }}>
          {bookmarked ? '🔖' : '🏷️'}
        </button>
      </div>
    </div>
  )
}

function LeaderboardTab() {
  return (
    <div>
      <div style={{ backgroundColor: '#FFC50A', border: 'none', borderRadius: '14px', boxShadow: '5px 5px 0px #000', padding: '14px', marginBottom: '12px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '2px' }}>Chef Leaderboard</div>
        <div style={{ fontFamily: 'Inter', fontSize: '12px', opacity: 0.65 }}>Top community contributors this week</div>
      </div>
      {leaderboard.map(chef => (
        <div key={chef.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: chef.rank === 1 ? '#FFC50A' : chef.rank === 2 ? '#E0E0E0' : chef.rank === 3 ? '#F4A460' : '#FFF8E7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px' }}>
            {chef.rank}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14px' }}>{chef.name}</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.5 }}>🔥 {chef.streak} day streak</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px' }}>{chef.points.toLocaleString()}</div>
            <div style={{ fontFamily: 'Inter', fontSize: '10px', opacity: 0.4 }}>pts</div>
          </div>
          <div style={{ fontSize: '22px' }}>{chef.badge}</div>
        </div>
      ))}
    </div>
  )
}

function GroupsTab() {
  const [joined, setJoined] = useState<Record<string, boolean>>(
    Object.fromEntries(communityGroups.map(g => [g.id, g.joined]))
  )
  return (
    <div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px', marginBottom: '12px' }}>Groups</div>
      {communityGroups.map(grp => (
        <div key={grp.id} style={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '3px 3px 0px #000', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFF8E7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            {grp.name.includes('Chef') ? '👨‍🍳' : grp.name.includes('Photo') ? '📸' : grp.name.includes('Business') ? '📈' : grp.name.includes('Recipe') ? '📝' : '🏪'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px' }}>{grp.name}</div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', opacity: 0.45 }}>{grp.members.toLocaleString()} members</div>
          </div>
          <button
            onClick={() => setJoined(prev => ({ ...prev, [grp.id]: !prev[grp.id] }))}
            style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em', backgroundColor: joined[grp.id] ? '#000' : '#FFC50A', color: joined[grp.id] ? '#FFF8E7' : '#000', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', boxShadow: '2px 2px 0px #000' }}
          >
            {joined[grp.id] ? 'Joined ✓' : 'Join'}
          </button>
        </div>
      ))}
    </div>
  )
}

const SUBTABS = [
  { id: 'st_feed', label: 'Feed' },
  { id: 'st_trending', label: 'Trending' },
  { id: 'st_groups', label: 'Groups' },
  { id: 'st_leaderboard', label: 'Leaderboard' },
]

export default function CommunityScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [activeTab, setActiveTab] = useState('st_feed')
  const [showCreate, setShowCreate] = useState(false)
  const [draftPost, setDraftPost] = useState('')

  const trendingPosts = [...communityPosts].sort((a, b) => b.likes - a.likes)
  const feedPosts = communityPosts

  return (
    <div style={{ backgroundColor: '#FFF8E7', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '28px' }}>Community</div>
        <button
          onClick={() => setShowCreate(true)}
          style={{ backgroundColor: '#FFC50A', border: 'none', borderRadius: '10px', padding: '8px 14px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '3px 3px 0px #000', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          ✍ Post
        </button>
      </div>

      {/* Sub-tabs */}
      <div style={{ padding: '10px 20px 12px', display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {SUBTABS.map(tab => {
          const isA = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ flexShrink: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: isA ? '#000' : '#fff', color: isA ? '#FFC50A' : '#000', border: 'none', borderRadius: '9px', padding: '7px 14px', cursor: 'pointer', boxShadow: isA ? 'none' : '2px 2px 0px #000' }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px 20px' }}>
        {(activeTab === 'st_feed' || activeTab === 'st_trending') && (
          <>
            {(activeTab === 'st_trending' ? trendingPosts : feedPosts).map(post => (
              <PostCard key={post.id} post={post} onTap={() => setScreen('community_post')} />
            ))}
          </>
        )}
        {activeTab === 'st_groups' && <GroupsTab />}
        {activeTab === 'st_leaderboard' && <LeaderboardTab />}
      </div>

      {/* Create post bottom sheet */}
      {showCreate && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px 20px 0 0', border: 'none', padding: '20px 20px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '22px' }}>Create Post</div>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <textarea
              value={draftPost}
              onChange={e => setDraftPost(e.target.value)}
              placeholder="Share a tip, recipe, or story with the community…"
              style={{ width: '100%', minHeight: '100px', fontFamily: 'Inter', fontSize: '14px', backgroundColor: '#FFF8E7', border: '2px solid #000', borderRadius: '12px', padding: '12px', outline: 'none', resize: 'none', boxShadow: '3px 3px 0px #000', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              {Object.entries(tagMeta).map(([key, val]) => (
                <div key={key} style={{ backgroundColor: val.bg, color: val.text, border: 'none', borderRadius: '6px', padding: '3px 10px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>
                  {val.label}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button style={{ flex: 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#fff', color: '#000', border: '2.5px solid #000', borderRadius: '11px', padding: '12px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }} onClick={() => setShowCreate(false)}>Cancel</button>
              <button style={{ flex: 2, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '17px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#FFC50A', color: '#000', border: '2.5px solid #000', borderRadius: '11px', padding: '12px', cursor: 'pointer', boxShadow: '4px 4px 0px #000' }} onClick={() => { setShowCreate(false); setDraftPost('') }}>Publish Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
