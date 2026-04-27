"use client";

import next_dynamic from "next/dynamic";
import React from "react";
import ElectricityPriceSkeleton from "@/components/layout/ElectricityPriceSkeleton";

const SupportSection = next_dynamic(() => import("@/components/ui/SupportSection"), {
  ssr: false,
});

const UrgencyBar = next_dynamic(() => import("@/components/ui/UrgencyBar"), {
  ssr: true, // Enable SSR for the bar itself, fetch happens on client
  loading: () => <ElectricityPriceSkeleton />
});

export function DeferredSupportSection() {
  return <SupportSection />;
}

export function DeferredUrgencyBar() {
  return <UrgencyBar />;
}
