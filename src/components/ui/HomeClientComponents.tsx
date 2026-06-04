"use client";

import next_dynamic from "next/dynamic";
import React from "react";

export const Footer = next_dynamic(() => import("@/components/layout/Footer"), { 
  ssr: true 
});

export const DynamicHeroCard = next_dynamic(() => import("@/components/ui/DynamicHeroCard"), { 
  ssr: false,
  loading: () => <div className="aspect-square bg-surface-2 animate-pulse rounded-3xl" />
});

export const DynamicHeroSavings = next_dynamic(() => import("@/components/ui/DynamicHeroSavings"), { 
  ssr: false 
});

export const PremiumTiltCard = next_dynamic(() => import("@/components/ui/PremiumTiltCard"), { 
  ssr: false 
});

