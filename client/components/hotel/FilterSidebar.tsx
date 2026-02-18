import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Star, Filter, RotateCcw, MapPin, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FILTERS } from "@/lib/mock-data";
import { useState } from "react";

export function FilterSidebar({ onMapView }: { onMapView?: () => void }) {
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  return (
    <aside className="w-full space-y-6">
      {/* Map Preview */}
      <div
        onClick={onMapView}
        className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="h-32 bg-[url('https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"></div>
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <Button variant="white" className="gap-2 font-bold shadow-xl px-6 rounded-full group-hover:scale-105 transition-transform pointer-events-none">
            <Map className="h-4 w-4" />
            Show on map
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h2>
        <Button variant="ghost" size="sm" className="text-primary h-8 gap-1 p-1">
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900">Price range</h3>
        <Slider
          defaultValue={priceRange}
          max={10000000}
          step={50000}
          onValueChange={setPriceRange}
          className="mt-4"
        />
        <div className="flex justify-between text-sm font-medium text-slate-600">
          <span>{priceRange[0].toLocaleString()} VND</span>
          <span>{priceRange[1].toLocaleString()} VND</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900">Star rating</h3>
        <div className="space-y-3">
          {FILTERS.starRatings.map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <Checkbox id={`star-${rating}`} />
              <label
                htmlFor={`star-${rating}`}
                className="text-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                {rating} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900">Amenities</h3>
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

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900">Meal plan</h3>
        <div className="space-y-3">
          {FILTERS.mealPlans.map((plan) => (
            <div key={plan} className="flex items-center gap-2">
              <Checkbox id={plan} />
              <label
                htmlFor={plan}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {plan}
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
