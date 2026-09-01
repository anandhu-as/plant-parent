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
      <header className={`overflow-hidden rounded-[2rem] border p-6 shadow-sm transition-colors duration-500 sm:p-7 ${zenMode ? "border-stone-700 bg-[#2e2924]" : "border-white/70 bg-white/85"}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${zenMode ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}>
              Household overview
            </div>
            <h1 className={`mt-4 text-3xl font-semibold tracking-tight sm:text-4xl transition-colors duration-500 ${zenMode ? "text-amber-50" : "text-stone-950"}`}>
              {name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-3">
              <p className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-500 ${zenMode ? "bg-stone-800 text-stone-200" : "bg-stone-100 text-stone-700"}`}>
                {plantCount} plant{plantCount === 1 ? "" : "s"}
              </p>
              <p className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-500 ${zenMode ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}>
                Shared care space
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:max-w-md lg:justify-end">
            <AddPlantForm token={token} plantIdEnabled={plantIdEnabled} />
            <HouseholdSwitcher current={token} households={households} />
            <ShareLink token={token} origin={origin} />
            <Link
              href="/?new=1"
              className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition shadow-sm hover:shadow ${zenMode ? "bg-stone-800 text-stone-200 hover:bg-stone-700" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
              aria-label="Create new household"
            >
              New household
            </Link>
            <button
              type="button"
              onClick={toggleZenMode}
              title={zenMode ? "Switch to Light mode" : "Switch to Dark mode"}
              className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition shadow-sm hover:shadow cursor-pointer ${zenMode ? "bg-amber-900/50 text-amber-200 hover:bg-amber-800/60" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
              aria-label="Toggle dark mode"
            >
              {zenMode ? "Light mode" : "Dark mode"}
            </button>
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