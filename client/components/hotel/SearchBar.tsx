import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, Search, Clock, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { FILTERS } from "@/lib/mock-data";

export function SearchBar({
  destination,
  setDestination,
  date,
  setDate,
  skillLevel,
  setSkillLevel,
  onSearch
}: {
  destination: string;
  setDestination: (val: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  skillLevel: string;
  setSkillLevel: (val: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="w-full bg-white shadow-2xl rounded-2xl p-2 flex flex-col lg:flex-row gap-0 border border-slate-200 items-stretch">
      <div className="flex-1 flex flex-col p-3 hover:bg-slate-50 transition-colors rounded-xl lg:rounded-none lg:rounded-l-xl border-b lg:border-b-0 lg:border-r border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Vị trí</label>
        <div className="relative">
          <MapPin className="absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full pl-7 h-8 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-400"
            placeholder="Tìm theo khu vực (Quận, Phường)"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3 hover:bg-slate-50 transition-colors border-b lg:border-b-0 lg:border-r border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Ngày chơi</label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 w-full text-left focus:outline-none h-8">
              <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-bold text-slate-900">
                {date ? format(date, "dd MMM yyyy") : "Chọn ngày"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 flex flex-col p-3 hover:bg-slate-50 transition-colors border-b lg:border-b-0 lg:border-r border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Trình độ</label>
        <Select value={skillLevel} onValueChange={setSkillLevel}>
          <SelectTrigger className="h-8 border-none bg-transparent p-0 focus:ring-0 shadow-none">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary shrink-0" />
              <SelectValue placeholder="Chọn trình độ" className="text-sm font-bold text-slate-900" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tất cả">Tất cả trình độ</SelectItem>
            {FILTERS.skillLevels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 flex flex-col p-3 hover:bg-slate-50 transition-colors border-b lg:border-b-0 lg:border-r border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Khung giờ</label>
        <div className="flex items-center gap-2 h-8">
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-bold text-slate-900">18:00 - 20:00</span>
        </div>
      </div>

      <div className="p-2 lg:p-3 flex items-center">
        <Button
          onClick={onSearch}
          className="w-full lg:w-auto h-full lg:h-14 lg:aspect-square lg:p-0 rounded-xl font-bold gap-2 text-lg shadow-lg hover:scale-105 transition-transform"
        >
          <Search className="h-6 w-6" />
          <span className="lg:hidden">Tìm kèo ngay</span>
        </Button>
      </div>
    </div>
  );
}
