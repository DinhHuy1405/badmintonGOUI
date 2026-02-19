import { useState, useEffect } from 'react';
import { getCourtImage } from '@/lib/utils';

export interface Match {
  id: string;
  courtId: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  skillLevel: string;
  currentPlayers: number;
  maxPlayers: number;
  playersNeeded: number;
  pricePerPerson: number;
  status: string;
  contactPhone: string | null;
  contactName: string;
  notes: string;
  sourcePostId: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Court {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  priceRange: string;
  rating: number;
  totalReviews: number;
  facilities: string[];
  openingHours: string;
  phone: string;
  image: string;
}

export interface ParsedData {
  matches: Match[];
  courts: Court[];
  metadata: {
    totalMatches: number;
    totalCourts: number;
    lastUpdated: string;
    source: string;
  };
}

/**
 * Hook to load parsed matches and courts from JSON file
 */
export function useParsedMatches() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/parsed-matches.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load parsed data');
        return res.json();
      })
      .then((jsonData: ParsedData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading parsed matches:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

/** Map English skill level from AI to Vietnamese labels used by UI filters */
function mapSkillLevel(level: string | null): "Yếu" | "TB" | "Khá" | "Mọi trình độ" {
  if (!level) return "Mọi trình độ";
  const l = level.toLowerCase();
  if (l === "beginner") return "Yếu";
  if (l === "advanced") return "Khá";
  if (l === "intermediate") return "TB";
  return "Mọi trình độ";
}

/**
 * Transform Match data to CourtSlot format expected by the UI
 */
export function transformMatchToCourtCard(match: Match, court?: Court) {
  // pricePerPerson is per-player (e.g. 50000). CourtCard divides by 2 to display,
  // so multiply by 2 here to get correct display.
  const pricePerHour = (match.pricePerPerson ?? 0) * 2;
  const startTime = match.startTime?.slice(0, 5) ?? '?';
  const endTime   = match.endTime?.slice(0, 5)   ?? '?';
  const phone = match.contactPhone ?? court?.phone ?? '';
  const zaloLink = phone
    ? `https://zalo.me/${phone.replace(/^0/, '84')}`
    : 'https://zalo.me/';

  const skillLabel = mapSkillLevel(match.skillLevel);

  return {
    id:               match.id,
    courtName:        match.courtName || court?.name || 'Sân không tên',
    location:         court?.address  || '',
    district:         court?.district || 'Đà Nẵng',
    date:             match.date      ?? '',
    timeSlot:         `${startTime} - ${endTime}`,
    pricePerHour,
    skillLevel:       skillLabel,
    skillLevels:      [skillLabel],   // single label from JSON data
    availableSpots:   match.playersNeeded ?? -1,
    rating:           0,
    reviewsCount:     0,
    reviewStatus:     '',
    amenities:        [],
    distanceFromCenter: '',
    hostName:         match.contactName   ?? 'Chủ kèo',
    zaloLink,
    lat:              16.0544,
    lng:              108.2022,
    image:            getCourtImage(match.courtId || match.id),
  };
}
