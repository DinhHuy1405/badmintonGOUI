import { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { CourtSlot } from '@/lib/mock-data';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleMapViewProps {
  courts: CourtSlot[];
  activeCourtId?: string | null;
  onPinClick?: (id: string) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 16.0544, // Đà Nẵng center
  lng: 108.2022,
};

// Custom marker colors based on court level
const getMarkerColor = (level: string) => {
  switch(level) {
    case 'Yếu': return '#22c55e'; // green
    case 'TB': return '#3b82f6'; // blue
    case 'Khá': return '#f97316'; // orange
    case 'Mọi trình độ': return '#a855f7'; // purple
    default: return '#22c55e';
  }
};

export function GoogleMapView({ courts, activeCourtId, onPinClick }: GoogleMapViewProps) {
  const [selectedCourt, setSelectedCourt] = useState<CourtSlot | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    if (activeCourtId) {
      const court = courts.find(c => c.id === activeCourtId);
      if (court && map) {
        setSelectedCourt(court);
        map.panTo({ lat: court.lat, lng: court.lng });
      }
    }
  }, [activeCourtId, courts, map]);

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">❌ Lỗi tải Google Maps</div>
        <div className="text-sm text-gray-600 mb-4">
          {loadError.message}
        </div>
        <div className="text-xs text-gray-500 max-w-md">
          <p className="mb-2">Kiểm tra:</p>
          <ul className="list-disc text-left pl-5 space-y-1">
            <li>API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Có' : '❌ Thiếu'}</li>
            <li>Enable "Maps JavaScript API" trong Google Cloud Console</li>
            <li>Bật Billing cho project</li>
            <li>Kiểm tra API restrictions (cho phép localhost)</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-full">Đang tải bản đồ...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {courts.map((court) => {
          return (
            <Marker
              key={court.id}
              position={{ lat: court.lat, lng: court.lng }}
              onClick={() => {
                setSelectedCourt(court);
                onPinClick?.(court.id);
              }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: activeCourtId === court.id ? '#16a34a' : getMarkerColor(court.skillLevel),
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: activeCourtId === court.id ? 12 : 10,
              }}
            />
          );
        })}

        {selectedCourt && (
          <InfoWindow
            position={{
              lat: selectedCourt.lat,
              lng: selectedCourt.lng,
            }}
            onCloseClick={() => setSelectedCourt(null)}
          >
            <div className="p-2 max-w-xs">
              <img 
                src={selectedCourt.image} 
                className="w-full h-24 object-cover rounded-md mb-2" 
                alt={selectedCourt.courtName} 
              />
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                🏸 {selectedCourt.courtName}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                <MapPin className="h-3 w-3" />
                <span>{selectedCourt.district}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold">{selectedCourt.rating}</span>
                </div>
                <span className="text-xs font-bold text-green-600">
                  {selectedCourt.pricePerHour.toLocaleString()}đ/giờ
                </span>
              </div>
              <div className="mt-2 text-xs">
                <span className="font-bold text-primary">🕐 {selectedCourt.timeSlot}</span>
                <span className="ml-2 text-orange-600 font-bold">
                  🔥 {selectedCourt.availableSpots} chỗ
                </span>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
  );
}
