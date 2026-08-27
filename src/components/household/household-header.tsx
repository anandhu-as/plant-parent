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
    <div className="flex flex-col gap-6 mb-8">
      <header className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-6 rounded-3xl shadow-sm transition-colors duration-500 ${zenMode ? "bg-[#2e2924]" : "bg-[#ebe3d5]"}`}>
        <div>
          <h1 className={`text-3xl font-bold tracking-tight transition-colors duration-500 ${zenMode ? "text-amber-50" : "text-stone-900"}`}>{name}</h1>
          <p className={`mt-1 text-base font-medium inline-block px-3 py-1 rounded-full transition-colors duration-500 ${zenMode ? "text-emerald-400 bg-emerald-900/40" : "text-emerald-700 bg-emerald-50"}`}>
            {plantCount} plant{plantCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <HouseholdSwitcher current={token} households={households} />
          <ShareLink token={token} origin={origin} />
          <Link
            href="/?new=1"
            className={`flex items-center justify-center h-10 w-10 rounded-full transition cursor-pointer shadow-sm hover:shadow ${zenMode ? "bg-stone-700/60 text-stone-300 hover:bg-stone-600 hover:text-stone-100" : "bg-emerald-100/80 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800"}`}
            aria-label="New Household"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </Link>
          <AddPlantForm token={token} plantIdEnabled={plantIdEnabled} />

          <button
            type="button"
            onClick={toggleZenMode}
            title={zenMode ? "Switch to Light mode" : "Switch to Dark mode"}
            className={`flex items-center justify-center h-10 w-10 rounded-full transition cursor-pointer shadow-sm hover:shadow ${zenMode ? "bg-amber-900/50 text-amber-300 hover:bg-amber-800/60 hover:text-amber-200" : "bg-stone-200/80 text-stone-600 hover:bg-stone-300 hover:text-stone-800"}`}
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
      </header>

      <div className="flex items-center gap-2 px-2">
        <h2 className={`text-xl font-semibold transition-colors duration-500 ${zenMode ? "text-stone-300" : "text-stone-800"}`}>My Plants</h2>
        <div className={`h-px flex-grow ml-4 transition-colors duration-500 ${zenMode ? "bg-stone-700" : "bg-stone-200"}`}></div>
      </div>
    </div>
  );
};

export default HouseholdHeader;