export interface Hotel {
  id: string;
  name: string;
  rating: number;
  starRating: number;
  reviewsCount: number;
  reviewStatus: string;
  price: number;
  location: string;
  image: string;
  amenities: string[];
  distanceFromCenter: string;
}

export const MOCK_HOTELS: Hotel[] = [
  {
    id: "1",
    name: "La Sinfonía del Rey Hotel & Spa",
    rating: 9.4,
    starRating: 5,
    reviewsCount: 1248,
    reviewStatus: "Excellent",
    price: 3240000,
    location: "Hoan Kiem, Hanoi",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    amenities: ["Free WiFi", "Spa", "Restaurant", "Bar"],
    distanceFromCenter: "0.2 km from center",
  },
  {
    id: "2",
    name: "Sofitel Legend Metropole Hanoi",
    rating: 9.5,
    starRating: 5,
    reviewsCount: 2150,
    reviewStatus: "Exceptional",
    price: 8500000,
    location: "Hoan Kiem, Hanoi",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800",
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Parking"],
    distanceFromCenter: "0.5 km from center",
  },
  {
    id: "3",
    name: "Hanoi La Siesta Hotel & Spa",
    rating: 9.2,
    starRating: 4,
    reviewsCount: 3500,
    reviewStatus: "Superb",
    price: 1850000,
    location: "Old Quarter, Hanoi",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    amenities: ["Free WiFi", "Spa", "Restaurant"],
    distanceFromCenter: "0.4 km from center",
  },
  {
    id: "4",
    name: "Lotte Hotel Hanoi",
    rating: 9.1,
    starRating: 5,
    reviewsCount: 1800,
    reviewStatus: "Excellent",
    price: 4200000,
    location: "Ba Dinh, Hanoi",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
    amenities: ["Pool", "Gym", "Sky Bar", "Spa"],
    distanceFromCenter: "3.2 km from center",
  },
  {
    id: "5",
    name: "Acoustic Hotel & Spa",
    rating: 8.9,
    starRating: 4,
    reviewsCount: 950,
    reviewStatus: "Very Good",
    price: 1200000,
    location: "Old Quarter, Hanoi",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
    amenities: ["Free WiFi", "Rooftop Bar", "Spa"],
    distanceFromCenter: "0.7 km from center",
  },
  {
    id: "6",
    name: "InterContinental Hanoi Westlake",
    rating: 8.8,
    starRating: 5,
    reviewsCount: 1540,
    reviewStatus: "Very Good",
    price: 3800000,
    location: "Tay Ho, Hanoi",
    image: "https://images.unsplash.com/photo-1551882547-ff43c63fed0e?auto=format&fit=crop&q=80&w=800",
    amenities: ["Pool", "Lake View", "Restaurant", "Gym"],
    distanceFromCenter: "4.5 km from center",
  }
];

export const FILTERS = {
  starRatings: [5, 4, 3, 2, 1],
  amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Parking", "Restaurant", "Bar", "Air Conditioning"],
  priceRange: {
    min: 0,
    max: 10000000,
  },
  mealPlans: ["Breakfast included", "Half board", "Full board", "All inclusive"],
};
