"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Book, Heart, Contact, CreditCard, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import PlanStatusBadge from "@/components/plan-status-badge";

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [authInProgress, setAuthInProgress] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  // Monitor authentication completion
  useEffect(() => {
    if (isLoaded && isSignedIn && authInProgress) {
      setAuthInProgress(false);
      toast.success("🎉 Welcome! You're ready to create amazing recipes!");
    }
  }, [isLoaded, isSignedIn, authInProgress]);

  const handleAuthStart = () => {
    setAuthInProgress(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const navItems = [
    {
      name: "Home",
      icon: Home,
      sectionId: "home",
      gradient: "from-purple-500 via-pink-500 to-red-500"
    },
    {
      name: "Recipes",
      icon: Book,
      sectionId: "recipes",
      gradient: "from-blue-500 via-cyan-500 to-teal-500"
    },
    {
      name: "Favorites",
      icon: Heart,
      sectionId: "favorites",
      gradient: "from-red-500 via-pink-500 to-rose-500"
    },
    {
      name: "Pricing",
      icon: CreditCard,
      sectionId: "pricing",
      gradient: "from-green-500 via-emerald-500 to-lime-500"
    },
    {
      name: "Contact",
      icon: Contact,
      sectionId: "contact",
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-0 px-6 py-6">
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-orange-400 transition-all duration-500 drop-shadow-lg">
              SnapCook
            </h1>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-pink-400 group-hover:w-full transition-all duration-500"></div>
          </div>
          
          {/* Plan Status Badge - only show when signed in */}
          <SignedIn>
            <PlanStatusBadge />
          </SignedIn>
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
                  relative px-4 py-3 rounded-xl transition-all duration-300 group border-0 shadow-none
                  hover:scale-105 focus:border-0 focus:shadow-none
                `}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => item.sectionId && scrollToSection(item.sectionId)}
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
                    ${isHovered ? 'text-white animate-bounce' : 'text-orange-300'}
                    group-hover:text-white group-hover:drop-shadow-lg
                  `} />
                  <span className={`
                    font-medium transition-all duration-300
                    ${isHovered ? 'text-white' : 'text-orange-300'}
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
        <div className="hidden md:flex">
          <SignedOut>
            <SignInButton 
              mode="modal"
              forceRedirectUrl="/"
              signUpForceRedirectUrl="/"
            >
              <Button 
                onClick={handleAuthStart}
                className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl border-0 shadow-none focus:border-0 focus:shadow-none transition-all duration-300 hover:scale-105"
                disabled={authInProgress}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {authInProgress ? "Setting Up..." : "Get Started"}
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 hover:scale-105 transition-all duration-300"
                }
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          className="md:hidden p-2 text-orange-300 hover:text-white border-0 shadow-none focus:border-0 focus:shadow-none"
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