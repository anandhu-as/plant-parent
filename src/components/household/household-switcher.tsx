"use client";
import Link from "next/link";
import { useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { RememberedHousehold } from "@/lib/household-list";
import { removeHouseHold } from "@/app/actions/household";
import { useHouseholdSwitcherStore } from "@/store/household-switcher-store";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ConfirmPopup = ({
  householdName,
  onConfirm,
  onCancel,
  isPending,
}: {
  householdName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm add-plant-overlay"
      onClick={onCancel}
    />

    <div className="relative z-10 w-full max-w-sm rounded-3xl bg-[#faf8f5] p-6 shadow-2xl add-plant-modal-desktop overflow-hidden">
      {/* Decorative top strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-red-400 to-amber-400 rounded-t-3xl" />

      <div className="flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl mb-3">
          👋
        </div>
        <h3 className="text-lg font-semibold text-stone-800">
          Remove household?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-500 max-w-[260px]">
          <span className="font-medium text-stone-700">{householdName}</span> will
          be removed from this device. You can always rejoin using the share link.
        </p>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-600 transition-all duration-200 hover:bg-stone-50 cursor-pointer disabled:opacity-40 active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="flex-1 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-800 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-amber-800 hover:to-amber-900 cursor-pointer disabled:opacity-60 active:scale-[0.98] shadow-md hover:shadow-lg"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2 justify-center">
              <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Removing…
            </span>
          ) : (
            "Remove"
          )}
        </button>
      </div>
    </div>
  </div>
);

const HouseholdSwitcher = ({
  current,
  households,
}: {
  current: string;
  households: RememberedHousehold[];
}) => {
  const { open, confirmToken, deletingToken, toggleOpen, setOpen, requestDelete, cancelDelete, startDeleting, finishDeleting } =
    useHouseholdSwitcherStore();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const currentHousehold = households.find((h) => h.token === current);
  const others = households.filter((h) => h.token !== current);
  const confirmingHousehold = households.find((h) => h.token === confirmToken);

  const executeDelete = useCallback(() => {
    if (!confirmToken) return;
    const token = confirmToken;
    startDeleting(token);
    startTransition(async () => {
      await removeHouseHold(token);
      finishDeleting();
      if (token === current) {
        router.push("/");
      } else {
        router.refresh();
      }
    });
  }, [confirmToken, current, router, startDeleting, finishDeleting]);

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={toggleOpen}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-100 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-200 cursor-pointer shadow-sm"
        >
          Switch household
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute left-0 sm:left-auto sm:right-0 z-20 mt-2 w-56 max-w-[90vw] rounded-xl border border-stone-200 bg-white p-2 shadow-lg">
              {currentHousehold && (
                <>
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-stone-50">
                    <span className="truncate text-sm font-semibold underline text-stone-800">
                      {currentHousehold.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => requestDelete(currentHousehold.token)}
                      disabled={isPending}
                      className="ml-2 flex-shrink-0 rounded-md p-1 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40 cursor-pointer"
                      title="Remove household"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className="my-1 h-px bg-stone-100" />
                </>
              )}

              {others.length > 0 ? (
                <ul className="space-y-1">
                  {others.map((h) => (
                    <li
                      key={h.token}
                      className="flex items-center justify-between rounded-lg transition-colors hover:bg-stone-100"
                    >
                      <Link
                        href={`/h/${h.token}`}
                        className="flex-1 truncate px-3 py-2 text-sm font-medium text-stone-700"
                        onClick={() => setOpen(false)}
                      >
                        <span className="truncate">{h.name}</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => requestDelete(h.token)}
                        disabled={isPending}
                        className="mr-1 flex-shrink-0 rounded-md p-1 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40 cursor-pointer"
                        title="Remove household"
                      >
                        {deletingToken === h.token ? (
                          <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-300 border-t-red-500" />
                        ) : (
                          <TrashIcon />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2 text-sm text-stone-400">
                  No other households
                </p>
              )}

              <div className="my-1 h-px bg-stone-100" />

              <Link
                href="/?new=1"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                + Create another
              </Link>
            </div>
          </>
        )}
      </div>

      {confirmingHousehold && (
        <ConfirmPopup
          householdName={confirmingHousehold.name}
          onConfirm={executeDelete}
          onCancel={cancelDelete}
          isPending={isPending}
        />
      )}
    </>
  );
};

export default HouseholdSwitcher;
