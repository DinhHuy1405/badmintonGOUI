import { MapPin, Navigation, ZoomIn, ZoomOut, Star } from "lucide-react";
import { CourtSlot } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapComponentProps {
  courts: CourtSlot[];
  activeId?: string | null;
  onPinClick?: (id: string) => void;
}

export function MapComponent({ courts, activeId, onPinClick }: MapComponentProps) {
  return (
    <div className="relative w-full h-full bg-slate-200 overflow-hidden border-l border-slate-300">
      {/* Abstract Map Background (Stylized) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 0H800V600H0V0Z" fill="#E2E8F0" />
          <path d="M100 0L120 600M250 0L230 600M400 0L410 600M600 0L580 600M750 0L770 600" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M0 100L800 120M0 250L800 230M0 400L800 410M0 550L800 530" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="400" cy="300" r="150" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Court Pins */}
      {courts.map((court, index) => {
        const top = 15 + (index * 137) % 70;
        const left = 15 + (index * 223) % 70;
        const isActive = activeId === court.id;

        return (
          <div
            key={court.id}
            onClick={() => onPinClick?.(court.id)}
            className={cn(
              "absolute cursor-pointer transition-all duration-300 z-10 group",
              isActive ? "z-30 scale-125" : "hover:z-20 hover:scale-110"
            )}
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <div className={cn(
              "px-2 py-1 rounded-full shadow-lg border flex items-center gap-1 transition-colors whitespace-nowrap",
              isActive
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-900 border-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary"
            )}>
              <span className="text-[11px] font-bold leading-none">{(court.pricePerHour / 1000).toFixed(0)}K</span>
            </div>
            <div className={cn(
              "w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] mx-auto transition-colors",
              isActive ? "border-t-primary" : "border-t-white group-hover:border-t-primary"
            )}></div>

            {/* Hover Card */}
            <div className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-2xl border p-2 z-20 pointer-events-none transition-opacity",
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              <img src={court.image} className="w-full h-24 object-cover rounded-md mb-2" alt={court.courtName} />
              <p className="text-xs font-bold text-slate-900 truncate">{court.courtName}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-slate-500">{court.timeSlot}</p>
                <div className="flex items-center">
                   <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                   <span className="text-[10px] font-bold ml-0.5">{court.rating}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Map Controls */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-2">
        <Button size="icon" variant="white" className="rounded-xl shadow-lg h-10 w-10">
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="white" className="rounded-xl shadow-lg h-10 w-10">
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="white" className="rounded-xl shadow-lg h-10 w-10">
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute left-4 top-4">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-white/50">
          <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-3 w-3 text-primary" />
            Hà Nội, Việt Nam
          </p>
        </div>
      </div>
    </div>
  );
}
