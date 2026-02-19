import { MapPin, MessageCircle, Clock, Users, User, Users2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CourtSlot } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CourtCardProps {
  court: CourtSlot;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onShowOnMap?: () => void;
  isActive?: boolean;
  compact?: boolean;
}

// Color map for fine-grained skill labels
const levelColor: Record<string, string> = {
  "Yếu":  "bg-green-100 text-green-700 border-green-200",
  "Yếu+": "bg-green-100 text-green-700 border-green-200",
  "TB-":  "bg-blue-100 text-blue-700 border-blue-200",
  "TB":   "bg-blue-100 text-blue-700 border-blue-200",
  "TB+":  "bg-blue-100 text-blue-700 border-blue-200",
  "Khá-": "bg-orange-100 text-orange-700 border-orange-200",
  "Khá":  "bg-orange-100 text-orange-700 border-orange-200",
  "Khá+": "bg-orange-100 text-orange-700 border-orange-200",
  "Giỏi": "bg-red-100 text-red-700 border-red-200",
  "Mọi trình độ": "bg-purple-100 text-purple-700 border-purple-200",
};

function SkillBadges({ levels, skillLevel }: { levels?: string[]; skillLevel: string }) {
  const labels = levels && levels.length > 0 ? levels : [skillLevel];
  return (
    <div className="flex flex-wrap items-center gap-1">
      {labels.map((lvl) => (
        <span key={lvl} className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-black shadow-sm", levelColor[lvl] ?? "bg-purple-100 text-purple-700 border-purple-200")}>{lvl}</span>
      ))}
    </div>
  );
}

function SlotsDisplay({ spots, isFull }: { spots: number; isFull: boolean }) {
  if (isFull) return <p className="text-lg font-black text-red-600">🔴 Đã FULL</p>;
  if (spots < 0) return <p className="text-lg font-black text-slate-500">Hỏi thêm</p>;
  if (spots === 0) return <p className="text-lg font-black text-amber-600">Liên hệ</p>;
  return <p className="text-lg font-black text-orange-600">{spots} chỗ</p>;
}

function SlotsCompact({ spots, isFull }: { spots: number; isFull: boolean }) {
  if (isFull) return <span>🔴 Full</span>;
  if (spots < 0) return <span>Hỏi thêm</span>;
  if (spots === 0) return <span>Liên hệ</span>;
  return <span>{spots} chỗ</span>;
}

export function CourtCard({ court, onMouseEnter, onMouseLeave, onShowOnMap, isActive, compact = false }: CourtCardProps) {
  const priceDisplay = court.pricePerHour > 0
    ? `${court.pricePerHour.toLocaleString('vi-VN')}đ`
    : 'Liên hệ';

  const isFull = court.status === 'full';

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all border-slate-200 cursor-pointer",
        isActive ? "ring-2 ring-primary shadow-lg" : "hover:shadow-lg hover:border-primary/50"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {compact ? (
        // Compact vertical layout for 3-column grid
        <div className="flex flex-col h-full">
          <div className="w-full h-48 overflow-hidden relative group">
            <img
              src={court.image}
              alt={court.courtName}
              className={cn(
                "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                isFull && "opacity-60"
              )}
            />
            <div className="absolute bottom-2 left-2">
              <SkillBadges levels={court.skillLevels} skillLevel={court.skillLevel} />
            </div>
            {isFull && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-red-600 text-white font-black text-lg px-4 py-1.5 rounded-full shadow-lg rotate-[-8deg]">
                  🔴 ĐÃ FULL
                </span>
              </div>
            )}
          </div>
          
          <div className="p-4 flex flex-col gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 line-clamp-1 mb-1">
                {court.courtName}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3" />
                <span>{court.district}</span>
              </div>
            </div>

            {(court.fbGroupName || court.isLookingForGroup) && (
              <div className="flex flex-wrap gap-1.5">
                {court.fbGroupName && (
                  <a
                    href={court.fbGroupUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5 hover:bg-blue-100 transition-colors"
                  >
                    <Users2 className="h-3 w-3" />
                    {court.fbGroupName}
                  </a>
                )}
                {court.isLookingForGroup && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">
                    <Search className="h-3 w-3" />
                    Tìm nhóm
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{court.timeSlot}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-slate-400" />
                  <SlotsCompact spots={court.availableSpots} isFull={isFull} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <p className="text-xs text-slate-500">Chi phí / người</p>
                <p className="text-xl font-black text-primary">{priceDisplay}</p>
              </div>
              <Button 
                asChild
                size="sm"
                className="h-9 px-4 font-bold"
              >
                <a href={court.zaloLink} target="_blank" rel="noopener noreferrer">
                  Liên hệ
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Full horizontal layout for single column
        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section */}
          <div className="w-full md:w-1/3 h-48 md:h-auto shrink-0 overflow-hidden relative group">
            <img
              src={court.image}
              alt={court.courtName}
              className={cn(
                "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500",
                isFull && "opacity-60"
              )}
            />
            <div className="absolute top-3 left-3">
              <SkillBadges levels={court.skillLevels} skillLevel={court.skillLevel} />
            </div>
            {isFull ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-red-600 text-white font-black text-xl px-5 py-2 rounded-full shadow-lg rotate-[-8deg]">
                  🔴 ĐÃ FULL
                </span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                 <Button variant="white" size="sm" className="rounded-full font-bold h-8 gap-1.5" onClick={(e) => { e.stopPropagation(); onShowOnMap?.(); }}>
                    <MapPin className="h-3.5 w-3.5" />
                    Xem vị trí
                 </Button>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-xl">{court.courtName}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{court.location || court.district}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Giờ chơi</p>
                  <p className="text-lg font-black text-primary">{court.timeSlot}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-orange-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Còn trống</p>
                  <SlotsDisplay spots={court.availableSpots} isFull={isFull} />
                </div>
              </div>
            </div>
          </div>

          {(court.fbGroupName || court.isLookingForGroup) && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {court.fbGroupName && (
                <a
                  href={court.fbGroupUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-100 transition-colors"
                >
                  <Users2 className="h-3.5 w-3.5" />
                  {court.fbGroupName}
                </a>
              )}
              {court.isLookingForGroup && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1">
                  <Search className="h-3.5 w-3.5" />
                  Đang tìm nhóm
                </span>
              )}
            </div>
          )}

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
                <p className="text-2xl font-black text-primary">{priceDisplay}</p>
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
      )}
    </Card>
  );
}
