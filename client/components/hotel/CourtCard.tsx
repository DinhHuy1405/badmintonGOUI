import { Star, MapPin, Check, ExternalLink, MessageCircle, Clock, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourtSlot } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CourtCardProps {
  court: CourtSlot;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onShowOnMap?: () => void;
  isActive?: boolean;
}

export function CourtCard({ court, onMouseEnter, onMouseLeave, onShowOnMap, isActive }: CourtCardProps) {
  const levelColor = {
    "Yếu": "bg-green-100 text-green-700 border-green-200",
    "TB": "bg-blue-100 text-blue-700 border-blue-200",
    "Khá": "bg-orange-100 text-orange-700 border-orange-200",
    "Mọi trình độ": "bg-purple-100 text-purple-700 border-purple-200"
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all border-slate-200 cursor-pointer",
        isActive ? "ring-2 ring-primary shadow-lg" : "hover:shadow-lg hover:border-primary/50"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section (1/3) */}
        <div className="w-full md:w-1/3 h-48 md:h-auto shrink-0 overflow-hidden relative group">
          <img
            src={court.image}
            alt={court.courtName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <Badge className={cn("absolute top-3 left-3 border shadow-sm", levelColor[court.skillLevel] || "bg-white")}>
            {court.skillLevel}
          </Badge>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
             <Button variant="white" size="sm" className="rounded-full font-bold h-8 gap-1.5" onClick={(e) => { e.stopPropagation(); onShowOnMap?.(); }}>
                <MapPin className="h-3.5 w-3.5" />
                Xem vị trí
             </Button>
          </div>
        </div>

        {/* Info Section (2/3) */}
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{court.courtName}</h3>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{court.district} • {court.distanceFromCenter}</span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-emerald-600 text-white shrink-0">
                    <span className="text-md font-bold leading-none">{court.rating}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 leading-none">{court.reviewStatus}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{court.reviewsCount} đánh giá</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-slate-100">
                  <Clock className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Giờ chơi</p>
                  <p className="text-sm font-bold text-slate-700">{court.timeSlot}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-slate-100">
                  <Users className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Còn trống</p>
                  <p className="text-sm font-bold text-slate-700">{court.availableSpots} người</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {court.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium leading-none">Chủ kèo</p>
                <p className="text-sm font-bold text-slate-700">{court.hostName}</p>
              </div>
            </div>

            <div className="text-right flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 font-medium">Chi phí / người</span>
                <p className="text-2xl font-black text-primary">{(court.pricePerHour / 2).toLocaleString()} VND</p>
              </div>
              <Button 
                asChild
                className="h-12 px-6 font-bold bg-[#0068FF] hover:bg-[#0058D6] gap-2 rounded-xl"
              >
                <a href={court.zaloLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 fill-white" />
                  Zalo ngay
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
