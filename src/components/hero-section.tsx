"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Sparkles, ArrowRight, ChefHat } from "lucide-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { SignedIn, SignedOut, useUser, SignInButton, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HeroSection() {
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Loading state for navigation
  const [isLoading, setIsLoading] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);

  // Typewriter effect state
  const words = ["Optimized", "Simplified", "Perfected", "Enhanced", "Organized", "Streamlined"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Typewriter effect
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          // Word complete, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Word deleted, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

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

  // Handle navigation to dashboard with loading state
  const handleDashboardNavigation = async () => {
    setIsLoading(true);
    try {
      await router.push('/dashboard');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Reset loading state after a small delay to show the animation
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const carouselImages = [
    { src: "/images/BannerImage.png", alt: "SnapCook App Interface" },
    { src: "/images/BannerImage2.jpg", alt: "Woman using cooking app with vegetables" },
    { src: "/images/BannerImage3.jpg", alt: "Happy woman cooking with phone" },
    { src: "/images/BannerImage4.jpg", alt: "Family cooking together with phones" }
  ];

  return (
    <>
      <style jsx>{`
        @keyframes chef-loading {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
          25% {
            transform: rotate(90deg) scale(1.1);
            opacity: 0.9;
          }
          50% {
            transform: rotate(180deg) scale(1.2);
            opacity: 0.8;
          }
          75% {
            transform: rotate(270deg) scale(1.1);
            opacity: 0.9;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
        }
        
        .animate-chef-loading {
          animation: chef-loading 0.8s ease-in-out infinite;
        }
      `}</style>
      <section id="home" className="relative overflow-hidden min-h-[500px]">
      {/* Background Image Carousel */}
      <div className="absolute -top-20 left-0 right-0 z-0" style={{height: 'calc(100% + 80px)'}}>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full h-full"
        >
          <CarouselContent className="h-[720px] gap-0 -ml-0">
            {carouselImages.map((image, index) => (
              <CarouselItem key={index} className="h-[720px] basis-full pl-0 shrink-0">
                <div className="relative w-full h-full min-h-[720px] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    objectFit="cover"
                    objectPosition="center 15%"
                    priority={true}
                    quality={95}
                    sizes="100vw"
                  />
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/70 to-slate-800/80"></div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Background Elements - moved to overlay on carousel */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Centered Content */}
      <div className="relative z-20 container mx-auto px-6 pt-20 pb-0 lg:pt-24 lg:pb-0">
        <div className="flex flex-col items-center justify-center space-y-6">
          
          {/* Centered Content */}
          <div className="space-y-6 text-center max-w-4xl">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-white/90 text-sm font-medium">AI-Powered Cooking</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                  Your Kitchen,
                </span>
                <span className="block bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {currentText}
                  <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/80 max-w-lg leading-relaxed">
                Pantry perfection at your fingertips.
                <span className="block mt-2 text-lg text-white/70">
                  Transform your kitchen management with our intelligent recipe system.
                </span>
              </p>
            </div>

            {/* Call to Action Button */}
            <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <SignedOut>
                <SignInButton 
                  mode="modal"
                  forceRedirectUrl="/"
                  signUpForceRedirectUrl="/"
                >
                  <Button 
                    onClick={handleAuthStart}
                    className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                    disabled={authInProgress}
                  >
                    <ChefHat className="w-5 h-5 mr-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                    {authInProgress ? "Setting Up..." : "Discover Recipes"}
                    {!authInProgress && (
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                    )}
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  onClick={handleDashboardNavigation}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ChefHat className={`w-5 h-5 mr-2 transition-all duration-300 ${
                    isLoading 
                      ? 'animate-chef-loading' 
                      : 'group-hover:rotate-12 group-hover:scale-110'
                  }`} />
                  {isLoading 
                    ? 'Loading Dashboard...' 
                    : `Welcome back, ${user?.firstName || 'Chef'}!`
                  }
                  {!isLoading && (
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                  )}
                </Button>
              </SignedIn>
            </Card>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}