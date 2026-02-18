import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [destination, setDestination] = useState("Hanoi");
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date(2026, 1, 25));
  const [checkOut, setCheckOut] = useState<Date | undefined>(new Date(2026, 1, 26));
  const [guests, setGuests] = useState({ adults: 2, rooms: 1 });

  return (
    <div className="w-full bg-white shadow-2xl rounded-2xl p-2 flex flex-col lg:flex-row gap-0 border border-slate-200 items-stretch">
      <div className="flex-1 flex flex-col p-3 hover:bg-slate-50 transition-colors rounded-xl lg:rounded-none lg:rounded-l-xl border-b lg:border-b-0 lg:border-r border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Destination</label>
        <div className="relative">
          <MapPin className="absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full pl-7 h-8 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-400"
            placeholder="Where do you want to stay?"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3 hover:bg-slate-50 transition-colors border-b lg:border-b-0 lg:border-r border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Check-in</label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 w-full text-left focus:outline-none">
              <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-bold text-slate-900">
                {checkIn ? format(checkIn, "dd MMM yyyy") : "Pick a date"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 flex flex-col p-3 hover:bg-slate-50 transition-colors border-b lg:border-b-0 lg:border-r border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Check-out</label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 w-full text-left focus:outline-none">
              <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-bold text-slate-900">
                {checkOut ? format(checkOut, "dd MMM yyyy") : "Pick a date"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 flex flex-col p-3 hover:bg-slate-50 transition-colors border-b lg:border-b-0 lg:border-r border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Guests & Rooms</label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 w-full text-left focus:outline-none">
              <Users className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-bold text-slate-900">
                {guests.adults} adults, {guests.rooms} room
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4 p-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">Adults</p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setGuests({ ...guests, adults: Math.max(1, guests.adults - 1) })}
                  >
                    -
                  </Button>
                  <span className="w-4 text-center font-bold">{guests.adults}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setGuests({ ...guests, adults: guests.adults + 1 })}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">Rooms</p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setGuests({ ...guests, rooms: Math.max(1, guests.rooms - 1) })}
                  >
                    -
                  </Button>
                  <span className="w-4 text-center font-bold">{guests.rooms}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setGuests({ ...guests, rooms: guests.rooms + 1 })}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="p-2 lg:p-3 flex items-center">
        <Button className="w-full lg:w-auto h-full lg:h-14 lg:aspect-square lg:p-0 rounded-xl font-bold gap-2 text-lg shadow-lg hover:scale-105 transition-transform">
          <Search className="h-6 w-6" />
          <span className="lg:hidden">Search</span>
        </Button>
      </div>
    </div>
  );
}
