"use client";

import HouseholdSwitcher from "@/components/household/household-switcher";
import ShareLink from "@/components/household/share-link";
import AddPlantForm from "@/components/plants/add-plant-form";
import type { RememberedHousehold } from "@/lib/household-list";
import { useUiStore } from "@/store/ui-store";
import Link from "next/link";

const HouseholdHeader = ({
  name,
  plantCount,
  token,
  households,
  origin,
  plantIdEnabled,
}: {
  name: string;
  plantCount: number;
  token: string;
  households: RememberedHousehold[];
  origin: string;
  plantIdEnabled: boolean;
}) => {
  const { zenMode, toggleZenMode } = useUiStore();

  return (
    <div className="mb-8 flex flex-col gap-6">
      <header className={`rounded-[2rem] border p-5 shadow-sm transition-colors duration-500 sm:p-6 ${zenMode ? "border-stone-700 bg-[#2e2924]" : "border-white/70 bg-white/90"}`}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${zenMode ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}>
              Household overview
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <h1 className={`truncate text-3xl font-semibold tracking-tight sm:text-4xl transition-colors duration-500 ${zenMode ? "text-amber-50" : "text-stone-950"}`} title={name}>
                  {name}
                </h1>
                <p className={`mt-2 text-sm transition-colors duration-500 ${zenMode ? "text-stone-400" : "text-stone-500"}`}>
                  Organize watering, notes, and shared plant care in one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <p className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-500 ${zenMode ? "bg-stone-800 text-stone-200" : "bg-stone-100 text-stone-700"}`}>
                  {plantCount} plant{plantCount === 1 ? "" : "s"}
                </p>
                <p className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-500 ${zenMode ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}>
                  Shared care space
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[420px]">
            <AddPlantForm token={token} plantIdEnabled={plantIdEnabled} />
            <HouseholdSwitcher current={token} households={households} />
            <ShareLink token={token} origin={origin} />
            <div className="flex gap-3">
              <Link
                href="/?new=1"
                className={`flex-1 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition shadow-sm hover:shadow ${zenMode ? "bg-stone-800 text-stone-200 hover:bg-stone-700" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
                aria-label="Create new household"
              >
                New household
              </Link>
              <button
                type="button"
                onClick={toggleZenMode}
                title={zenMode ? "Switch to Light mode" : "Switch to Dark mode"}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition cursor-pointer shadow-sm hover:shadow ${zenMode ? "bg-amber-900/50 text-amber-300 hover:bg-amber-800/60 hover:text-amber-200" : "bg-stone-200/80 text-stone-600 hover:bg-stone-300 hover:text-stone-800"}`}
                aria-label="Toggle dark mode"
              >
                {zenMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-3 px-1">
        <h2 className={`text-lg font-semibold transition-colors duration-500 sm:text-xl ${zenMode ? "text-stone-200" : "text-stone-900"}`}>
          Your plants
        </h2>
        <div className={`ml-2 h-px flex-grow transition-colors duration-500 ${zenMode ? "bg-stone-700" : "bg-stone-200"}`}></div>
      </div>
    </div>
  );
};

export default HouseholdHeader;