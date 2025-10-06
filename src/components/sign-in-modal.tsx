"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignInModalProps {
  children: React.ReactNode;
}

export default function SignInModal({ children }: SignInModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal when user is fully authenticated
  useEffect(() => {
    if (isSignedIn && user && isOpen) {
      setIsOpen(false);
    }
  }, [isSignedIn, user, isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {/* Modal */}
      {isOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleBackdropClick}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 text-gray-600" />
            </Button>

            {/* Clerk SignIn Component */}
            <div className="p-6">
              <SignIn
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "shadow-none",
                    card: "shadow-none border-0 bg-transparent p-0",
                    headerTitle: "text-2xl font-bold text-gray-900",
                    headerSubtitle: "text-gray-600",
                    socialButtonsBlockButton: "border border-gray-200 hover:border-gray-300 text-gray-700",
                    socialButtonsBlockButtonText: "font-medium",
                    formButtonPrimary: "bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white font-semibold",
                    formFieldInput: "border border-gray-300 focus:border-orange-500 focus:ring-orange-500",
                    formFieldLabel: "text-gray-700 font-medium",
                    footerActionLink: "text-orange-500 hover:text-orange-600 font-medium",
                    identityPreviewText: "text-gray-600",
                    identityPreviewEditButton: "text-orange-500 hover:text-orange-600"
                  },
                }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}