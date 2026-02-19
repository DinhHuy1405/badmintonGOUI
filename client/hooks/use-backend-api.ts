import { useState, useEffect } from 'react';
import { getCourtImage } from '@/lib/utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

// ─── Exact types matching backend DTOs ───────────────────────────────────────

/** Matches the backend MatchDto (src/modules/match/dtos/match.dto.ts) */
export interface BackendMatch {
  id: string;
  sourcePostId: string | null;
  hostUserId: string | null;
  courtId: string | null;
  title: string | null;
  description: string | null;
  date: string | null;           // "YYYY-MM-DD"
  startTime: string | null;      // "HH:mm"
  endTime: string | null;        // "HH:mm"
  areaText: string | null;
  levelMin: number | null;       // 1.0–5.0
  levelMax: number | null;
  totalSlots: number | null;
  currentJoined: number | null;
  status: string | null;
  pricePerPlayer: number | null;
  // migration 0002
  contactName: string | null;    // Tên người tuyển (từ bài đăng)
  contactPhone: string | null;   // SĐT từ bài đăng
  zaloLink: string | null;       // Zalo link sinh từ SĐT
  fbGroupId: string | null;      // FB group ID của bài đăng
  isLookingForGroup: boolean | null; // TRUE nếu đăng đi tìm nhóm
  createdAt: string;
  updatedAt: string;
}

