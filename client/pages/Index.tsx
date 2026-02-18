import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/hotel/SearchBar";
import { FilterSidebar } from "@/components/hotel/FilterSidebar";
import { CourtCard } from "@/components/hotel/CourtCard";
import { CompactCourtCard } from "@/components/hotel/CompactCourtCard";
import { MapComponent } from "@/components/hotel/MapComponent";
import { MOCK_COURTS, FILTERS } from "@/lib/mock-data";
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Map, List, SlidersHorizontal, X, ArrowLeft, RefreshCcw, Star, DollarSign, Award, SearchX } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Index() {
  const [view, setView] = useState<"list" | "split" | "map">("list");
  const [sortBy, setSortBy] = useState("Gần nhất");
  const [activeId, setActiveId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter States
  const [destination, setDestination] = useState("Hà Nội");
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 2, 2));
  const [skillLevel, setSkillLevel] = useState("Tất cả");
  const [sidebarSkillLevels, setSidebarSkillLevels] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const sortOptions = ["Gần nhất", "Giá thấp nhất", "Trình độ", "Đánh giá cao"];

  const filteredCourts = useMemo(() => {
    let result = [...MOCK_COURTS];

    // Search Filter
    if (destination) {
      const query = destination.toLowerCase();
      result = result.filter(c => 
        c.courtName.toLowerCase().includes(query) || 
        c.district.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query)
      );
    }

    // Skill Level Filter (from SearchBar or Sidebar)
    if (skillLevel !== "Tất cả") {
      result = result.filter(c => c.skillLevel === skillLevel || c.skillLevel === "Mọi trình độ");
    }
    if (sidebarSkillLevels.length > 0) {
      result = result.filter(c => sidebarSkillLevels.includes(c.skillLevel) || c.skillLevel === "Mọi trình độ");
    }

    // District Filter
    if (districts.length > 0) {
      result = result.filter(c => districts.includes(c.district));
    }

    // Price Filter
    result = result.filter(c => (c.pricePerHour / 2) >= priceRange[0] && (c.pricePerHour / 2) <= priceRange[1]);

    // Amenities Filter
    if (amenities.length > 0) {
      result = result.filter(c => amenities.every(a => c.amenities.includes(a)));
    }

    // Sorting
    switch (sortBy) {
      case "Giá thấp nhất":
        result.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "Trình độ":
        const levelMap: Record<string, number> = { "Yếu": 0, "TB": 1, "Khá": 2, "Mọi trình độ": 3 };
        result.sort((a, b) => levelMap[b.skillLevel] - levelMap[a.skillLevel]);
        break;
      case "Đánh giá cao":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // Gần nhất
        // In real app, distance based sort
        break;
    }

    return result;
  }, [destination, skillLevel, sidebarSkillLevels, districts, priceRange, amenities, sortBy]);

  const handleClearFilters = () => {
    setSidebarSkillLevels([]);
    setDistricts([]);
    setPriceRange([0, 500000]);
    setAmenities([]);
    setSkillLevel("Tất cả");
  };

  const handlePinClick = (id: string) => {
    setActiveId(id);
    if (view === "split") {
      const element = document.getElementById(`court-card-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    if (view === "map" && carouselRef.current) {
      const element = document.getElementById(`carousel-card-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  };

  const commonSidebarProps = {
    onMapView: () => setView("split"),
    skillLevels: sidebarSkillLevels,
    setSkillLevels: setSidebarSkillLevels,
    districts,
    setDistricts,
    priceRange,
    setPriceRange,
    amenities,
    setAmenities,
    onClear: handleClearFilters
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Full Screen Map View Overlay */}
        {view === "map" && (
          <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="absolute top-4 left-4 right-4 z-[70] flex flex-col gap-3 pointer-events-none">
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <Button variant="white" size="icon" onClick={() => setView("list")} className="rounded-full shadow-xl h-10 w-10 border-none">
                    <ArrowLeft className="h-5 w-5 text-slate-700" />
                  </Button>
                  <div className="bg-white px-4 py-2 rounded-full shadow-xl border-none flex items-center gap-2 h-10">
                    <span className="text-sm font-bold text-slate-900">{destination || "Hà Nội"}</span>
                    <span className="text-xs text-slate-500 font-medium">• {filteredCourts.length} kèo</span>
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

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-2">
                <Button variant="white" onClick={handleClearFilters} className="h-8 rounded-full shadow-lg border-none text-[10px] font-bold px-3 gap-1.5 flex shrink-0 text-primary">
                  <RefreshCcw className="h-3 w-3" /> Xóa lọc
                </Button>
                <div className="h-4 w-px bg-slate-300 mx-1" />
                <Button variant="white" className="h-8 rounded-full shadow-lg border-none text-[10px] font-bold px-3 gap-1.5 flex shrink-0">
                  <DollarSign className="h-3 w-3" /> Chi phí
                </Button>
                <Button variant="white" className="h-8 rounded-full shadow-lg border-none text-[10px] font-bold px-3 gap-1.5 flex shrink-0">
                  <Award className="h-3 w-3" /> Trình độ
                </Button>
              </div>
            </div>

            <div className="flex-1 relative">
              <MapComponent courts={filteredCourts} activeId={activeId} onPinClick={handlePinClick} />
              
              <div className="absolute top-24 left-4 bottom-28 w-[320px] hidden md:block overflow-y-auto no-scrollbar space-y-3 pointer-events-none">
                <div className="space-y-3 pointer-events-auto pb-4">
                  {filteredCourts.map((court) => (
                    <div key={court.id} id={`map-card-${court.id}`}>
                       <CompactCourtCard 
                        court={court} 
                        isActive={activeId === court.id}
                        onClick={() => handlePinClick(court.id)}
                       />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-6 left-0 right-0 z-[70] pointer-events-none">
                <div ref={carouselRef} className="flex gap-3 overflow-x-auto px-6 no-scrollbar snap-x pointer-events-auto pb-2">
                   {filteredCourts.map((court) => (
                    <div key={court.id} id={`carousel-card-${court.id}`} className="snap-center shrink-0">
                       <CompactCourtCard 
                        court={court} 
                        variant="carousel"
                        isActive={activeId === court.id}
                        onClick={() => handlePinClick(court.id)}
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
          {view === "list" && (
            <div className="bg-primary py-10 px-4 shrink-0">
              <div className="container mx-auto">
                <SearchBar 
                  destination={destination}
                  setDestination={setDestination}
                  date={date}
                  setDate={setDate}
                  skillLevel={skillLevel}
                  setSkillLevel={setSkillLevel}
                  onSearch={() => {}} // useMemo handles it
                />
              </div>
            </div>
          )}

          <div className={cn(
            "container mx-auto flex-1 flex flex-col lg:flex-row gap-0 lg:gap-8",
            view === "list" ? "py-8 px-4" : "p-0 max-w-none"
          )}>
            {view === "list" && (
              <div className="hidden lg:block w-72 shrink-0">
                <FilterSidebar {...commonSidebarProps} />
              </div>
            )}

            <div className={cn("flex-1 flex flex-col", view === "split" ? "lg:flex-row h-full" : "space-y-6")}>
              <div className={cn(
                "flex-1 flex flex-col",
                view === "split" ? "lg:w-[450px] xl:w-[500px] lg:shrink-0 bg-white border-r overflow-y-auto no-scrollbar" : "space-y-6"
              )}>
                {view === "split" && (
                  <div className="p-4 border-b bg-white sticky top-0 z-10 flex items-center justify-between">
                    <div className="flex flex-col">
                       <h2 className="text-lg font-bold">{destination || "Hà Nội"}</h2>
                       <p className="text-xs text-slate-500">{filteredCourts.length} kèo chơi tìm thấy</p>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={() => setView("map")} className="rounded-lg gap-2 h-9 font-bold">
                          <Map className="h-4 w-4" />
                          Bản đồ
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => setView("list")} className="rounded-full h-9 w-9">
                          <X className="h-5 w-5" />
                       </Button>
                    </div>
                  </div>
                )}

                {view === "list" && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {sortOptions.map((option) => (
                        <Button
                          key={option}
                          variant={sortBy === option ? "secondary" : "ghost"}
                          size="sm"
                          className={cn(
                            "h-9 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                            sortBy === option ? "bg-primary/10 text-primary border-primary/20" : "text-slate-600"
                          )}
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
                            Lọc
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] overflow-y-auto">
                          <div className="py-4">
                            <FilterSidebar {...commonSidebarProps} />
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>
                )}

                <div className={cn("flex flex-col gap-4", view === "list" ? "" : "p-4")}>
                  {filteredCourts.length > 0 ? (
                    filteredCourts.map((court) => (
                      <div key={court.id} id={`court-card-${court.id}`}>
                         <CourtCard 
                          court={court} 
                          isActive={activeId === court.id}
                          onMouseEnter={() => setActiveId(court.id)}
                          onMouseLeave={() => setActiveId(null)}
                          onShowOnMap={() => setView("split")}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-4">
                       <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                          <SearchX className="h-8 w-8 text-slate-400" />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-lg font-bold text-slate-900">Không tìm thấy kèo nào</h3>
                          <p className="text-sm text-slate-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác</p>
                       </div>
                       <Button variant="outline" onClick={handleClearFilters} className="rounded-xl font-bold">
                          Xóa tất cả lọc
                       </Button>
                    </div>
                  )}
                  
                  {filteredCourts.length > 0 && view === "list" && (
                    <div className="flex justify-center pt-8 pb-12">
                      <Button variant="outline" size="lg" className="px-12 font-bold h-12 rounded-xl border-slate-300 hover:bg-slate-100">
                        Xem thêm kèo
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {view === "split" && (
                <div className="hidden lg:block flex-1 relative bg-slate-100">
                   <MapComponent
                    courts={filteredCourts}
                    activeId={activeId}
                    onPinClick={handlePinClick}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {view === "list" && <Footer />}
      
      {view === "list" && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 lg:hidden">
          <Button onClick={() => setView("map")} className="rounded-full shadow-2xl px-6 h-12 gap-2 font-bold bg-slate-900 text-white hover:bg-slate-800">
            <Map className="h-5 w-5" />
            Bản đồ kèo
          </Button>
        </div>
      )}
    </div>
  );
}
