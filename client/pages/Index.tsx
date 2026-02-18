import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/hotel/SearchBar";
import { FilterSidebar } from "@/components/hotel/FilterSidebar";
import { HotelCard } from "@/components/hotel/HotelCard";
import { CompactHotelCard } from "@/components/hotel/CompactHotelCard";
import { MapComponent } from "@/components/hotel/MapComponent";
import { MOCK_HOTELS } from "@/lib/mock-data";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Map, List, SlidersHorizontal, X, ArrowLeft, RefreshCcw, Star, DollarSign, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Index() {
  const [view, setView] = useState<"list" | "split" | "map">("list");
  const [sortBy, setSortBy] = useState("Recommended");
  const [activeHotelId, setActiveHotelId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const sortOptions = ["Recommended", "Price (lowest first)", "Star rating (highest first)", "Guest rating"];

  // Handle hotel selection from map
  const handlePinClick = (id: string) => {
    setActiveHotelId(id);
    // On split view, scroll the card into view
    if (view === "split") {
      const element = document.getElementById(`hotel-card-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    // On full map view mobile, scroll carousel
    if (view === "map" && carouselRef.current) {
      const element = document.getElementById(`carousel-card-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Full Screen Map View Overlay */}
        {view === "map" && (
          <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Map Header Overlay (Floating) */}
            <div className="absolute top-4 left-4 right-4 z-[70] flex flex-col gap-3 pointer-events-none">
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <Button variant="white" size="icon" onClick={() => setView("list")} className="rounded-full shadow-xl h-10 w-10 border-none">
                    <ArrowLeft className="h-5 w-5 text-slate-700" />
                  </Button>
                  <div className="bg-white px-4 py-2 rounded-full shadow-xl border-none flex items-center gap-2 h-10">
                    <span className="text-sm font-bold text-slate-900">Hanoi, Vietnam</span>
                    <span className="text-xs text-slate-500 font-medium">• {MOCK_HOTELS.length} hotels</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="white" size="icon" onClick={() => setView("split")} className="hidden md:flex rounded-full shadow-xl h-10 w-10 border-none">
                      <List className="h-5 w-5 text-slate-700" />
                   </Button>
                   <Button variant="white" size="icon" onClick={() => setView("list")} className="rounded-full shadow-xl h-10 w-10 border-none">
                      <X className="h-5 w-5 text-slate-700" />
                   </Button>
                </div>
              </div>

              {/* Filter Chips Overlay */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-2">
                <Button variant="white" className="h-8 rounded-full shadow-lg border-none text-[10px] font-bold px-3 gap-1.5 flex shrink-0">
                  <DollarSign className="h-3 w-3" /> Price
                </Button>
                <Button variant="white" className="h-8 rounded-full shadow-lg border-none text-[10px] font-bold px-3 gap-1.5 flex shrink-0">
                  <Star className="h-3 w-3" /> Rating
                </Button>
                <Button variant="white" className="h-8 rounded-full shadow-lg border-none text-[10px] font-bold px-3 gap-1.5 flex shrink-0">
                  <RefreshCcw className="h-3 w-3" /> Filters
                </Button>
              </div>

              {/* Search this area button */}
              <div className="flex justify-center pointer-events-auto mt-2">
                 <Button variant="white" className="rounded-full shadow-xl border-none font-bold text-xs h-9 px-6 gap-2 text-primary">
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Search this area
                 </Button>
              </div>
            </div>

            <div className="flex-1 relative">
              <MapComponent hotels={MOCK_HOTELS} activeHotelId={activeHotelId} onPinClick={handlePinClick} />
              
              {/* Desktop Side Results Overlay */}
              <div className="absolute top-24 left-4 bottom-28 w-[320px] hidden md:block overflow-y-auto no-scrollbar space-y-3 pointer-events-none">
                <div className="space-y-3 pointer-events-auto pb-4">
                  {MOCK_HOTELS.map((hotel) => (
                    <div key={hotel.id} id={`map-card-${hotel.id}`}>
                       <CompactHotelCard 
                        hotel={hotel} 
                        isActive={activeHotelId === hotel.id}
                        onClick={() => handlePinClick(hotel.id)}
                       />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Carousel Overlay */}
              <div className="absolute bottom-6 left-0 right-0 z-[70] pointer-events-none">
                <div 
                  ref={carouselRef}
                  className="flex gap-3 overflow-x-auto px-6 no-scrollbar snap-x pointer-events-auto pb-2"
                >
                   {MOCK_HOTELS.map((hotel) => (
                    <div 
                      key={hotel.id} 
                      id={`carousel-card-${hotel.id}`}
                      className="snap-center shrink-0"
                    >
                       <CompactHotelCard 
                        hotel={hotel} 
                        variant="carousel"
                        isActive={activeHotelId === hotel.id}
                        onClick={() => handlePinClick(hotel.id)}
                       />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List & Split View */}
        <div className={cn("flex-1 flex flex-col", view === "split" && "overflow-hidden h-[calc(100vh-64px)]")}>
          {/* Search Section (only in list view) */}
          {view === "list" && (
            <div className="bg-primary py-10 px-4 shrink-0">
              <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">Hotels in Hanoi</h1>
                <SearchBar />
              </div>
            </div>
          )}

          <div className={cn(
            "container mx-auto flex-1 flex flex-col lg:flex-row gap-0 lg:gap-8",
            view === "list" ? "py-8 px-4" : "p-0 max-w-none"
          )}>
            {/* Desktop Sidebar (only in list view) */}
            {view === "list" && (
              <div className="hidden lg:block w-72 shrink-0">
                <FilterSidebar onMapView={() => setView("split")} />
              </div>
            )}

            {/* Main Content Area */}
            <div className={cn(
              "flex-1 flex flex-col",
              view === "split" ? "lg:flex-row h-full" : "space-y-6"
            )}>
              {/* List Section Area */}
              <div className={cn(
                "flex-1 flex flex-col",
                view === "split" ? "lg:w-[450px] xl:w-[500px] lg:shrink-0 bg-white border-r overflow-y-auto no-scrollbar" : "space-y-6"
              )}>
                {/* Header in Split View */}
                {view === "split" && (
                  <div className="p-4 border-b bg-white sticky top-0 z-10 flex items-center justify-between">
                    <div className="flex flex-col">
                       <h2 className="text-lg font-bold">Hanoi</h2>
                       <p className="text-xs text-slate-500">{MOCK_HOTELS.length} hotels found</p>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={() => setView("map")} className="rounded-lg gap-2 h-9 font-bold">
                          <Map className="h-4 w-4" />
                          Full map
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => setView("list")} className="rounded-full h-9 w-9">
                          <X className="h-5 w-5" />
                       </Button>
                    </div>
                  </div>
                )}

                {/* Toolbar (only in list view) */}
                {view === "list" && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {sortOptions.map((option) => (
                        <Button
                          key={option}
                          variant={sortBy === option ? "secondary" : "ghost"}
                          size="sm"
                          className={`h-9 px-4 rounded-full text-xs font-bold transition-all ${
                            sortBy === option ? "bg-primary/10 text-primary border-primary/20" : "text-slate-600"
                          }`}
                          onClick={() => setSortBy(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 border-l pl-4 border-slate-200">
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                        <Button
                          variant={view === "list" ? "white" : "ghost"}
                          size="icon"
                          className={cn("h-8 w-8 rounded-md", view === "list" && "bg-white shadow-sm")}
                          onClick={() => setView("list")}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={view === "split" ? "white" : "ghost"}
                          size="icon"
                          className={cn("h-8 w-8 rounded-md", view === "split" && "bg-white shadow-sm")}
                          onClick={() => setView("split")}
                        >
                          <Map className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" className="lg:hidden h-10 gap-2 font-bold px-4 rounded-lg">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] overflow-y-auto">
                          <div className="py-4">
                            <FilterSidebar onMapView={() => setView("split")} />
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>
                )}

                {/* Hotel Cards List */}
                <div className={cn(
                  "flex flex-col gap-4",
                  view === "list" ? "" : "p-4"
                )}>
                  {MOCK_HOTELS.map((hotel) => (
                    <div key={hotel.id} id={`hotel-card-${hotel.id}`}>
                       <HotelCard 
                        hotel={hotel} 
                        isActive={activeHotelId === hotel.id}
                        onMouseEnter={() => setActiveHotelId(hotel.id)}
                        onMouseLeave={() => setActiveHotelId(null)}
                        onShowOnMap={() => setView("split")}
                      />
                    </div>
                  ))}
                  
                  {view === "list" && (
                    <div className="flex justify-center pt-8 pb-12">
                      <Button variant="outline" size="lg" className="px-12 font-bold h-12 rounded-xl border-slate-300 hover:bg-slate-100">
                        Load more results
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Section in Split View */}
              {view === "split" && (
                <div className="hidden lg:block flex-1 relative bg-slate-100">
                   <MapComponent 
                    hotels={MOCK_HOTELS} 
                    activeHotelId={activeHotelId}
                    onPinClick={handlePinClick}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {view === "list" && <Footer />}
      
      {/* Floating Map Button for mobile */}
      {view === "list" && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 lg:hidden">
          <Button 
            onClick={() => setView("map")}
            className="rounded-full shadow-2xl px-6 h-12 gap-2 font-bold bg-slate-900 text-white hover:bg-slate-800"
          >
            <Map className="h-5 w-5" />
            Show map
          </Button>
        </div>
      )}
    </div>
  );
}
