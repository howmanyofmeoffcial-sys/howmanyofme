import React, { forwardRef } from "react";
import type { NameEstimateResult } from "../../lib/estimation/types";

interface NameIdCardProps {
  result: NameEstimateResult;
}

export const NameIdCard = forwardRef<HTMLDivElement, NameIdCardProps>(({ result }, ref) => {
  const rich = result.richInsights;
  const rarityIndex = rich?.rarity.oneInX
    ? Math.min(99, Math.max(10, Math.round(100 - 100 / Math.sqrt(Math.max(1, rich.rarity.oneInX)))))
    : 50;

  return (
    <div
      ref={ref}
      style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-slate-200 p-6 shadow-xl text-center"
    >
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 pb-2">
        <span className="font-bold tracking-widest text-indigo-600">HOW MANY OF ME</span>
        <span className="text-slate-400">IDENTITY INSIGHT</span>
      </div>

      <h3 className="font-display text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
        {result.displayName}
      </h3>

      <div className="my-3">
        <span className="inline-block rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700">
          {rich?.rarity.level ?? "Distinctive"}
        </span>
      </div>

      <div className="relative mx-auto my-4 h-24 w-24 rounded-full border-4 border-indigo-100 flex items-center justify-center bg-indigo-50/50">
        <div className="text-center">
          <div className="text-2xl font-extrabold text-indigo-600 leading-none">{rarityIndex}</div>
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Rarity Index</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-2">
          <div className="font-bold text-slate-900 truncate">{result.displayEstimate}</div>
          <div className="text-slate-500 text-[9px]">Est. Living</div>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-2">
          <div className="font-bold text-slate-900 truncate">
            {rich?.rarity.oneInX ? `1 in ${rich.rarity.oneInX.toLocaleString()}` : "—"}
          </div>
          <div className="text-slate-500 text-[9px]">National Ratio</div>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-2">
          <div className="font-bold text-slate-900 capitalize truncate">{result.confidence ?? "—"}</div>
          <div className="text-slate-500 text-[9px]">Confidence</div>
        </div>
      </div>

      <p className="mt-4 text-[9px] text-slate-400">
        Based on official SSA &amp; U.S. Census baseline data · howmanyofme.co
      </p>
    </div>
  );
});

NameIdCard.displayName = "NameIdCard";
