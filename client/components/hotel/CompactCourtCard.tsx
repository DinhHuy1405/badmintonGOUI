import { MapPin } from "lucide-react";
import { CourtSlot } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CompactCourtCardProps {
  court: CourtSlot;
  isActive?: boolean;
  onClick?: () => void;
  variant?: "card" | "carousel";
}

// Color map for fine-grained skill labels
const levelColor: Record<string, string> = {
  "Yếu":  "bg-green-100 text-green-700",
  "Yếu+": "bg-green-100 text-green-700",
  "TB-":  "bg-blue-100 text-blue-700",
  "TB":   "bg-blue-100 text-blue-700",
  "TB+":  "bg-blue-100 text-blue-700",
  "Khá-": "bg-orange-100 text-orange-700",
  "Khá":  "bg-orange-100 text-orange-700",
  "Khá+": "bg-orange-100 text-orange-700",
  "Giỏi": "bg-red-100 text-red-700",
  "Mọi trình độ": "bg-purple-100 text-purple-700",
};

export function CompactCourtCard({ court, isActive, onClick, variant = "card" }: CompactCourtCardProps) {
  const isFull = court.status === 'full';

  const slotsText = isFull
    ? '🔴 Full'
    : court.availableSpots < 0
      ? 'Hỏi thêm'
      : court.availableSpots === 0
        ? 'Liên hệ'
        : `${court.availableSpots} chỗ`;

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
      </div>
      
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex items-center gap-1">
              {(court.skillLevels && court.skillLevels.length > 0 ? court.skillLevels : [court.skillLevel]).map((lvl) => (
                <span key={lvl} className={cn("text-[9px] font-black px-2 py-0.5 rounded", levelColor[lvl] ?? "bg-purple-100")}>{lvl}</span>
              ))}
            </div>
            <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded">{court.timeSlot}</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{court.courtName}</h4>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{court.district}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-1 rounded">
             🔥 {slotsText}
          </div>
          <div className="text-right">
             <p className="text-sm font-bold text-primary">
               {court.pricePerHour > 0 ? `${court.pricePerHour.toLocaleString()}đ` : 'Liên hệ'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
