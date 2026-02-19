import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Danh sách ảnh sân cầu lông thực từ Unsplash
const COURT_IMAGES = [
  "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
  "https://images.unsplash.com/photo-1640505817878-6fe5a0a0e7b6?w=800&q=80",
  "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&q=80",
  "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80",
  "https://images.unsplash.com/photo-1613918431703-aa50889e3be8?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1565992441121-4367f2137543?w=800&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
];

/** Trả về ảnh sân ngẫu nhiên nhưng nhất quán theo seed (id/name) */
export function getCourtImage(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0x7fffffff;
  }
  return COURT_IMAGES[hash % COURT_IMAGES.length];
}
