import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Star, Filter, RotateCcw, MapPin, Map, Award, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FILTERS } from "@/lib/mock-data";
import { useState } from "react";

export function FilterSidebar({ onMapView }: { onMapView?: () => void }) {
  const [priceRange, setPriceRange] = useState([0, 500000]);

  return (
    <aside className="w-full space-y-6">
      {/* Map Preview */}
      <div 
        onClick={onMapView}
        className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="h-32 bg-[url('https://images.unsplash.com/photo-1626224484214-4051d0c21db2?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"></div>
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <Button variant="white" className="gap-2 font-bold shadow-xl px-6 rounded-full group-hover:scale-105 transition-transform pointer-events-none">
            <Map className="h-4 w-4" />
            Xem bản đồ sân
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Lọc kết quả
        </h2>
        <Button variant="ghost" size="sm" className="text-primary h-8 gap-1 p-1">
          <RotateCcw className="h-4 w-4" />
          Xóa
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
          <Award className="h-4 w-4" /> Trình độ
        </h3>
        <div className="space-y-3">
          {FILTERS.skillLevels.map((level) => (
            <div key={level} className="flex items-center gap-2">
              <Checkbox id={level} />
              <label
                htmlFor={level}
                className="text-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
          <Building2 className="h-4 w-4" /> Quận huyện
        </h3>
        <div className="space-y-3">
          {FILTERS.districts.map((district) => (
            <div key={district} className="flex items-center gap-2">
              <Checkbox id={district} />
              <label
                htmlFor={district}
                className="text-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                {district}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Chi phí / người</h3>
        <Slider
          defaultValue={priceRange}
          max={500000}
          step={10000}
          onValueChange={setPriceRange}
          className="mt-4"
        />
        <div className="flex justify-between text-sm font-medium text-slate-600">
          <span>{priceRange[0].toLocaleString()}đ</span>
          <span>{priceRange[1].toLocaleString()}đ</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Tiện ích</h3>
        <div className="space-y-3">
          {FILTERS.amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Checkbox id={amenity} />
              <label
                htmlFor={amenity}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
