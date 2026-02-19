import { useState, useEffect } from 'react';
import { CourtSlot } from '@/lib/mock-data';
import { Star, MapPin } from 'lucide-react';

interface SimpleMapViewProps {
  courts: CourtSlot[];
  activeCourtId?: string | null;
  onPinClick?: (id: string) => void;
}

export function SimpleMapView({ courts, activeCourtId, onPinClick }: SimpleMapViewProps) {
  const [selectedCourt, setSelectedCourt] = useState<CourtSlot | null>(null);

  useEffect(() => {
    if (activeCourtId) {
      const court = courts.find(c => c.id === activeCourtId);
      if (court) {
        setSelectedCourt(court);
      }
    }
  }, [activeCourtId, courts]);

  const handleMarkerClick = (court: CourtSlot) => {
    setSelectedCourt(court);
    onPinClick?.(court.id);
  };

  // Calculate positions for markers (simple grid layout based on actual coordinates)
  const getMarkerPosition = (court: CourtSlot) => {
    // Map real coordinates to percentage positions on the container
    const minLat = 16.02, maxLat = 16.08;
    const minLng = 108.15, maxLng = 108.25;
    
    const x = ((court.lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - court.lat) / (maxLat - minLat)) * 100;
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const getMarkerColor = (level: string) => {
    switch(level) {
      case 'Yếu': return 'bg-green-500';
      case 'TB': return 'bg-blue-500';
      case 'Khá': return 'bg-orange-500';
      case 'Mọi trình độ': return 'bg-purple-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-slate-50 to-green-50">
      {/* Static map background - using a simple representation */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Location labels */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[40%] text-xs font-semibold text-slate-600">
          Hải Châu
        </div>
        <div className="absolute top-[25%] left-[55%] text-xs font-semibold text-slate-600">
          Thanh Khê
        </div>
        <div className="absolute top-[45%] left-[25%] text-xs font-semibold text-slate-600">
          Liên Chiểu
        </div>
        <div className="absolute top-[60%] left-[65%] text-xs font-semibold text-slate-600">
          Ngũ Hành Sơn
        </div>
        <div className="absolute top-[35%] left-[75%] text-xs font-semibold text-slate-600">
          Sơn Trà
        </div>
      </div>

      {/* Court markers */}
      {courts.map((court) => {
        const position = getMarkerPosition(court);
        const isActive = activeCourtId === court.id || selectedCourt?.id === court.id;
        
        return (
          <button
            key={court.id}
            onClick={() => handleMarkerClick(court)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
              isActive ? 'z-20 scale-125' : 'z-10 hover:scale-110'
            }`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            <div className={`
              ${getMarkerColor(court.skillLevel)}
              ${isActive ? 'ring-4 ring-green-600' : 'ring-2 ring-white'}
              w-5 h-5 rounded-full shadow-lg cursor-pointer
              flex items-center justify-center
            `}>
              <span className="text-white text-xs font-bold">🏸</span>
            </div>
          </button>
        );
      })}

      {/* Info popup */}
      {selectedCourt && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl p-4 max-w-sm w-[90%] z-30 animate-in slide-in-from-bottom">
          <button
            onClick={() => setSelectedCourt(null)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
          
          <img 
            src={selectedCourt.image} 
            className="w-full h-32 object-cover rounded-md mb-3" 
            alt={selectedCourt.courtName} 
          />
          
          <h4 className="text-base font-bold text-slate-900 mb-2">
            🏸 {selectedCourt.courtName}
          </h4>
          
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{selectedCourt.location}</span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold">{selectedCourt.rating}</span>
              <span className="text-xs text-slate-500">({selectedCourt.reviewsCount})</span>
            </div>
            <span className="text-sm font-bold text-green-600">
              {selectedCourt.pricePerHour}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-primary/10 rounded-md px-2 py-1.5 text-center">
              <div className="font-bold text-primary">⏰ {selectedCourt.timeSlot}</div>
            </div>
            <div className="bg-blue-50 rounded-md px-2 py-1.5 text-center">
              <div className="font-bold text-blue-600">🎯 {selectedCourt.skillLevel}</div>
            </div>
            <div className="bg-orange-50 rounded-md px-2 py-1.5 text-center">
              <div className="font-bold text-orange-600">🔥 {selectedCourt.availableSpots} slot</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs">
        <div className="font-semibold mb-2">Trình độ:</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Yếu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>TB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Khá</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Mọi trình độ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
