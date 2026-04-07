"use client";

import next_dynamic from "next/dynamic";
import React from "react";

const SupportSection = next_dynamic(() => import("@/components/ui/SupportSection"), {
  ssr: false,
});

const UrgencyBar = next_dynamic(() => import("@/components/ui/UrgencyBar"), {
  ssr: false,
});

export function DeferredSupportSection() {
  return <SupportSection />;
}

export function DeferredUrgencyBar() {
  return <UrgencyBar />;
}
