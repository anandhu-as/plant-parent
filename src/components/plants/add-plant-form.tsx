"use client";
import { useTransition, useState, useEffect } from "react";
import { addPlantAction } from "@/app/actions/plant";
import PlantPhotoIdentify from "@/components/plants/plant-photo-identify";
import { PlantIdentification } from "@/app/actions/identify-plant";
import { toast } from "sonner";
import { useAddPlantStore } from "@/store/add-plant-store";
import { useEditPlantStore } from "@/store/edit-plant-store";
import { useUiStore } from "@/store/ui-store";

const DEFAULT_CARE_GUIDE = `💧 Watering: Water when the top inch of soil is dry.
☀️ Light: Prefers bright, indirect sunlight.
🌡️ Temperature: Thrives between 65–80°F (18–27°C).
🌱 Soil: Well-draining potting mix.
✂️ Pruning: Remove dead leaves regularly.`;

const AddPlantForm = ({ token, plantIdEnabled }: { token: string; plantIdEnabled: boolean }) => {
  const {
    isOpen, isSuccess, name, species, imageUrl, careGuide, createdPlant,
    open, close, reset, setName, setSpecies, setImageUrl, setCareGuide,
    setIsSuccess, setCreatedPlant,
  } = useAddPlantStore();
  const { openEdit } = useEditPlantStore();
  const zenMode = useUiStore((s) => s.zenMode);
  const [isPending, startTransition] = useTransition();
  const [careGuideOpen, setCareGuideOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  const handleIdentified = (match: PlantIdentification) => {
    setSpecies(match.scientificName);
    if (!name.trim() && match.commonName) {
      setName(match.commonName);
    }
  };

  const handleOpenWithCareGuide = () => {
    setCareGuide(DEFAULT_CARE_GUIDE);
    open();
  };

  const submitAction = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const plant = await addPlantAction(token, formData);
        setCreatedPlant(plant ?? null);
        setIsSuccess(true);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "An error occurred.";
        toast.error("Failed to add plant", { description: msg });
      }
    });
  };

  const handleEditCreated = () => {
    if (createdPlant) {
      openEdit({ ...createdPlant, lastWateredAt: null });
    }
    close();
  };


  const overlayBg = zenMode ? "bg-black/60" : "bg-black/40";
  const modalBg = zenMode ? "bg-[#2a2520]" : "bg-[#faf8f5]";
  const headerBg = zenMode
    ? "bg-gradient-to-b from-emerald-950/40 to-transparent"
    : "bg-gradient-to-b from-emerald-50/80 to-transparent";
  const headingColor = zenMode ? "text-amber-50" : "text-emerald-950";
  const subtitleColor = zenMode ? "text-stone-400" : "text-stone-500";
  const sectionBg = zenMode ? "bg-stone-800/50" : "bg-white/70";
  const sectionBorder = zenMode ? "border-stone-700/50" : "border-emerald-100/80";
  const labelColor = zenMode ? "text-stone-300" : "text-stone-600";
  const inputStyles = zenMode
    ? "bg-stone-800 border-stone-600 text-amber-50 placeholder:text-stone-500 focus:ring-emerald-500/30 focus:border-emerald-600"
    : "bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:ring-emerald-500/25 focus:border-emerald-400";
  const careToggleColor = zenMode
    ? "text-emerald-400 hover:text-emerald-300"
    : "text-emerald-700 hover:text-emerald-800";
  const dividerColor = zenMode ? "border-stone-700/40" : "border-stone-200/60";

  const inputClass = `w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${inputStyles}`;

  return (
    <>
      <button
        onClick={handleOpenWithCareGuide}
        className="flex items-center justify-center h-10 px-3 sm:px-4 rounded-full bg-[#469b61] text-white font-medium transition hover:bg-[#3d8654] shadow-sm hover:shadow cursor-pointer gap-2"
        aria-label="Add Plant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
        <span className="hidden sm:inline">Add Plant</span>
      </button>

      {isOpen && (
        <div
          className={`fixed inset-0 z-50 ${overlayBg} backdrop-blur-sm add-plant-overlay`}
          onClick={close}
          style={{ display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center" }}
        >
          <div
            className={`
              relative w-full overflow-hidden
              ${isMobile
                ? `max-h-[92vh] rounded-t-3xl ${modalBg} add-plant-modal-mobile`
                : `max-w-lg max-h-[90vh] rounded-3xl ${modalBg} mx-4 add-plant-modal-desktop`
              }
              shadow-2xl
            `}
            onClick={(e) => e.stopPropagation()}
          >

            <div className="absolute top-0 left-0 right-0 h-1 add-plant-shimmer rounded-t-3xl" />

            <div className={`overflow-y-auto max-h-[92vh] sm:max-h-[90vh] add-plant-scroll ${isMobile ? "pb-8" : ""}`}>

              <div className={`sticky top-0 z-10 ${headerBg} backdrop-blur-md px-5 sm:px-7 pt-5 pb-3`}>

                {isMobile && (
                  <div className="flex justify-center mb-3">
                    <div className={`w-10 h-1 rounded-full ${zenMode ? "bg-stone-600" : "bg-stone-300"}`} />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-xl ${zenMode ? "bg-emerald-900/50" : "bg-emerald-100"}`}>
                      🪴
                    </div>
                    <div>
                      <h2 className={`font-semibold text-lg sm:text-xl ${headingColor}`}>
                        Add a new plant
                      </h2>
                      <p className={`text-xs ${subtitleColor}`}>
                        Fill in the details below
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={close}
                    className={`h-8 w-8 flex items-center justify-center rounded-full transition-all duration-200 ${zenMode
                      ? "bg-stone-700/50 text-stone-400 hover:bg-stone-600/60 hover:text-stone-200"
                      : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
                      }`}
                    aria-label="Close modal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-5 sm:px-7 pb-5 sm:pb-7">
                {isSuccess ? (

                  <div className={`flex flex-col items-center justify-center ${sectionBg} border ${sectionBorder} p-8 sm:p-10 rounded-2xl mt-2 add-plant-success`}>
                    <div className="relative mb-5">
                      <div className="text-6xl">🎉</div>
                      <div className="absolute -top-1 -right-2 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>✨</div>
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-semibold mb-1.5 ${headingColor}`}>Plant added!</h3>
                    <p className={`text-sm ${subtitleColor} mb-8 text-center max-w-[280px] leading-relaxed`}>
                      Your plant has been successfully added to the household.
                    </p>
                    <div className="flex flex-col sm:flex-row w-full gap-2.5">
                      <button
                        onClick={reset}
                        className="flex-1 rounded-xl bg-[#469b61] px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3d8654] shadow-md hover:shadow-lg flex justify-center items-center gap-2 cursor-pointer text-sm"
                      >
                        <span>🌱</span> Add another
                      </button>
                      {createdPlant && (
                        <button
                          onClick={handleEditCreated}
                          className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex justify-center items-center gap-2 cursor-pointer text-sm ${zenMode
                            ? "bg-amber-600 text-white hover:bg-amber-500"
                            : "bg-amber-500 text-white hover:bg-amber-600"
                            }`}
                        >
                          <span>✏️</span> Edit plant
                        </button>
                      )}
                      <button
                        onClick={close}
                        className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all duration-200 flex justify-center items-center cursor-pointer text-sm ${zenMode
                          ? "bg-stone-700 text-stone-300 hover:bg-stone-600"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (

                  <form action={submitAction} className="space-y-4 mt-2">
                    {/* Section 1: Photo */}
                    <div className={`${sectionBg} border ${sectionBorder} rounded-2xl p-4 transition-colors duration-200`}>
                      <PlantPhotoIdentify
                        onIdentified={handleIdentified}
                        onImageChange={setImageUrl}
                        identifyEnabled={plantIdEnabled}
                      />
                    </div>

                    <input type="hidden" name="imageUrl" value={imageUrl} />

                    {/* Section 2: Basic Info */}
                    <div className={`${sectionBg} border ${sectionBorder} rounded-2xl p-4 space-y-3.5 transition-colors duration-200`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">🌿</span>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${zenMode ? "text-emerald-400/80" : "text-emerald-700/70"}`}>
                          Plant Details
                        </span>
                      </div>

                      <div>
                        <label htmlFor="add-name" className={`block text-xs font-medium mb-1.5 ${labelColor}`}>
                          Plant Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="add-name"
                          name="name"
                          placeholder="e.g. Monstera, Snake Plant..."
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className={`border-t ${dividerColor}`} />

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label htmlFor="add-species" className={`block text-xs font-medium mb-1.5 ${labelColor}`}>
                            Species
                          </label>
                          <input
                            id="add-species"
                            name="species"
                            placeholder="Scientific name"
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label htmlFor="add-emoji" className={`block text-xs font-medium mb-1.5 ${labelColor}`}>
                            Emoji
                          </label>
                          <input
                            id="add-emoji"
                            name="emoji"
                            placeholder="🪴"
                            maxLength={4}
                            className={`${inputClass} text-center text-lg`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Watering */}
                    <div className={`${sectionBg} border ${sectionBorder} rounded-2xl p-4 transition-colors duration-200`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm">💧</span>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${zenMode ? "text-emerald-400/80" : "text-emerald-700/70"}`}>
                          Watering Schedule
                        </span>
                      </div>
                      <div>
                        <label htmlFor="add-watering" className={`block text-xs font-medium mb-1.5 ${labelColor}`}>
                          Water every N days
                        </label>
                        <div className="relative">
                          <input
                            id="add-watering"
                            name="wateringIntervalDays"
                            type="number"
                            min={1}
                            placeholder="7"
                            className={inputClass}
                          />
                          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none ${subtitleColor}`}>
                            days
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Care Guide (collapsible) */}
                    <div className={`${sectionBg} border ${sectionBorder} rounded-2xl p-4 transition-colors duration-200`}>
                      <button
                        type="button"
                        onClick={() => setCareGuideOpen((o) => !o)}
                        className={`flex items-center gap-2 text-sm font-semibold w-full text-left transition-colors duration-200 ${careToggleColor}`}
                      >
                        <span className="text-base">📋</span>
                        Care Guide
                        <span className={`ml-1 text-xs font-normal ${subtitleColor}`}>
                          (pre-filled)
                        </span>
                        <svg
                          className={`ml-auto h-4 w-4 transition-transform duration-300 ${careGuideOpen ? "rotate-180" : ""}`}
                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${careGuideOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
                          }`}
                      >
                        <div className="overflow-hidden">
                          <textarea
                            name="careGuide"
                            rows={5}
                            value={careGuide}
                            onChange={(e) => setCareGuide(e.target.value)}
                            className={`${inputClass} resize-y leading-relaxed font-mono text-xs`}
                          />
                        </div>
                      </div>
                      {!careGuideOpen && (
                        <input type="hidden" name="careGuide" value={careGuide} />
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className={`
                        w-full rounded-2xl px-4 py-3.5 text-base font-semibold text-white
                        transition-all duration-200 shadow-lg hover:shadow-xl
                        flex justify-center items-center gap-2
                        disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
                        ${isPending
                          ? "bg-emerald-700"
                          : "bg-gradient-to-r from-[#469b61] to-[#3a9158] hover:from-[#3d8654] hover:to-[#34804e] active:scale-[0.98]"
                        }
                      `}
                    >
                      {isPending && (
                        <svg
                          className="animate-spin -ml-1 mr-1 h-4.5 w-4.5 text-white/80"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {!isPending && <span>🌿</span>}
                      {isPending ? "Planting..." : "Plant it!"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPlantForm;