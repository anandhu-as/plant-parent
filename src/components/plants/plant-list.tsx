"use client";

import PlantCard from "@/components/plants/plant-card";
import EditPlantForm from "@/components/plants/edit-plant-form";
import type { Plant } from "@/lib/db/schema";
import { useUiStore } from "@/store/ui-store";
import { useEditPlantStore } from "@/store/edit-plant-store";

type PlantWithLastWatered = Plant & { lastWateredAt: Date | null };

const PlantList = ({ token, plants, plantIdEnabled }: { token: string; plants: PlantWithLastWatered[]; plantIdEnabled?: boolean }) => {
  const zenMode = useUiStore((s) => s.zenMode);
  const { editingPlant } = useEditPlantStore();

  if (plants.length === 0) {
    return (
      <div className={`relative overflow-hidden rounded-[2rem] border border-dashed px-6 py-14 text-center shadow-sm transition-colors duration-500 ${zenMode ? "border-stone-700 bg-stone-800/30 text-stone-300" : "border-emerald-200 bg-white/80 text-stone-700"}`}>
        <div className="absolute -left-4 top-2 text-7xl opacity-10">🪴</div>
        <div className="absolute -right-4 bottom-2 text-7xl opacity-10">🌿</div>
        <div className="relative mx-auto max-w-md">
          <div className="mb-4 text-5xl">🌱</div>
          <p className="text-xl font-semibold">No plants added yet</p>
          <p className={`mt-2 text-sm leading-6 transition-colors duration-500 ${zenMode ? "text-stone-400" : "text-stone-600"}`}>
            Start by adding your first plant to track watering, save care notes, and keep the whole household on the same page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {plants.map((plant, index) => (
          <PlantCard key={plant.id} token={token} plant={plant} index={index} />
        ))}
      </ul>
      {editingPlant && (
        <EditPlantForm token={token} plantIdEnabled={plantIdEnabled ?? false} />
      )}
    </>
  );
};

export default PlantList;