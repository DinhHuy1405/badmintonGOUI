import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, Globe, Trophy, Users, CalendarDays, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [activeTab, setActiveTab] = useState("slots");

  const navItems = [
    { id: "slots", label: "Kèo vãng lai", icon: Users, path: "/" },
    { id: "courts", label: "Tìm sân", icon: Trophy, path: "/courts" },
    { id: "events", label: "Giải đấu", icon: CalendarDays, path: "/events" },
    { id: "stats", label: "Phân tích", icon: BarChart3, path: "/analytics" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-1.5">
            <div className="bg-primary text-white font-black italic px-2 py-0.5 rounded flex items-center justify-center transform -skew-x-12">
               GO
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Badminton Go</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  activeTab === item.id
                    ? "bg-slate-100 text-primary"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2 font-bold text-slate-600">
              <Globe className="h-4 w-4" />
              <span>VN</span>
            </Button>
            <Button className="gap-2 font-bold rounded-xl px-6">
              <User className="h-4 w-4" />
              <span>Đăng nhập</span>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="flex items-center gap-3 text-lg font-bold p-3 hover:bg-slate-50 rounded-xl"
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    {item.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <Button variant="outline" className="justify-start gap-3 h-12 rounded-xl font-bold">
                  <Globe className="h-5 w-5" />
                  Ngôn ngữ
                </Button>
                <Button className="justify-start gap-3 h-12 rounded-xl font-bold">
                  <User className="h-5 w-5" />
                  Đăng nhập
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
