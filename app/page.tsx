"use client";

import React from "react";
import { useAuth } from "@/contexts/auth.context";
import { LandingHeader } from "@/components/organisms/landing/landing-header";
import { LandingHero } from "@/components/organisms/landing/landing-hero";
import { LandingNarrativa } from "@/components/organisms/landing/landing-narrativa";
import { LandingNfcMechanic } from "@/components/organisms/landing/landing-nfc-mechanic";
import { LandingWishlist } from "@/components/organisms/landing/landing-wishlist";
import { LandingTiers } from "@/components/organisms/landing/landing-tiers";
import { LandingSlideshow } from "@/components/organisms/landing/landing-slideshow";
import { LandingFooter } from "@/components/organisms/landing/landing-footer";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#121214] text-[#f4ebd0] font-cozy selection:bg-[#f97316] selection:text-[#121214] overflow-x-hidden">
      
      {/* 1. Header */}
      <LandingHeader user={user} />

      {/* 2. Hero Section */}
      <LandingHero />

      {/* 3. Narrativa Section */}
      <LandingNarrativa />

      {/* 4. NFC Mechanic Section */}
      <LandingNfcMechanic />

      {/* 5. Wishlist Section */}
      <LandingWishlist />

      {/* 6. Crowdfunding Tiers Section */}
      <LandingTiers />

      {/* 7. Design Diagonal Slideshow Showcase */}
      <LandingSlideshow />

      {/* 8. Cozy Footer */}
      <LandingFooter />

    </div>
  );
}
