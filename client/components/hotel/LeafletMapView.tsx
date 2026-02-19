import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { CourtSlot } from '@/lib/mock-data';
import { Star, MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix default marker icon issue in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LeafletMapViewProps {
  courts: CourtSlot[];
  activeCourtId?: string | null;
  onPinClick?: (id: string) => void;
}

const center: [number, number] = [16.0544, 108.2022]; // Đà Nẵng center

// Component to handle map updates
function MapController({ activeCourtId, courts }: { activeCourtId?: string | null; courts: CourtSlot[] }) {
  const map = useMap();

  useEffect(() => {
    if (activeCourtId) {
      const court = courts.find(c => c.id === activeCourtId);
      if (court) {
        map.setView([court.lat, court.lng], 15, {
          animate: true,
        });
      }
    }
  }, [activeCourtId, courts, map]);

  return null;
}

export function LeafletMapView({ courts, activeCourtId, onPinClick }: LeafletMapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController activeCourtId={activeCourtId} courts={courts} />

      {courts.map((court) => {
        return (
          <Marker
            key={court.id}
            position={[court.lat, court.lng]}
            eventHandlers={{
              click: () => {
                onPinClick?.(court.id);
              },
            }}
          >
            <Popup>
              <div className="p-1 max-w-xs">
                <img 
                  src={court.image} 
                  className="w-full h-24 object-cover rounded-md mb-2" 
                  alt={court.courtName} 
                />
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  🏸 {court.courtName}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>{court.district}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{court.rating}</span>
                  </div>
                  <span className="text-xs font-bold text-green-600">
                    {court.pricePerHour}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs">
                    <span className="font-semibold text-primary">⏰ {court.timeSlot}</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">🎯 {court.skillLevel}</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-orange-600">
                      🔥 Còn {court.availableSpots} slot
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
