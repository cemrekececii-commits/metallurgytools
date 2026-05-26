"use client";

/**
 * <TrialBanner />
 *
 * Header'ın üstüne yerleştirin (layout.js).
 * - Professional plan → görünmez
 * - Trial aktif → "X gün kaldı" sayacı (≤2 günde kırmızı)
 * - Trial dolmuş → abonelik yönlendirmesi
 * - Giriş yapılmamış → görünmez
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { trialStatus } from "@/lib/trialUtils";

export default function TrialBanner() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [status, setStatus]            = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const meta = user?.publicMetadata ?? {};
    setStatus(trialStatus(meta));
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn || !status) return null;
  if (status.mode === "professional") return null;
  if (status.mode === "trial_pending") return null; // henüz araç kullanılmadı

  if (status.mode === "trial") {
    const urgent = status.daysLeft <= 2;
    return (
      <div className={`w-full text-center text-xs py-1.5 px-4 font-medium ${
        urgent ? "bg-red-900/70 text-red-200" : "bg-amber-900/50 text-amber-300"
      }`}>
        {urgent ? `⚠️ Denemenizin bitmesine ${status.daysLeft} gün kaldı. ` : `Ücretsiz denemenizde ${status.daysLeft} gün kaldı. `}
        <Link href="/subscribe" className="underline hover:text-white font-semibold">
          Abone olun →
        </Link>
      </div>
    );
  }

  if (status.mode === "trial_expired" || status.mode === "expired") {
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
