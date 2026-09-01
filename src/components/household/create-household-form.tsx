"use client";

import { createHouseHoldAction } from "@/app/actions/household";
import { SubmitButton } from "@/components/ui/submit-button";

const CreateHouseholdForm = () => {
  return (
    <form
      action={createHouseHoldAction}
      className="flex w-full flex-col gap-4"
    >
      <div className="space-y-2">
        <label htmlFor="household-name" className="block text-sm font-medium text-stone-700">
          Household name
        </label>
        <input
          id="household-name"
          name="name"
          placeholder="e.g. Apartment 4B"
          required
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
        />
      </div>
      <SubmitButton
        pendingText="Creating..."
        className="inline-flex justify-center rounded-2xl bg-emerald-700 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99] cursor-pointer"
      >
        Create household
      </SubmitButton>
    </form>
  );
};

export default CreateHouseholdForm;
