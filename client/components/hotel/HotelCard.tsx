import { Star, MapPin, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel } from "@/lib/mock-data";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="w-full md:w-64 h-48 md:h-auto shrink-0 overflow-hidden relative">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 left-2 bg-white/90 text-slate-900 border-none">
            {hotel.starRating} Stars
          </Badge>
        </div>

        {/* Info Section */}
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-slate-900">{hotel.name}</h3>
              <div className="flex items-center gap-1">
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{hotel.location} • {hotel.distanceFromCenter}</span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
              {hotel.amenities.slice(0, 3).map((amenity) => (
                <div key={amenity} className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                  {amenity}
                </div>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="text-xs text-slate-400">+{hotel.amenities.length - 3} more</span>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between mt-6 md:mt-0 pt-4 border-t border-slate-100 md:border-none">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-emerald-600 text-white shrink-0">
                <span className="text-lg font-bold leading-none">{hotel.rating}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-600 leading-none">{hotel.reviewStatus}</p>
                <p className="text-xs text-slate-500 mt-1">{hotel.reviewsCount} reviews</p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-xs text-slate-500 font-medium">1 night from</span>
              <p className="text-2xl font-bold text-slate-900">{hotel.price.toLocaleString()} VND</p>
              <Button className="mt-2 h-10 px-6 font-bold gap-2">
                View Deal
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
