"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { trialStatus } from "@/lib/trialUtils";

const SHOPIER_PRODUCT_URL = "https://www.shopier.com/45481563";
const MONTHLY_PRICE       = "415 ₺";

export default function SubscribePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [status, setStatus]            = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    setStatus(trialStatus(user?.publicMetadata ?? {}));
  }, [isLoaded, isSignedIn, user]);

  const handleSubscribe = () => {
    const email = user?.primaryEmailAddress?.emailAddress ?? "";
    const url   = email
      ? `${SHOPIER_PRODUCT_URL}?buyer_email=${encodeURIComponent(email)}`
      : SHOPIER_PRODUCT_URL;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center px-4 py-16">

      {/* Başlık */}
      <div className="max-w-lg w-full text-center mb-10">
        <div className="text-5xl mb-4">⚙️</div>
        <h1 className="text-3xl font-bold text-white mb-3">
          {status?.mode === "trial_expired"
            ? "Ücretsiz deneme süreniz doldu"
            : "MetallurgyTools Pro'ya Abone Ol"}
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Grain boyutu, SEM-EDS analizi, faz diyagramı, korozyon ve daha fazlasına
          sınırsız erişim — aylık {MONTHLY_PRICE}.
        </p>
      </div>

      {/* Trial durum banner */}
      {status && status.mode !== "professional" && (
        <div className={`mb-8 px-5 py-3 rounded-lg text-sm font-medium ${
          status.mode === "trial_expired"
            ? "bg-red-900/40 border border-red-700 text-red-300"
            : "bg-amber-900/40 border border-amber-700 text-amber-300"
        }`}>
          {status.mode === "trial_expired"
            ? "7 günlük ücretsiz denemeniz sona erdi."
            : status.mode === "trial"
              ? `Denemenizde ${status.daysLeft} gün kaldı.`
              : "Sınırsız erişim için abone olun."}
        </div>
      )}

      {/* Fiyat kartı */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full mb-8 shadow-xl">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-4xl font-extrabold text-white">{MONTHLY_PRICE}</span>
          <span className="text-gray-400 mb-1">/ ay</span>
        </div>
        <p className="text-gray-500 text-sm mb-6">KDV dahil · İstediğiniz zaman iptal</p>

        <ul className="space-y-3 text-sm text-gray-300 mb-8">
          {[
            "Tüm araçlara sınırsız erişim",
            "SEM-EDS görüntü analizi (AI destekli)",
            "ASTM E112 tane boyutu hesaplama",
            "Faz diyagramı, DBTT, CE hesaplama",
            "Korozyon hızı ve mekanizma analizi",
            "Aylık yeni araç güncellemeleri",
          ].map(f => (
            <li key={f} className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {!isLoaded ? (
          <div className="h-12 bg-gray-800 rounded-lg animate-pulse" />
        ) : isSignedIn ? (
          <button
            onClick={handleSubscribe}
            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors text-base"
          >
            Shopier ile Öde →
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-amber-400 text-center mb-2">
              Ödeme sonrası planınızın aktive edilebilmesi için önce giriş yapın.
            </p>
            <SignInButton mode="modal" afterSignInUrl="/subscribe">
              <button className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors text-base">
                Giriş Yap ve Abone Ol
              </button>
            </SignInButton>
          </div>
        )}
      </div>

      {/* Giriş yapılmışsa email göster */}
      {isSignedIn && (
        <p className="text-xs text-gray-500 mb-6 text-center">
          Ödeme <span className="text-gray-300">{user?.primaryEmailAddress?.emailAddress}</span> e-postası ile eşleştirilecek.
        </p>
      )}

      <p className="text-xs text-gray-600 text-center">
        Ödeme Shopier üzerinden tamamlandıktan sonra planınız otomatik aktive edilir.{" "}
        <Link href="/" className="text-gray-500 hover:text-gray-300 underline">Ana sayfaya dön</Link>
      </p>
    </main>
  );
}
