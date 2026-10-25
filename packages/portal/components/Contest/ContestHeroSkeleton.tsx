import React from "react";
import { ClockIcon } from "../commons/Icons";
import ContestHeroBackground from "./ContestHeroBackground";

const SkeletonBar = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`block animate-pulse bg-white/10 ${className}`}
  />
);

const SkeletonDeadline = () => (
  <div className="flex items-start gap-2.5">
    <ClockIcon size={14} className="mt-0.5 shrink-0 text-white/20" />
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
        <SkeletonBar className="h-[1lh] w-28" />
      </p>
      <p className="mt-0.5 font-mono text-sm">
        <SkeletonBar className="h-[1lh] w-40" />
      </p>
    </div>
  </div>
);

/**
 * Skeleton della testata competizione: replica struttura, spaziature e sfondo
 * dell'hero definitivo per evitare salti di layout al caricamento.
 */
const ContestHeroSkeleton = () => (
  <section
    aria-busy="true"
    className="contest-hero relative overflow-hidden text-gray-100  mb-8"
  >
    <ContestHeroBackground />

    <div className="relative mx-auto w-full max-w-7xl px-5 py-10">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <SkeletonBar className="h-6 w-24" />
          </div>

          <h1 className="mt-2 text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl">
            <SkeletonBar className="h-[1lh] w-full" />
            <SkeletonBar className="h-[1lh] w-2/3 min-[380px]:hidden" />
          </h1>

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
            <SkeletonDeadline />
            <span
              aria-hidden="true"
              className="hidden h-9 w-px bg-white/10 sm:block"
            />
            <SkeletonDeadline />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <SkeletonBar className="h-[2.625rem] w-32 rounded-sm" />
            <SkeletonBar className="h-[2.625rem] w-24 rounded-sm" />
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-[22rem]">
          <div className="border border-white/10 bg-[#0b1220]/90 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em]">
                <ClockIcon size={12} className="text-white/20" />
                <SkeletonBar className="h-[15px] w-32" />
              </p>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center border border-white/10 bg-white/[0.04] px-1 py-2.5"
                >
                  <SkeletonBar className="h-7 w-8 md:h-8" />
                  <SkeletonBar className="mt-0.5 h-[13.5px] w-6" />
                </div>
              ))}
            </div>

            <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-5">
              <SkeletonBar className="h-[1lh] w-full" />
              <SkeletonBar className="h-[1lh] w-2/3 min-[340px]:hidden" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ContestHeroSkeleton;
