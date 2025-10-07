"use client";

import { useEffect } from "react";
import { ChefHat, Sparkles, Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RecipeUsageInfoProps {
  recipeCount: number;
  limit: number;
  plan: string;
  onUpgrade?: () => void;
}

export function showRecipeUsageInfo({ recipeCount, limit, plan, onUpgrade }: RecipeUsageInfoProps) {
  const getInfoMessage = () => {
    // For max users, show unlimited message
    if (plan === 'max') {
      return {
        title: "Max Plan Active! 🎉",
        message: "Unlimited recipes at your fingertips!",
        variant: "success" as const
      };
    }

    // For pro users, show detailed usage tracking
    if (plan === 'pro') {
      if (recipeCount === 0) {
        return {
          title: "Welcome to SnapCook Pro! 🎉",
          message: `You're on the Pro plan with ${limit} recipes per month. Start creating amazing recipes!`,
          variant: "success" as const
        };
      } else if (recipeCount < limit) {
        const remaining = limit - recipeCount;
        return {
          title: `Great Progress! ⭐`,
          message: `${recipeCount}/${limit} recipes used. ${remaining} recipe${remaining > 1 ? 's' : ''} remaining this month!`,
          variant: "success" as const
        };
      } else {
        return {
          title: "Pro Recipes Used! 🔥",
          message: `You've created ${recipeCount}/${limit} recipes this month. Upgrade to Max for unlimited recipes!`,
          variant: "warning" as const
        };
      }
    }

    // For free users, show different messages based on usage
    if (recipeCount === 0) {
      return {
        title: "Welcome to SnapCook! 🎉",
        message: `You're on the Free plan with ${limit} recipes per month. Start creating amazing recipes!`,
        variant: "info" as const
      };
    } else if (recipeCount < limit) {
      const remaining = limit - recipeCount;
      return {
        title: `Great Progress! ⭐`,
        message: `${recipeCount}/${limit} recipes used. ${remaining} recipe${remaining > 1 ? 's' : ''} left this month!`,
        variant: "info" as const
      };
    } else {
      return {
        title: "Free Recipes Used! 🔥",
        message: `You've created ${recipeCount}/${limit} recipes this month. Upgrade to Pro for 8 recipes per month!`,
        variant: "warning" as const
      };
    }
  };

  const { title, message, variant } = getInfoMessage();

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Redirect to pricing page for Clerk billing
      toast.info("✨ Upgrade to Pro for more recipes!", {
        description: "Visit the pricing page to upgrade through Clerk billing.",
        action: {
          label: "View Pricing",
          onClick: () => {
            window.location.href = "#pricing";
          }
        }
      });
    }
  };

  // Show the appropriate toast based on the plan and usage
  if (variant === "success") {
    toast.success(title, {
      description: message,
      duration: 3000,
    });
  } else if (variant === "warning") {
    toast.warning(title, {
      description: message,
      duration: 4000,
      action: {
        label: "Upgrade to Pro",
        onClick: handleUpgradeClick
      }
    });
  } else {
    toast.info(title, {
      description: message,
      duration: 3000,
      action: plan === 'free' && recipeCount < limit ? {
        label: "Upgrade to Pro",
        onClick: handleUpgradeClick
      } : undefined
    });
  }
}

// Export the component (even though we're using it as a function)
export default function RecipeUsageInfo(props: RecipeUsageInfoProps) {
  useEffect(() => {
    showRecipeUsageInfo(props);
  }, []);

  return null; // This component doesn't render anything
}