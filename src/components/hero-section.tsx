"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

export default function HeroSection() {

  const carouselImages = [
    { src: "/images/BannerImage.png", alt: "SnapCook App Interface" },
    { src: "/images/BannerImage2.jpg", alt: "Woman using cooking app with vegetables" },
    { src: "/images/BannerImage3.jpg", alt: "Happy woman cooking with phone" },
    { src: "/images/BannerImage4.jpg", alt: "Family cooking together with phones" }
  ];

  return (
    <section className="relative overflow-hidden min-h-[500px]">
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
          <CarouselContent className="h-[720px]">
            {carouselImages.map((image, index) => (
              <CarouselItem key={index} className="h-[720px] basis-full">
                <div className="relative w-full h-full min-h-[720px]">
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
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Your Kitchen,
                <span className="block bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Optimized.
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
              <Button className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                Discover Recipes
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}