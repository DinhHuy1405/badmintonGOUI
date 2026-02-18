export interface CourtSlot {
  id: string;
  courtName: string;
  rating: number;
  reviewsCount: number;
  reviewStatus: string;
  pricePerHour: number;
  totalPrice?: number; // For the specific slot duration
  location: string;
  district: string;
  image: string;
  amenities: string[];
  distanceFromCenter: string;
  timeSlot: string; // e.g., "18:00 - 20:00"
  date: string;
  availableSpots: number;
  skillLevel: "Yếu" | "TB" | "Khá" | "Mọi trình độ";
  hostName: string;
  zaloLink: string;
}

export const MOCK_COURTS: CourtSlot[] = [
  {
    id: "1",
    courtName: "Sân Cầu Lông Đại Học Y Hà Nội",
    rating: 9.1,
    reviewsCount: 342,
    reviewStatus: "Rất tốt",
    pricePerHour: 120000,
    totalPrice: 240000,
    location: "Số 1 Tôn Thất Tùng, Đống Đa, Hà Nội",
    district: "Đống Đa",
    image: "https://images.unsplash.com/photo-1626224484214-4051d0c21db2?auto=format&fit=crop&q=80&w=800",
    amenities: ["Gửi xe", "Nước uống", "Thay đồ", "Canteen"],
    distanceFromCenter: "1.5 km",
    timeSlot: "18:00 - 20:00",
    date: "Thứ Hai, 02/03/2026",
    availableSpots: 4,
    skillLevel: "TB",
    hostName: "Anh Thắng",
    zaloLink: "https://zalo.me/0987654321",
  },
  {
    id: "2",
    courtName: "Sân Cầu Lông T19",
    rating: 8.8,
    reviewsCount: 156,
    reviewStatus: "Tốt",
    pricePerHour: 150000,
    totalPrice: 300000,
    location: "Số 9 Thành Công, Ba Đình, Hà Nội",
    district: "Ba Đình",
    image: "https://images.unsplash.com/photo-1595252292352-09386ad2792a?auto=format&fit=crop&q=80&w=800",
    amenities: ["Máy lạnh", "Gửi xe", "Thảm chuẩn"],
    distanceFromCenter: "2.8 km",
    timeSlot: "19:00 - 21:00",
    date: "Thứ Hai, 02/03/2026",
    availableSpots: 2,
    skillLevel: "Khá",
    hostName: "Chị Minh",
    zaloLink: "https://zalo.me/0987654322",
  },
  {
    id: "3",
    courtName: "Sân Cầu Lông Bách Khoa",
    rating: 8.5,
    reviewsCount: 520,
    reviewStatus: "Phổ biến",
    pricePerHour: 80000,
    totalPrice: 160000,
    location: "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
    district: "Hai Bà Trưng",
    image: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&q=80&w=800",
    amenities: ["Gửi xe", "Nước uống", "Giá rẻ"],
    distanceFromCenter: "2.0 km",
    timeSlot: "17:00 - 19:00",
    date: "Thứ Hai, 02/03/2026",
    availableSpots: 6,
    skillLevel: "Yếu",
    hostName: "Anh Huy",
    zaloLink: "https://zalo.me/0987654323",
  },
  {
    id: "4",
    courtName: "Sân Cầu Lông Ciputra",
    rating: 9.5,
    reviewsCount: 112,
    reviewStatus: "Tuyệt vời",
    pricePerHour: 200000,
    totalPrice: 400000,
    location: "Khu đô thị Ciputra, Tây Hồ, Hà Nội",
    district: "Tây Hồ",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    amenities: ["Hồ bơi", "Gym", "Máy lạnh", "Phòng tắm"],
    distanceFromCenter: "6.5 km",
    timeSlot: "20:00 - 22:00",
    date: "Thứ Hai, 02/03/2026",
    availableSpots: 2,
    skillLevel: "Khá",
    hostName: "Anh Thắng",
    zaloLink: "https://zalo.me/0987654324",
  },
  {
    id: "5",
    courtName: "Sân Cầu Lông Nhà Thi Đấu Cầu Giấy",
    rating: 9.0,
    reviewsCount: 890,
    reviewStatus: "Rất tốt",
    pricePerHour: 140000,
    totalPrice: 280000,
    location: "35 Trần Quý Kiên, Cầu Giấy, Hà Nội",
    district: "Cầu Giấy",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800",
    amenities: ["Khán đài", "Gửi xe", "Thảm xịn"],
    distanceFromCenter: "4.2 km",
    timeSlot: "18:30 - 20:30",
    date: "Thứ Hai, 02/03/2026",
    availableSpots: 3,
    skillLevel: "TB",
    hostName: "Minh Minh",
    zaloLink: "https://zalo.me/0987654325",
  }
];

export const FILTERS = {
  skillLevels: ["Yếu", "TB", "Khá", "Mọi trình độ"],
  amenities: ["Gửi xe", "Nước uống", "Thay đồ", "Máy lạnh", "Thảm chuẩn", "Phòng tắm", "Canteen"],
  districts: ["Đống Đa", "Ba Đình", "Hai Bà Trưng", "Tây Hồ", "Cầu Giấy", "Thanh Xuân", "Long Biên"],
  priceRange: {
    min: 0,
    max: 500000,
  },
};
