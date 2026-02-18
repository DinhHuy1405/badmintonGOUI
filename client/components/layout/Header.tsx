import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Car, Menu, User, Globe } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [activeTab, setActiveTab] = useState("hotels");

  const navItems = [
    { id: "flights", label: "Flights", icon: Plane, path: "/flights" },
    { id: "hotels", label: "Hotels", icon: Hotel, path: "/" },
    { id: "car-hire", label: "Car Hire", icon: Car, path: "/car-hire" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl font-black text-primary tracking-tighter italic">skyscanner</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
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
            <Button variant="ghost" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              <span>EN</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span>Login</span>
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
                    className="flex items-center gap-3 text-lg font-medium p-2 hover:bg-accent rounded-md"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <Button variant="outline" className="justify-start gap-3">
                  <Globe className="h-5 w-5" />
                  Language
                </Button>
                <Button className="justify-start gap-3">
                  <User className="h-5 w-5" />
                  Login
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