/** Matches the backend CourtDto (src/modules/court/dtos/court.dto.ts) */
export interface BackendCourt {
  id: string;
  name: string;
  addressText: string | null;
  district: string | null;
  city: string | null;
  geoLat: number | null;
  geoLng: number | null;
  indoor: boolean | null;
  note: string | null;
  contactName: string | null;
  contactPhone: string | null;
  // migration 0002
  fbGroupId: string | null;      // Nhóm FB mà sân được tìm thấy từ đó
  imageUrl: string | null;
  totalCourts: number | null;
  zaloLink: string | null;
  websiteUrl: string | null;
  ratingAvg: number | null;
  reviewCount: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Matches the backend FbGroupDto */
export interface BackendFbGroup {
  id: string;
  fbGroupId: string;             // FB group numeric/slug ID
  name: string | null;
  description: string | null;
  url: string | null;
  memberCount: number | null;
  isActive: boolean;
  crawlEnabled: boolean;
  city: string | null;
  lastCrawledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Fine-grained skill level buckets matching AI analysis output ─────────────
// Vietnamese badminton community uses: Yếu, TB-, TB, TB+, Khá-, Khá, Khá+, Giỏi
const SKILL_BUCKETS: Array<{ name: string; lo: number; hi: number }> = [
  { name: 'Yếu',  lo: 0,   hi: 1.49 },
  { name: 'Yếu+', lo: 1.5, hi: 1.99 },
  { name: 'TB-',  lo: 2.0, hi: 2.49 },
  { name: 'TB',   lo: 2.5, hi: 2.99 },
  { name: 'TB+',  lo: 3.0, hi: 3.49 },
  { name: 'Khá-', lo: 3.5, hi: 3.99 },
  { name: 'Khá',  lo: 4.0, hi: 4.49 },
  { name: 'Khá+', lo: 4.5, hi: 4.99 },
  { name: 'Giỏi', lo: 5.0, hi: 5.0 },
];

/** Return all fine-grained skill labels the numeric range [min,max] overlaps. */
function labelsFromRange(levelMin: number | null, levelMax: number | null): string[] {
  if (levelMin === null && levelMax === null) return ['Mọi trình độ'];
  const min = levelMin ?? 0;
  const max = levelMax ?? 5;
  const out: string[] = [];
  for (const b of SKILL_BUCKETS) {
    if (max >= b.lo && min <= b.hi) out.push(b.name);
  }
  return out.length > 0 ? out : ['Mọi trình độ'];
}

/** Map a single fine-grained label to one of the 3 broad filter categories */
export function broadSkillCategory(label: string): 'Yếu' | 'TB' | 'Khá' | 'Mọi trình độ' {
  if (label.startsWith('Yếu')) return 'Yếu';
  if (label.startsWith('TB'))  return 'TB';
  if (label.startsWith('Khá') || label === 'Giỏi') return 'Khá';
  return 'Mọi trình độ';
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useBackendMatches() {
  const [matches, setMatches] = useState<BackendMatch[]>([]);
  const [courts, setCourts] = useState<BackendCourt[]>([]);
  const [fbGroupsMap, setFbGroupsMap] = useState<Map<string, BackendFbGroup>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        // Try the optimised single-query endpoint first (/matches/full)
        let matchList: BackendMatch[] = [];
        let courtList: BackendCourt[] = [];
        const groupMap = new Map<string, BackendFbGroup>();

        try {
          const res = await fetch(`${API_BASE_URL}/api/matches/full`, { signal: controller.signal });
          if (res.ok) {
            const body = await res.json();
            const rows: Array<{ match: BackendMatch; court: BackendCourt | null; fbGroup: BackendFbGroup | null }> = body.data ?? [];
            const courtsById = new Map<string, BackendCourt>();
            for (const row of rows) {
              matchList.push(row.match);
              if (row.court) courtsById.set(row.court.id, row.court);
              if (row.fbGroup) groupMap.set(row.fbGroup.fbGroupId, row.fbGroup);
            }
            courtList = Array.from(courtsById.values());
          } else {
            throw new Error('full endpoint unavailable');
          }
        } catch {
          // Fallback: separate calls (backwards compat with older backend)
          const [matchesRes, courtsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/matches`, { signal: controller.signal }),
            fetch(`${API_BASE_URL}/api/courts`,  { signal: controller.signal }),
          ]);
          if (!matchesRes.ok || !courtsRes.ok) {
            throw new Error(`Backend error: matches=${matchesRes.status} courts=${courtsRes.status}`);
          }
          const matchesBody = await matchesRes.json();
          const courtsBody  = await courtsRes.json();
          matchList = matchesBody.data ?? [];
          courtList = courtsBody.data ?? [];
        }

        clearTimeout(timeout);
        console.log(`✅ Backend: ${matchList.length} matches, ${courtList.length} courts, ${groupMap.size} groups`);

        setMatches(matchList);
        setCourts(courtList);
        setFbGroupsMap(groupMap);
        setError(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.warn('⚠️ Backend unavailable, falling back to JSON:', msg);
        setError(msg);
        setMatches([]);
        setCourts([]);
        setFbGroupsMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { matches, courts, fbGroupsMap, loading, error };
}

// ─── Hook: fetch FB groups list ───────────────────────────────────────────────
export function useBackendFbGroups() {
  const [groups, setGroups] = useState<BackendFbGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(`${API_BASE_URL}/api/fb-groups`, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        setGroups(body.data ?? []);
      } catch (err) {
        console.warn('⚠️ Could not fetch fb-groups:', err);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return { groups, loading };
}

// ─── Transform backend data → UI CourtSlot format ────────────────────────────

export function transformBackendMatchToUI(
  match: BackendMatch,
  court?: BackendCourt,
  fbGroupsMap?: Map<string, BackendFbGroup>,
) {
  // pricePerPlayer is the per-person price (e.g. 50000đ). Store directly — no multiplication.
  const pricePerHour = match.pricePerPlayer ?? 0;
  // If totalSlots is null, we don't know how many slots — show -1 to signal "unknown" to UI
  const slotsLeft = match.totalSlots != null
    ? Math.max(0, match.totalSlots - (match.currentJoined ?? 0))
    : -1;  // -1 = unknown

  // Zalo link: prioritize from match (has phone from post), then court
  const zaloLink =
    match.zaloLink
    ?? (court?.zaloLink ?? null)
    ?? (court?.contactPhone
        ? `https://zalo.me/${court.contactPhone.replace(/^0/, '84')}`
        : null)
    ?? 'https://zalo.me/';

  // Host name: from match contact, fallback to court owner
  const hostName = match.contactName ?? court?.contactName ?? 'Chủ bài';

  // Group name for display (e.g. "Từ nhóm: Cầu lông Đà Nẵng")
  const fbGroup = match.fbGroupId ? fbGroupsMap?.get(match.fbGroupId) : undefined;

  const startTime = match.startTime?.slice(0, 5) ?? '?';   // "HH:mm"
  const endTime   = match.endTime?.slice(0, 5)   ?? '?';
  const skillLevels = labelsFromRange(match.levelMin ?? null, match.levelMax ?? null) as Array<"Yếu" | "TB" | "Khá" | "Mọi trình độ">;

  // Normalize ISO date to plain YYYY-MM-DD (Postgres returns '2026-02-19T00:00:00.000Z')
  const matchDate = match.date ? String(match.date).slice(0, 10) : '';

  // Broad category for sidebar filter matching (Yếu / TB / Khá / Mọi trình độ)
  const broadCategory = broadSkillCategory(skillLevels[0] ?? 'Mọi trình độ');

  return {
    id:               match.id,
    courtName:        court?.name        ?? match.areaText ?? '',
    location:         court?.addressText ?? match.areaText ?? '',
    district:         court?.district    ?? 'Đà Nẵng',
    date:             matchDate,
    timeSlot:         `${startTime} - ${endTime}`,
    pricePerHour,
    // Fine-grained labels for display (e.g. "TB+", "Khá-")
    skillLevel:       broadCategory as "Yếu" | "TB" | "Khá" | "Mọi trình độ",
    skillLevels,
    availableSpots:   slotsLeft,  // -1 = unknown, 0+ = actual count
    rating:           0,          // no fake ratings — removed star display
    reviewsCount:     0,
    reviewStatus:     '',
    amenities:        [],         // no fake amenities
    distanceFromCenter: '',
    hostName,
    zaloLink,
    lat:              court?.geoLat      ?? 16.0544,
    lng:              court?.geoLng      ?? 108.2022,
    image:            court?.imageUrl    ?? getCourtImage(court?.id ?? match.id),
    status:           (match.status === 'full' ? 'full' : 'open') as 'open' | 'full',
    notes:            match.description  ?? '',
    // Group tracing (for UI badge "Từ nhóm: X")
    fbGroupId:        match.fbGroupId    ?? null,
    fbGroupName:      fbGroup?.name      ?? null,
    fbGroupUrl:       fbGroup?.url       ?? null,
    isLookingForGroup: match.isLookingForGroup ?? false,
    sourceUrl:        '',
  };
}
