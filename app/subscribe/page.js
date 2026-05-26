"use client";

/**
 * /subscribe — Ödeme zorunlu sayfası.
 *
 * Akış:
 *  1. Kullanıcı buraya yönlendirilir (trial doldu veya trial_not_started).
 *  2. Clerk ile kayıt olur / giriş yapar (email gerekli — Shopier IPN için).
 *  3. "Abone Ol" butonu Shopier ödeme sayfasını açar.
 *  4. Shopier → IPN → /api/shopier/webhook → Clerk professional plan aktive edilir.
 *  5. Kullanıcı sitenin herhangi bir tool sayfasına döner.
 */

import { useEffect, useState } from "react";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const SHOPIER_PRODUCT_URL = "https://www.shopier.com/45481563";
const MONTHLY_PRICE       = "415 ₺";

export default function SubscribePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [trialInfo, setTrialInfo]       = useState(null);

  useEffect(() => {
    fetch("/api/trial/init", { method: "GET" })
      .then(r => r.json())
      .then(d => setTrialInfo(d))
      .catch(() => {});
  }, []);

  const handleSubscribe = () => {
    if (!isSignedIn) return;
    // Shopier ödeme sayfası — email parametresi ile kullanıcıyı tanıt
    const email = user?.primaryEmailAddress?.emailAddress || "";
    const url   = email
      ? `${SHOPIER_PRODUCT_URL}?buyer_email=${encodeURIComponent(email)}`
      : SHOPIER_PRODUCT_URL;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const isTrialExpired = trialInfo?.expired === true;
  const isTrialNever   = trialInfo?.never   === true;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center px-4 py-16">
      {/* Başlık */}
      <div className="max-w-lg w-full text-center mb-10">
        <div className="text-5xl mb-4">⚙️</div>
        <h1 className="text-3xl font-bold text-white mb-3">
          {isTrialExpired
            ? "Ücretsiz deneme süreniz doldu"
            : "MetallurgyTools Pro'ya Abone Ol"}
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          {isTrialExpired
            ? "7 günlük ücretsiz erişiminiz sona erdi. Tüm araçlara sınırsız erişmek için aylık aboneliği başlatın."
            : "Grain boyutu, SEM-EDS analizi, korozyon hesaplama ve daha fazlasına sınırsız erişim."}
        </p>
      </div>

      {/* Trial durumu banner */}
      {trialInfo && !trialInfo.never && (
        <div className={`mb-8 px-5 py-3 rounded-lg text-sm font-medium ${
          isTrialExpired
            ? "bg-red-900/40 border border-red-700 text-red-300"
            : "bg-amber-900/40 border border-amber-700 text-amber-300"
        }`}>
          {isTrialExpired
            ? `Denemeniz ${trialInfo.daysElapsed} gün önce sona erdi.`
            : `Denemenizde ${trialInfo.daysLeft} gün kaldı.`}
        </div>
      )}

      {/* Fiyat kartı */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full mb-8 shadow-xl">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-4xl font-extrabold text-white">{MONTHLY_PRICE}</span>
          <span className="text-gray-400 mb-1">/ ay</span>
        </div>
        <p className="text-gray-500 text-sm mb-6">KDV dahil · İstediğiniz zaman iptal edin</p>

        <ul className="space-y-3 text-sm text-gray-300 mb-8">
          {[
            "Tüm araçlara sınırsız erişim",
            "SEM-EDS görüntü analizi (AI destekli)",
            "ASTM E112 tane boyutu hesaplama",
            "Faz diyagramı, DBTT, CE hesaplama",
            "Korozyon hızı ve mekanizma analizi",
            "Aylık güncelleme ve yeni araçlar",
          ].map(f => (
            <li key={f} className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Buton durumları */}
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
              Ödeme sonrası planınızın aktive edilebilmesi için önce hesap oluşturun.
            </p>
            <SignUpButton mode="modal" afterSignUpUrl="/subscribe">
              <button className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors text-base">
                Hesap Oluştur ve Abone Ol
              </button>
            </SignUpButton>
            <SignInButton mode="modal" afterSignInUrl="/subscribe">
              <button className="w-full py-2 px-6 border border-gray-600 hover:border-gray-400 text-gray-300 font-medium rounded-lg transition-colors text-sm">
                Zaten hesabınız var mı? Giriş yapın
              </button>
            </SignInButton>
          </div>
        )}
      </div>

      {/* Giriş yapılmışsa kullanıcı bilgisi */}
      {isSignedIn && (
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
          <UserButton />
          <span>{user?.primaryEmailAddress?.emailAddress}</span>
          <span className="text-gray-600">— ödeme bu e-posta ile eşleştirilecek</span>
        </div>
      )}

      {/* Ödeme sonrası not */}
      <p className="text-xs text-gray-600 text-center max-w-sm">
        Shopier üzerinden ödeme tamamlandıktan sonra planınız otomatik olarak aktive edilir.
        Birkaç saniye içinde tüm araçlara erişim sağlanır.{" "}
        <Link href="/" className="text-gray-500 hover:text-gray-300 underline">
          Ana sayfaya dön
        </Link>
      </p>
    </main>
  );
}
