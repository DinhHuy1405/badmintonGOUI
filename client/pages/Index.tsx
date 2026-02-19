import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/hotel/SearchBar";
import { FilterSidebar } from "@/components/hotel/FilterSidebar";
import { CourtCard } from "@/components/hotel/CourtCard";
import { CompactCourtCard } from "@/components/hotel/CompactCourtCard";
import { OpenLayersMapView } from "@/components/hotel/OpenLayersMapView";
import { FacebookGroupList } from "@/components/hotel/FacebookGroupList";
import { MOCK_COURTS } from "@/lib/mock-data";
import { useParsedMatches, transformMatchToCourtCard } from "@/hooks/use-parsed-matches";
import { useBackendMatches, transformBackendMatchToUI, useBackendFbGroups, broadSkillCategory } from "@/hooks/use-backend-api";
import { useState, useRef, useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, List, SlidersHorizontal, X, ArrowLeft, RefreshCcw, DollarSign, Award, SearchX, ChevronDown, ChevronUp, LayoutGrid, Rows3 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export default function Index() {
  const [view, setView] = useState<"list" | "split" | "map">("list");
  const [cardLayout, setCardLayout] = useState<"grid-3" | "single">("single");
  const [sortBy, setSortBy] = useState("Gần nhất");
  const [activeId, setActiveId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [filterCollapsed, setFilterCollapsed] = useState(true);

  // Load data from both backend API and parsed JSON
  const { data: parsedData, loading: jsonLoading, error: jsonError } = useParsedMatches();
  const { matches: backendMatches, courts: backendCourts, fbGroupsMap: backendFbGroupsMap, loading: apiLoading, error: apiError } = useBackendMatches();
  const { groups: fbGroups } = useBackendFbGroups();
  
  // Only block UI on JSON loading failure; backend error is non-blocking (we fallback to JSON)
  const loading = jsonLoading;
  const error = jsonError; // Only JSON error blocks UI; apiError is shown as a warning only

  // Filter States
  const [destination, setDestination] = useState("Đà Nẵng");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeStart, setTimeStart] = useState("Tất cả");
  const [skillLevel, setSkillLevel] = useState("Tất cả");
  const [sidebarSkillLevels, setSidebarSkillLevels] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const sortOptions = ["Gần nhất", "Giá thấp nhất", "Trình độ", "Đánh giá cao"];

  // Transform backend matches (from API)
  const backendMatchesUI = useMemo(() => {
    if (!backendMatches.length) return [];
    
    const courtsMap = new Map(backendCourts.map(c => [c.id, c]));
    // Prefer pre-joined map from /matches/full; fallback to separate fbGroups list
    const fbGroupsMap = backendFbGroupsMap.size > 0
      ? backendFbGroupsMap
      : new Map(fbGroups.map(g => [g.fbGroupId, g]));
    
    return backendMatches
      .map(match => {
        const court = match.courtId ? courtsMap.get(match.courtId) : undefined;
        return transformBackendMatchToUI(match, court, fbGroupsMap);
      })
      // ── Data quality: filter out unnamed courts and matches without time ──
      .filter(m => {
        if (!m.courtName || m.courtName === 'Sân không tên' || m.courtName.trim() === '') return false;
        if (m.timeSlot.includes('?')) return false;   // missing start/end time
        return true;
      });
  }, [backendMatches, backendCourts, backendFbGroupsMap, fbGroups]);

  // Transform parsed matches (from JSON file)
  const parsedMatchesUI = useMemo(() => {
    if (!parsedData) return [];
    
    const courtsMap = new Map(parsedData.courts.map(c => [c.id, c]));
    
    return parsedData.matches.map(match => {
      const court = courtsMap.get(match.courtId);
      return transformMatchToCourtCard(match, court);
    });
  }, [parsedData]);

  // Combine: Backend API first (real-time), then JSON (fallback), then mock data
  const allCourts = useMemo(() => {
    // Priority: Backend > JSON > Mock
    if (backendMatchesUI.length > 0) {
      console.log('✅ Using backend API data:', backendMatchesUI.length, 'matches');
      return backendMatchesUI;               // real data only, no mock pollution
    } else if (parsedMatchesUI.length > 0) {
      console.log('📄 Using JSON file data:', parsedMatchesUI.length, 'matches');
      return parsedMatchesUI;                // real data only, no mock pollution
    } else {
      console.log('🔄 Using mock data only');
      return MOCK_COURTS;
    }
  }, [backendMatchesUI, parsedMatchesUI]);

  // Unique cities from backend courts (drives the Vị trí select)
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    backendCourts.forEach(c => { if (c.city) citySet.add(c.city); });
    if (citySet.size === 0) citySet.add('Đà Nẵng');
    return Array.from(citySet).sort();
  }, [backendCourts]);

  const filteredCourts = useMemo(() => {
    let result = [...allCourts];

    // Location Filter — skip for Đà Nẵng / Tất cả (all courts are there)
    if (destination && destination !== 'Tất cả' && destination.toLowerCase() !== 'đà nẵng' && destination.toLowerCase() !== 'da nang') {
      const query = destination.toLowerCase();
      result = result.filter(c => 
        c.courtName.toLowerCase().includes(query) || 
        c.district.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query)
      );
    }

    // Skill Level Filter (from SearchBar or Sidebar)
    // Use broad category matching: fine-grained labels like "TB+" match broad filter "TB"
    if (skillLevel !== "Tất cả") {
      result = result.filter(c => {
        const labels = ('skillLevels' in c && c.skillLevels) ? c.skillLevels : [c.skillLevel];
        const broadLabels = labels.map(broadSkillCategory);
        return broadLabels.includes(skillLevel as any) || c.skillLevel === "Mọi trình độ";
      });
    }
    if (sidebarSkillLevels.length > 0) {
      result = result.filter(c => {
        const labels = ('skillLevels' in c && c.skillLevels) ? c.skillLevels : [c.skillLevel];
        const broadLabels = labels.map(broadSkillCategory);
        return sidebarSkillLevels.some(sl => broadLabels.includes(sl as any)) || c.skillLevel === "Mọi trình độ";
      });
    }

    // District Filter
    if (districts.length > 0) {
      result = result.filter(c => districts.includes(c.district));
    }

    // Price Filter — pricePerHour now stores pricePerPlayer directly
    result = result.filter(c => {
      if (c.pricePerHour === 0) return true; // giá 0 = liên hệ, luôn hiển thị
      return c.pricePerHour >= priceRange[0] && c.pricePerHour <= priceRange[1];
    });

    // Date Filter — exact match on YYYY-MM-DD (c.date is already normalized in transform)
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      result = result.filter(c => !c.date || c.date.slice(0, 10) === dateStr);
    }

    // Time Filter — filter by start_time: show matches starting at or after selected time
    if (timeStart && timeStart !== 'Tất cả') {
      result = result.filter(c => {
        const courtStart = c.timeSlot.split(' - ')[0]?.trim();
        if (!courtStart || courtStart === '?') return true; // unknown time → always show
        return courtStart >= timeStart; // HH:mm string comparison works correctly
      });
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
  }, [allCourts, destination, skillLevel, sidebarSkillLevels, districts, priceRange, amenities, sortBy, date, timeStart]);

  const handleClearFilters = () => {
    setSidebarSkillLevels([]);
    setDistricts([]);
    setPriceRange([0, 500000]);
    setAmenities([]);
    setSkillLevel("Tất cả");
    setDate(undefined);
    setTimeStart("Tất cả");
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

      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-slate-600">Đang tải dữ liệu...</p>
            {backendMatches.length > 0 && (
              <p className="text-sm text-slate-500">
                ✅ {backendMatches.length} trận đấu từ Backend API
              </p>
            )}
            {parsedData && !backendMatches.length && (
              <p className="text-sm text-slate-500">
                📄 {parsedData.metadata.totalMatches} trận đấu từ JSON
              </p>
            )}
          </div>
        </div>
      )}

      {/* backend error is non-blocking; removed the persistent offline banner */}

      {/* Main Content - Show when data loaded (backend error is non-blocking) */}
      {!loading && (
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
              <OpenLayersMapView courts={filteredCourts} activeCourtId={activeId} onPinClick={handlePinClick} />
              
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
                  timeStart={timeStart}
                  setTimeStart={setTimeStart}
                  cities={cities}
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
                <div className="pr-4 space-y-4">
                  <Collapsible open={!filterCollapsed} onOpenChange={(open) => setFilterCollapsed(!open)}>
                    <div className="bg-white rounded-lg shadow-sm border">
                      <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="h-4 w-4 text-primary" />
                          <h3 className="font-bold text-sm">Lọc kết quả</h3>
                        </div>
                        {filterCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4">
                          <FilterSidebar {...commonSidebarProps} />
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                  <FacebookGroupList groups={fbGroups} />
                </div>
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
                       <h2 className="text-lg font-bold">{destination || "Đà Nẵng"}</h2>
                       <p className="text-xs text-slate-500">{filteredCourts.length} kèo chơi tìm thấy</p>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={() => setView("map")} className="rounded-lg gap-2 h-9 font-bold">
                          <MapIcon className="h-4 w-4" />
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
                      <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1 gap-1 mr-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("h-8 w-8 rounded-md", cardLayout === "grid-3" && "bg-white shadow-sm")}
                          onClick={() => setCardLayout("grid-3")}
                          title="3 cột"
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("h-8 w-8 rounded-md", cardLayout === "single" && "bg-white shadow-sm")}
                          onClick={() => setCardLayout("single")}
                          title="1 cột"
                        >
                          <Rows3 className="h-4 w-4" />
                        </Button>
                      </div>
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
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-md"
                          onClick={() => setView("split")}
                        >
                          <MapIcon className="h-4 w-4" />
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

                <div className={cn(
                  "gap-4",
                  view === "list" ? (
                    cardLayout === "grid-3" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" :
                    "flex flex-col"
                  ) : "flex flex-col gap-4 p-4"
                )}>
                  {filteredCourts.length > 0 ? (
                    filteredCourts.map((court) => (
                      <div key={court.id} id={`court-card-${court.id}`}>
                        <CourtCard 
                          court={court} 
                          isActive={activeId === court.id}
                          onMouseEnter={() => setActiveId(court.id)}
                          onMouseLeave={() => setActiveId(null)}
                          onShowOnMap={() => setView("split")}
                          compact={view === "list" && cardLayout === "grid-3"}
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
                   <OpenLayersMapView 
                    courts={filteredCourts} 
                    activeCourtId={activeId}
                    onPinClick={handlePinClick}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      )}

      {view === "list" && !loading && <Footer />}
      
      {view === "list" && !loading && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 lg:hidden">
          <Button onClick={() => setView("map")} className="rounded-full shadow-2xl px-6 h-12 gap-2 font-bold bg-slate-900 text-white hover:bg-slate-800">
            <MapIcon className="h-5 w-5" />
            Bản đồ kèo
          </Button>
        </div>
      )}
    </div>
  );
}
