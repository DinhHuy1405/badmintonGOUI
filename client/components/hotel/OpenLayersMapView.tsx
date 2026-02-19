import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';
import { CourtSlot } from '@/lib/mock-data';
import { Star, MapPin } from 'lucide-react';

interface OpenLayersMapViewProps {
  courts: CourtSlot[];
  activeCourtId?: string | null;
  onPinClick?: (id: string) => void;
}

const getMarkerColor = (level: string, isActive: boolean) => {
  if (isActive) return [22, 163, 74]; // green
  
  switch(level) {
    case 'Yếu': return [34, 197, 94]; // green
    case 'TB': return [59, 130, 246]; // blue
    case 'Khá': return [249, 115, 22]; // orange
    case 'Mọi trình độ': return [168, 85, 247]; // purple
    default: return [34, 197, 94];
  }
};

export function OpenLayersMapView({ courts, activeCourtId, onPinClick }: OpenLayersMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [selectedCourt, setSelectedCourt] = useState<CourtSlot | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create vector source for markers
    const vectorSource = new VectorSource();

    // Add markers for each court
    courts.forEach((court) => {
      const marker = new Feature({
        geometry: new Point(fromLonLat([court.lng, court.lat])),
        court: court,
      });

      const color = getMarkerColor(court.skillLevel, activeCourtId === court.id);
      marker.setStyle(
        new Style({
          image: new Circle({
            radius: activeCourtId === court.id ? 10 : 8,
            fill: new Fill({ color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)` }),
            stroke: new Stroke({ color: 'white', width: 2 }),
          }),
        })
      );

      vectorSource.addFeature(marker);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Create the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([108.2022, 16.0544]), // Da Nang center
        zoom: 12,
        minZoom: 11,
        maxZoom: 18,
      }),
    });

    mapInstanceRef.current = map;

    // Create popup overlay
    const popup = popupRef.current;
    if (popup) {
      const overlay = new Overlay({
        element: popup,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10],
      });
      map.addOverlay(overlay);

      // Handle click on map
      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
        
        if (feature) {
          const court = feature.get('court') as CourtSlot;
          setSelectedCourt(court);
          overlay.setPosition(evt.coordinate);
          onPinClick?.(court.id);
        } else {
          setSelectedCourt(null);
          overlay.setPosition(undefined);
        }
      });

      // Change cursor on hover
      map.on('pointermove', (evt) => {
        const hit = map.hasFeatureAtPixel(evt.pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      });
    }

    return () => {
      map.setTarget(undefined);
    };
  }, [courts, activeCourtId, onPinClick]);

  // Pan to active court
  useEffect(() => {
    if (activeCourtId && mapInstanceRef.current) {
      const court = courts.find((c) => c.id === activeCourtId);
      if (court) {
        const view = mapInstanceRef.current.getView();
        view.animate({
          center: fromLonLat([court.lng, court.lat]),
          zoom: 15,
          duration: 500,
        });
      }
    }
  }, [activeCourtId, courts]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Popup */}
      <div ref={popupRef} className="absolute">
        {selectedCourt && (
          <div className="bg-white rounded-lg shadow-2xl p-3 max-w-xs transform -translate-x-1/2 mb-2">
            <button
              onClick={() => setSelectedCourt(null)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>
            
            <img 
              src={selectedCourt.image} 
              className="w-full h-24 object-cover rounded-md mb-2" 
              alt={selectedCourt.courtName} 
            />
            
            <h4 className="text-sm font-bold text-slate-900 mb-1 pr-4">
              🏸 {selectedCourt.courtName}
            </h4>
            
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
              <MapPin className="h-3 w-3" />
              <span>{selectedCourt.district}</span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">{selectedCourt.rating}</span>
              </div>
              <span className="text-xs font-bold text-green-600">
                {selectedCourt.pricePerHour}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="bg-primary/10 rounded px-1.5 py-1 text-center">
                <div className="font-semibold text-primary">⏰ {selectedCourt.timeSlot}</div>
              </div>
              <div className="bg-blue-50 rounded px-1.5 py-1 text-center">
                <div className="font-semibold text-blue-600">🎯 {selectedCourt.skillLevel}</div>
              </div>
              <div className="bg-orange-50 rounded px-1.5 py-1 text-center">
                <div className="font-semibold text-orange-600">🔥 {selectedCourt.availableSpots}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs z-10">
        <div className="font-semibold mb-2">Trình độ:</div>
        <div className="space-y-1.5">
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
