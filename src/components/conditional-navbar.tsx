"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't render navbar on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }
  
  return <Navbar />;
}