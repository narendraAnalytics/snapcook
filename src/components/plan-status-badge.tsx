"use client";

import { useState, useEffect } from "react";
import { Crown, Star, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

type PlanType = "free" | "pro" | "max";

interface PlanConfig {
  name: string;
  icon: React.ReactNode;
  colors: {
    bg: string;
    text: string;
    border: string;
    glow: string;
  };
  animation: string;
}

const planConfigs: Record<PlanType, PlanConfig> = {
  free: {
    name: "Free",
    icon: <Star className="w-3 h-3" />,
    colors: {
      bg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      text: "text-white",
      border: "border-emerald-400",
      glow: "shadow-emerald-500/50"
    },
    animation: "animate-pulse"
  },
  pro: {
    name: "Pro",
    icon: <Sparkles className="w-3 h-3" />,
    colors: {
      bg: "bg-gradient-to-r from-orange-500 to-red-500",
      text: "text-white",
      border: "border-orange-400",
      glow: "shadow-orange-500/50"
    },
    animation: "animate-bounce"
  },
  max: {
    name: "Max",
    icon: <Crown className="w-3 h-3" />,
    colors: {
      bg: "bg-gradient-to-r from-purple-500 to-pink-500",
      text: "text-white",
      border: "border-purple-400",
      glow: "shadow-purple-500/50"
    },
    animation: "animate-pulse"
  }
};

export default function PlanStatusBadge() {
  const { user } = useUser();
  const [currentPlan, setCurrentPlan] = useState<PlanType>("free");
  const [isVisible, setIsVisible] = useState(false);

  // Fetch actual user plan from database
  useEffect(() => {
    if (user) {
      const fetchUserPlan = async () => {
        try {
          const response = await fetch('/api/user-plan');
          if (response.ok) {
            const { plan } = await response.json();
            setCurrentPlan(plan as PlanType);
          } else {
            setCurrentPlan("free"); // Default fallback
          }
        } catch (error) {
          console.error('Error fetching user plan:', error);
          setCurrentPlan("free"); // Default fallback
        }
      };
      
      fetchUserPlan();
      
      // Animate in after a brief delay
      setTimeout(() => setIsVisible(true), 300);
    }
  }, [user]);

  // Function to handle real plan upgrades
  const handlePlanUpgrade = async (newPlan: PlanType) => {
    try {
      const response = await fetch('/api/update-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: newPlan }),
      });

      if (response.ok) {
        const { plan } = await response.json();
        setCurrentPlan(plan);
        toast.success(`🎉 Successfully upgraded to ${plan.toUpperCase()} plan!`);
      } else {
        toast.error("❌ Failed to upgrade plan. Please try again.");
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error("❌ Failed to upgrade plan. Please try again.");
    }
  };

  const handlePlanClick = () => {
    if (currentPlan === "free") {
      toast.info("✨ Upgrade to Pro for more recipes and features!", {
        action: {
          label: "Upgrade",
          onClick: () => handlePlanUpgrade("pro")
        }
      });
    } else if (currentPlan === "pro") {
      toast.info("👑 Upgrade to Max for unlimited access!", {
        action: {
          label: "Upgrade",
          onClick: () => handlePlanUpgrade("max")
        }
      });
    } else {
      toast.success("👑 You're on the Max plan - enjoying unlimited access!");
    }
  };

  if (!user || !isVisible) return null;

  const config = planConfigs[currentPlan];

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      <Badge 
        variant="outline"
        onClick={handlePlanClick}
        className={`
          ${config.colors.bg} ${config.colors.text} ${config.colors.border}
          border-2 backdrop-blur-sm shadow-lg ${config.colors.glow}
          px-3 py-1 text-xs font-semibold uppercase tracking-wide
          hover:scale-110 hover:rotate-1 transition-all duration-300 cursor-pointer
          relative overflow-hidden group hover:shadow-2xl hover:brightness-110
          transform-gpu
        `}
      >
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm bg-gradient-to-r from-white/30 to-white/30"></div>
        
        {/* Content */}
        <div className={`flex items-center gap-1.5 relative z-10 ${config.animation}`}>
          {config.icon}
          <span>
            {currentPlan === "free" ? (
              <>
                {config.name}
                <span className="ml-1 text-yellow-200 font-bold animate-pulse">
                  [UPGRADE TO PRO]
                </span>
              </>
            ) : (
              config.name
            )}
          </span>
        </div>
        
        {/* Sparkle effects for max plan */}
        {currentPlan === "max" && (
          <>
            <div className="absolute -top-1 -right-1">
              <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <div className="absolute -bottom-1 -left-1">
              <div className="w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
            </div>
          </>
        )}
        
        {/* Pro plan glow effect */}
        {currentPlan === "pro" && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 to-red-400/20 blur-sm animate-pulse"></div>
        )}
      </Badge>
    </div>
  );
}