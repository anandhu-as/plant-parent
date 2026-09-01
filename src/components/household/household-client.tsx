"use client";

import { useEffect } from "react";
import HouseholdHeader from "@/components/household/household-header";
import PlantList from "@/components/plants/plant-list";
import type { RememberedHousehold } from "@/lib/household-list";
import type { Plant, Household } from "@/lib/db/schema";
import RememberHousehold from "@/components/household/remember-household";
import WelcomePopup from "@/components/ui/welcome-popup";
import { useUiStore } from "@/store/ui-store";

type PlantWithLastWatered = Plant & { lastWateredAt: Date | null };

export default function HouseholdClient({
  household,
  plants,
  token,
  households,
  origin,
  plantIdEnabled,
}: {
  household: Household;
  plants: PlantWithLastWatered[];
  token: string;
  households: RememberedHousehold[];
  origin: string;
  plantIdEnabled: boolean;
}) {
  const { zenMode, mounted, setMounted } = useUiStore();

  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#f5f1ea] p-5 sm:p-10 transition-colors duration-500">
        <div className="mx-auto max-w-2xl space-y-8">
          <RememberHousehold token={token} name={household.name} />
          {/* Skeleton header */}
          <div className="p-6 rounded-3xl bg-[#ebe3d5] animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="h-8 w-48 rounded-xl bg-stone-300/50" />
                <div className="h-6 w-24 rounded-full bg-emerald-200/40" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-10 w-24 rounded-full bg-stone-300/40" />
                <div className="h-10 w-10 rounded-full bg-stone-300/40" />
                <div className="h-10 w-28 rounded-full bg-emerald-300/40" />
                <div className="h-10 w-10 rounded-full bg-stone-300/40" />
              </div>
            </div>
          </div>

          {/* Section divider skeleton */}
          <div className="flex items-center gap-2 px-2">
            <div className="h-6 w-28 rounded-lg bg-stone-300/40 animate-pulse" />
            <div className="h-px flex-grow ml-4 bg-stone-200" />
          </div>

          {/* Plant card skeletons */}
          {plants.length > 0 ? (
            <div className="space-y-4 animate-pulse">
              {plants.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className="py-6 px-4 rounded-2xl border border-stone-200"
                  style={{ opacity: 1 - i * 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-stone-200/60" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-6 w-40 rounded-lg bg-stone-300/50" />
                      <div className="h-4 w-28 rounded-md bg-stone-200/50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Loading indicator */}
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-[3px] border-emerald-200 border-t-emerald-600 animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-base">🌱</span>
            </div>
            <p className="text-sm font-medium text-stone-500 tracking-wide">
              Getting things ready…
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-500 ${zenMode ? "bg-[#24211e]" : "bg-[#f5f1ea]"} p-5 sm:p-10`}>
      <WelcomePopup householdName={household.name} />
      <div className="mx-auto max-w-5xl space-y-8">
        <RememberHousehold token={token} name={household.name} />
        <HouseholdHeader
          name={household.name}
          plantCount={plants.length}
          token={token}
          households={households}
          origin={origin}
          plantIdEnabled={plantIdEnabled}
        />
        <PlantList token={token} plants={plants} plantIdEnabled={plantIdEnabled} />
      </div>
    </main>
  );
}
