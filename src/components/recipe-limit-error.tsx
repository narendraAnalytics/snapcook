"use client";

import { useState } from "react";
import { AlertTriangle, Crown, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RecipeLimitErrorProps {
  isOpen: boolean;
  onClose: () => void;
  recipeCount: number;
  limit: number;
  plan: string;
  onUpgrade?: () => void;
}

export default function RecipeLimitError({ 
  isOpen, 
  onClose, 
  recipeCount, 
  limit, 
  plan,
  onUpgrade 
}: RecipeLimitErrorProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (newPlan: string) => {
    setIsUpgrading(true);
    try {
      const response = await fetch('/api/update-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: newPlan }),
      });

      if (response.ok) {
        toast.success(`🎉 Successfully upgraded to ${newPlan.toUpperCase()} plan!`);
        onClose();
        if (onUpgrade) onUpgrade();
      } else {
        toast.error("❌ Failed to upgrade plan. Please try again.");
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error("❌ Failed to upgrade plan. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="relative w-full max-w-md mx-4 bg-white/95 backdrop-blur-md border-2 border-orange-200 shadow-2xl">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                    {recipeCount}/{limit}
                  </Badge>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800">
              Recipe Limit Reached!
            </h2>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              You've created <span className="font-semibold text-orange-600">{recipeCount} recipes</span> on your{" "}
              <span className="font-semibold capitalize">{plan}</span> plan.
              <span className="block mt-1">
                Upgrade to create unlimited amazing recipes!
              </span>
            </p>
          </div>

          {/* Upgrade Options */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Choose your upgrade:
              </p>
            </div>

            {/* Pro Plan Option */}
            <Button
              onClick={() => handleUpgrade('pro')}
              disabled={isUpgrading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl transition-all duration-300 group disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              {isUpgrading ? 'Upgrading...' : 'Upgrade to Pro (8 recipes)'}
            </Button>

            {/* Max Plan Option */}
            <Button
              onClick={() => handleUpgrade('max')}
              disabled={isUpgrading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl transition-all duration-300 group disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Crown className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              {isUpgrading ? 'Upgrading...' : 'Upgrade to Max (Unlimited)'}
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-gray-700">
              ✨ Upgrade benefits:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Unlimited recipe generation</li>
              <li>• Priority customer support</li>
              <li>• Advanced recipe customization</li>
              <li>• Export recipes to PDF</li>
            </ul>
          </div>

          {/* Cancel option */}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Maybe Later
          </Button>
        </div>
      </Card>
    </div>
  );
}