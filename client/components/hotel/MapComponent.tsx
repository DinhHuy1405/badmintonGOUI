import { MapPin, Navigation, ZoomIn, ZoomOut } from "lucide-react";
import { Hotel } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

interface MapComponentProps {
  hotels: Hotel[];
}

export function MapComponent({ hotels }: MapComponentProps) {
  return (
    <div className="relative w-full h-[600px] bg-slate-200 rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
      {/* Abstract Map Background (Stylized) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0H800V600H0V0Z" fill="#E2E8F0" />
          <path d="M100 0L120 600M250 0L230 600M400 0L410 600M600 0L580 600M750 0L770 600" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M0 100L800 120M0 250L800 230M0 400L800 410M0 550L800 530" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="400" cy="300" r="150" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M300 200Q400 100 500 200T700 300" stroke="#94A3B8" strokeWidth="4" opacity="0.2" />
        </svg>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      {/* Hotel Pins */}
      {hotels.map((hotel, index) => {
        // Deterministic but random-looking positions
        const top = 20 + (index * 137) % 60;
        const left = 20 + (index * 223) % 60;
        
        return (
          <div
            key={hotel.id}
            className="absolute cursor-pointer transition-transform hover:scale-110 z-10 group"
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <div className="bg-white px-2 py-1 rounded-full shadow-md border border-slate-200 flex items-center gap-1 group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="text-[10px] font-bold leading-none">{(hotel.price / 1000000).toFixed(1)}M</span>
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white mx-auto group-hover:border-t-primary transition-colors"></div>
            
            {/* Hover Card */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-white rounded-lg shadow-xl border p-2 z-20">
              <img src={hotel.image} className="w-full h-24 object-cover rounded-md mb-2" alt={hotel.name} />
              <p className="text-xs font-bold text-slate-900 truncate">{hotel.name}</p>
              <p className="text-[10px] text-slate-500">{hotel.price.toLocaleString()} VND</p>
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
            Hanoi, Vietnam
          </p>
        </div>
      </div>
    </div>
  );
}
