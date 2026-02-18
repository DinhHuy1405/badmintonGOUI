import { Star, MapPin, Check, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CourtSlot } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CompactCourtCardProps {
  court: CourtSlot;
  isActive?: boolean;
  onClick?: () => void;
  variant?: "card" | "carousel";
}

export function CompactCourtCard({ court, isActive, onClick, variant = "card" }: CompactCourtCardProps) {
  const levelColor = {
    "Yếu": "bg-green-100 text-green-700",
    "TB": "bg-blue-100 text-blue-700",
    "Khá": "bg-orange-100 text-orange-700",
    "Mọi trình độ": "bg-purple-100 text-purple-700"
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl shadow-lg border transition-all cursor-pointer overflow-hidden flex",
        isActive ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-primary/40",
        variant === "carousel" ? "w-[280px] sm:w-[320px] h-32" : "w-full h-32"
      )}
    >
      <div className="w-28 h-full shrink-0 relative">
        <img src={court.image} className="w-full h-full object-cover" alt={court.courtName} />
        <div className={cn("absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm", levelColor[court.skillLevel] || "bg-white")}>
          {court.skillLevel}
        </div>
      </div>
      
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">{court.rating}</span>
            <span className="text-[10px] font-bold text-emerald-600 truncate">{court.timeSlot}</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{court.courtName}</h4>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{court.district}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-[10px] text-slate-400 font-medium">
             Trống {court.availableSpots} chỗ
          </div>
          <div className="text-right">
             <p className="text-sm font-bold text-primary">{(court.pricePerHour / 2).toLocaleString()}đ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
