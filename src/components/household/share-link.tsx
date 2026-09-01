"use client";

import { useEffect } from "react";
import { useShareLinkStore } from "@/store/share-link-store";

const ShareLink = ({ token, origin }: { token: string; origin: string }) => {
  const { isOpen, copied, open, close, setCopied } = useShareLinkStore();
  const url = `${origin}/h/${token}`;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Our Plants", text: "Check out our plants!", url });
      } catch {
      }
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-100 px-4 py-2.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-200 cursor-pointer shadow-sm hover:shadow"
        aria-label="Share household"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={close} />

          <div className="relative w-full max-w-md rounded-3xl bg-[#f5f1ea] p-6 shadow-2xl animate-pop-in">
            <button
              onClick={close}
              className="absolute top-5 right-5 rounded-full p-1 text-stone-400 hover:bg-stone-200/50 hover:text-stone-600 transition cursor-pointer"
              aria-label="Close dialog"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div className="flex items-start gap-4 mb-5 pr-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8decb] text-stone-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-800 mb-1">Share this household</h2>
                <p className="text-sm text-stone-600/90 leading-snug">
                  There&apos;s no login, so anyone with this link can view and edit your plants. Share it only with your household.
                </p>
              </div>
            </div>

            <div
              onClick={handleCopy}
              className="flex items-center justify-between gap-3 rounded-xl bg-[#ebe3d5] px-4 py-3 cursor-pointer hover:bg-[#e4d9c7] transition mb-4 group"
            >
              <div className="truncate text-sm text-stone-600">{url || "..."}</div>
              <div className="shrink-0 text-stone-500 group-hover:text-stone-700">
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in zoom-in"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                )}
              </div>
            </div>

            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#469b61] px-4 py-3.5 text-base font-semibold text-white transition hover:bg-[#3d8654] active:scale-[0.98] cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
              Share...
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareLink;