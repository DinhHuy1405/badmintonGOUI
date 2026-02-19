import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Search, Clock, Award } from "lucide-react";
import { FILTERS } from "@/lib/mock-data";

// Time options 05:00 → 22:00 in 30-min steps
const TIME_OPTIONS: string[] = [];
for (let h = 5; h <= 22; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 22) TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:30`);
}

export function SearchBar({
  destination,
  setDestination,
  date,
  setDate,
  skillLevel,
  setSkillLevel,
  timeStart,
  setTimeStart,
  cities,
  onSearch,
}: {
  destination: string;
  setDestination: (val: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  skillLevel: string;
  setSkillLevel: (val: string) => void;
  timeStart: string;
  setTimeStart: (val: string) => void;
  cities: string[];
  onSearch: () => void;
}) {
  const cityList = cities.length > 0 ? cities : ['Đà Nẵng'];

  return (
    <div className="w-full bg-white shadow-2xl rounded-2xl p-2 flex flex-col lg:flex-row gap-0 border border-slate-200 items-stretch">

      {/* Vị trí — city select */}
      <div className="flex-1 flex flex-col p-3 hover:bg-slate-50 transition-colors rounded-xl lg:rounded-none lg:rounded-l-xl border-b lg:border-b-0 lg:border-r border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Vị trí</label>
        <div className="flex items-center gap-2 h-8">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <Select value={destination || cityList[0]} onValueChange={setDestination}>
            <SelectTrigger className="h-8 border-none bg-transparent p-0 focus:ring-0 shadow-none flex-1 text-sm font-bold text-slate-900">
              <SelectValue placeholder="Chọn thành phố" />
            </SelectTrigger>
            <SelectContent>
              {cityList.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ngày chơi */}
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

      {/* Trình độ */}
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

      {/* Khung giờ — chỉ cần chọn giờ bắt đầu */}
      <div className="flex-1 flex flex-col p-3 hover:bg-slate-50 transition-colors border-b lg:border-b-0 lg:border-r border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Khung giờ</label>
        <div className="flex items-center gap-1 h-8">
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <Select value={timeStart} onValueChange={setTimeStart}>
            <SelectTrigger className="h-7 w-[80px] border-none bg-transparent p-0 focus:ring-0 shadow-none text-sm font-bold text-slate-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tất cả">Tất cả</SelectItem>
              {TIME_OPTIONS.map(t => <SelectItem key={`s-${t}`} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-slate-400 text-xs font-bold shrink-0">trở đi</span>
        </div>
      </div>

      {/* Search button */}
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
