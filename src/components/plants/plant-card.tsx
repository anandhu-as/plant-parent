"use client";

import { useState } from "react";
import type { Plant } from "@/lib/db/schema";
import { getWateringStatus } from "@/lib/freshness";
import { markWateredAction, removePlantAction } from "@/app/actions/plant";
import { SubmitButton } from "@/components/ui/submit-button";
import { useUiStore } from "@/store/ui-store";
import { useEditPlantStore } from "@/store/edit-plant-store";
import Image from "next/image";

type PlantWithLastWatered = Plant & { lastWateredAt: Date | null };

const PlantCard = ({ token, plant, index = 0 }: { token: string; plant: PlantWithLastWatered; index?: number }) => {
  const zenMode = useUiStore((s) => s.zenMode);
  const { openEdit } = useEditPlantStore();
  const info = getWateringStatus(plant.lastWateredAt, plant.wateringIntervalDays);
  const [careOpen, setCareOpen] = useState(false);

  const statusTone =
    info.daysUntilDue === null
      ? zenMode
        ? "bg-stone-800 text-stone-200"
        : "bg-stone-100 text-stone-700"
      : info.daysUntilDue < 0
        ? zenMode
          ? "bg-rose-950/40 text-rose-200"
          : "bg-rose-100 text-rose-700"
        : info.daysUntilDue === 0
          ? zenMode
            ? "bg-amber-950/50 text-amber-200"
            : "bg-amber-100 text-amber-800"
          : zenMode
            ? "bg-emerald-950/40 text-emerald-200"
            : "bg-emerald-100 text-emerald-700";

  return (
    <li
      className={`group rounded-[2rem] border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-pop-in opacity-0 sm:p-6 ${zenMode
        ? "border-stone-700 bg-[#2b2722]"
        : "border-white/80 bg-white/90"
        }`}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-inner transition-colors duration-500 sm:h-20 sm:w-20 ${zenMode ? "bg-stone-800" : "bg-stone-100"}`}>
              {plant.imageUrl ? (
                <Image src={plant.imageUrl} alt={plant.name} width={80} height={80} className="h-full w-full object-cover" unoptimized />
              ) : (
                <span className="text-4xl">{plant.emoji}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`truncate text-xl font-semibold tracking-tight sm:text-2xl transition-colors duration-500 ${zenMode ? "text-amber-50" : "text-stone-950"}`}>
                  {plant.name}
                </h3>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone}`}>
                  {info.daysUntilDue === null
                    ? "Needs first watering"
                    : info.daysUntilDue < 0
                      ? `Overdue ${Math.abs(info.daysUntilDue)}d`
                      : info.daysUntilDue === 0
                        ? "Water today"
                        : `Due in ${info.daysUntilDue}d`}
                </span>
              </div>
              {plant.species && (
                <p className={`mt-1 truncate text-sm sm:text-base transition-colors duration-500 ${zenMode ? "text-stone-400" : "text-stone-500"}`}>
                  {plant.species}
                </p>
              )}
              <div className={`mt-3 grid gap-2 text-sm sm:grid-cols-2 ${zenMode ? "text-stone-400" : "text-stone-600"}`}>
                <p>
                  {info.daysSinceWatered === null
                    ? "Never watered"
                    : info.daysSinceWatered === 0
                      ? "Watered today"
                      : `Watered ${info.daysSinceWatered} days ago`}
                </p>
                <p>Water every {plant.wateringIntervalDays} day{plant.wateringIntervalDays === 1 ? "" : "s"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-stretch">
          <form action={markWateredAction.bind(null, token, plant.id)} className="sm:flex-1 lg:flex-none">
            <SubmitButton
              pendingText="Saving..."
              className="inline-flex w-full justify-center rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm hover:bg-emerald-800 cursor-pointer"
            >
              Mark watered
            </SubmitButton>
          </form>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => openEdit(plant)}
              className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition cursor-pointer ${zenMode ? "bg-stone-800 text-stone-200 hover:bg-stone-700" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
              aria-label={`Edit ${plant.name}`}
              title="Edit plant"
            >
              Edit
            </button>
            <form action={removePlantAction.bind(null, token, plant.id)} className="flex-1">
              <SubmitButton
                className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition cursor-pointer ${zenMode ? "bg-stone-800 text-rose-300 hover:bg-stone-700" : "bg-rose-50 text-rose-700 hover:bg-rose-100"}`}
                aria-label={`Remove ${plant.name}`}
              >
                Remove
              </SubmitButton>
            </form>
          </div>
        </div>
      </div>

      {plant.careGuide && (
        <div className={`mt-5 border-t pt-4 ${zenMode ? "border-stone-700/70" : "border-stone-200"}`}>
          <button
            type="button"
            onClick={() => setCareOpen((o) => !o)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition ${zenMode ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-700 hover:text-emerald-800"}`}
          >
            <span>📋</span>
            Care Guide
            <svg
              className={`h-3 w-3 transition-transform duration-200 ${careOpen ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          {careOpen && (
            <div className={`mt-2 p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap font-mono animate-in fade-in slide-in-from-top-1 duration-150 ${zenMode ? "bg-stone-800/60 text-stone-300 border border-stone-700" : "bg-emerald-50/60 text-stone-700 border border-emerald-100"}`}>
              {plant.careGuide}
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default PlantCard;