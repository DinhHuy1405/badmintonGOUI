import { Star, MapPin, Check, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Hotel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CompactHotelCardProps {
  hotel: Hotel;
  isActive?: boolean;
  onClick?: () => void;
  variant?: "card" | "carousel";
}

export function CompactHotelCard({ hotel, isActive, onClick, variant = "card" }: CompactHotelCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl shadow-lg border transition-all cursor-pointer overflow-hidden flex",
        isActive ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-primary/40",
        variant === "carousel" ? "w-[280px] sm:w-[320px] h-32" : "w-full h-32"
      )}
    >
      <div className="w-32 h-full shrink-0 relative">
        <img src={hotel.image} className="w-full h-full object-cover" alt={hotel.name} />
        <button className="absolute top-2 left-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="h-3.5 w-3.5 text-slate-600" />
        </button>
      </div>
      
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">{hotel.rating}</span>
            <span className="text-[10px] font-bold text-emerald-600">{hotel.reviewStatus}</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{hotel.name}</h4>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{hotel.location}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: Math.min(hotel.starRating, 5) }).map((_, i) => (
              <Star key={i} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="text-right">
             <p className="text-sm font-bold text-slate-900">{hotel.price.toLocaleString()} VND</p>
          </div>
        </div>
      </div>
    </div>
  );
}
