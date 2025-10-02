"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Book, Heart, User, Search, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      name: "Home",
      icon: Home,
      href: "/",
      gradient: "from-purple-500 via-pink-500 to-red-500"
    },
    {
      name: "Recipes",
      icon: Book,
      href: "/recipes",
      gradient: "from-blue-500 via-cyan-500 to-teal-500"
    },
    {
      name: "Favorites",
      icon: Heart,
      href: "/favorites",
      gradient: "from-red-500 via-pink-500 to-rose-500"
    },
    {
      name: "Discover",
      icon: Search,
      href: "/discover",
      gradient: "from-green-500 via-emerald-500 to-lime-500"
    },
    {
      name: "Profile",
      icon: User,
      href: "/profile",
      gradient: "from-indigo-500 via-purple-500 to-pink-500"
    }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Animated Logo and Title */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <Image
              src="/images/snapcooklogo.png"
              alt="SnapCook Logo"
              width={50}
              height={50}
              className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg"></div>
          </div>
          
          <div className="relative overflow-hidden">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-orange-400 transition-all duration-500">
              SnapCook
            </h1>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-pink-400 group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredItem === item.name;
            
            return (
              <Button
                key={item.name}
                variant="ghost"
                className={`
                  relative px-4 py-3 rounded-xl transition-all duration-300 group
                  hover:scale-105 hover:shadow-lg
                  ${isHovered ? 'shadow-xl' : ''}
                `}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Background Gradient on Hover */}
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                  bg-gradient-to-r ${item.gradient} transition-all duration-300
                  blur-sm group-hover:blur-none
                `}></div>
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                  <Icon className={`
                    w-5 h-5 transition-all duration-300
                    ${isHovered ? 'text-white animate-bounce' : 'text-white/90'}
                    group-hover:text-white group-hover:drop-shadow-lg
                  `} />
                  <span className={`
                    font-medium transition-all duration-300
                    ${isHovered ? 'text-white' : 'text-white/90'}
                    group-hover:text-white group-hover:drop-shadow-lg
                  `}>
                    {item.name}
                  </span>
                </div>

                {/* Animated Sparkles */}
                {isHovered && (
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  </div>
                )}
              </Button>
            );
          })}
        </div>

        {/* CTA Button */}
        <Button className="hidden md:flex bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Sparkles className="w-4 h-4 mr-2" />
          Get Started
        </Button>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          className="md:hidden p-2 text-white/90 hover:text-white"
          onMouseEnter={() => setHoveredItem("menu")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="relative">
            <div className={`
              space-y-1 transition-all duration-300
              ${hoveredItem === "menu" ? "transform rotate-45" : ""}
            `}>
              <div className={`w-6 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300`}></div>
              <div className={`w-6 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 ${hoveredItem === "menu" ? "opacity-0" : ""}`}></div>
              <div className={`w-6 h-0.5 bg-gradient-to-r from-green-400 to-lime-400 transition-all duration-300`}></div>
            </div>
          </div>
        </Button>
      </div>
    </nav>
  );
}