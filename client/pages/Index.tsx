import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/hotel/SearchBar";
import { FilterSidebar } from "@/components/hotel/FilterSidebar";
import { HotelCard } from "@/components/hotel/HotelCard";
import { MOCK_HOTELS } from "@/lib/mock-data";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Map, List, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Index() {
  const [view, setView] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState("Recommended");

  const sortOptions = ["Recommended", "Price (lowest first)", "Star rating (highest first)", "Guest rating"];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1">
        {/* Search Section */}
        <div className="bg-primary py-12 px-4">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Hotels in Hanoi</h1>
            <SearchBar />
          </div>
        </div>

        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 shrink-0">
              <FilterSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
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

                <div className="flex items-center gap-2 border-l pl-2 sm:pl-4 border-slate-200">
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <Button
                      variant={view === "list" ? "white" : "ghost"}
                      size="icon"
                      className={`h-8 w-8 rounded-md ${view === "list" ? "bg-white shadow-sm" : ""}`}
                      onClick={() => setView("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={view === "map" ? "white" : "ghost"}
                      size="icon"
                      className={`h-8 w-8 rounded-md ${view === "map" ? "bg-white shadow-sm" : ""}`}
                      onClick={() => setView("map")}
                    >
                      <Map className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Mobile Filters Trigger */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden h-10 gap-2 font-bold px-4 rounded-lg">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] overflow-y-auto">
                      <div className="py-4">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Stats & Info */}
              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-medium text-slate-500">
                  <span className="font-bold text-slate-900">{MOCK_HOTELS.length}</span> hotels found in Hanoi
                </p>
              </div>

              {/* Hotel List */}
              <div className="space-y-4">
                {view === "list" ? (
                  MOCK_HOTELS.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))
                ) : (
                  <div className="bg-slate-200 rounded-2xl h-[600px] flex items-center justify-center border-2 border-dashed border-slate-300">
                    <div className="text-center space-y-4">
                      <Map className="h-12 w-12 text-slate-400 mx-auto" />
                      <p className="text-slate-500 font-medium text-lg">Interactive Map View Placeholder</p>
                      <Button onClick={() => setView("list")} variant="outline">Switch to List View</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Load More */}
              {view === "list" && (
                <div className="flex justify-center pt-8 pb-12">
                  <Button variant="outline" size="lg" className="px-12 font-bold h-12 rounded-xl border-slate-300 hover:bg-slate-100">
                    Load more results
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
