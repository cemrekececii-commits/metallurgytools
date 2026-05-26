"use client";

/**
 * <TrialBanner />
 *
 * Header'a yerleştirin. Trial aktifse gün sayacı gösterir.
 * Trial dolmuşsa /subscribe'a yönlendiren banner gösterir.
 * Professional plan aktifse hiçbir şey göstermez.
 *
 * Kullanım (layout.js içinde):
 *   import TrialBanner from "@/components/TrialBanner";
 *   <TrialBanner />
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function TrialBanner() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [trial, setTrial]              = useState(null);

  // Professional plan kontrolü (Clerk publicMetadata)
  const isPro = (() => {
    if (!isSignedIn || !isLoaded) return false;
    const meta = user?.publicMetadata || {};
    if (meta.plan !== "professional") return false;
    if (!meta.planExpiresAt) return true;
    return new Date(meta.planExpiresAt) > new Date();
  })();

  useEffect(() => {
    if (isPro) return; // Pro kullanıcı için sorgu yapma
    fetch("/api/trial/init", { method: "GET" })
      .then(r => r.json())
      .then(d => setTrial(d))
      .catch(() => {});
  }, [isPro]);

  // Pro plan aktif → hiçbir şey gösterme
  if (isPro) return null;

  // Trial henüz sorgulanmadı
  if (!trial) return null;

  // Trial aktif → gün sayacı
  if (trial.active) {
    const isUrgent = trial.daysLeft <= 2;
    return (
      <div className={`w-full text-center text-xs py-1.5 px-4 font-medium ${
        isUrgent
          ? "bg-red-900/70 text-red-200"
          : "bg-amber-900/50 text-amber-300"
      }`}>
        {isUrgent
          ? `⚠️ Ücretsiz denemenizin bitmesine ${trial.daysLeft} gün kaldı. `
          : `Ücretsiz denemenizde ${trial.daysLeft} gün kaldı. `}
        <Link href="/subscribe" className="underline hover:text-white font-semibold">
          Abone olun →
        </Link>
      </div>
    );
  }

  // Trial dolmuş → sabit uyarı
  if (trial.expired) {
    return (
      <div className="w-full text-center text-xs py-1.5 px-4 font-medium bg-red-800 text-red-100">
        Ücretsiz deneme süreniz doldu.{" "}
        <Link href="/subscribe" className="underline hover:text-white font-semibold">
          Devam etmek için abone olun →
        </Link>
      </div>
    );
  }

  return null;
}
