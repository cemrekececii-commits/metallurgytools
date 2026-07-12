/**
 * accessControl.js
 *
 * Tüm tool API route'larında tek noktadan erişim kontrolü.
 *
 * Öncelik:
 *  0. OPEN_ACCESS (public mode) açıksa → login/abonelik aranmaz, sadece IP limiti
 *  1. Clerk auth yoksa → 401 (login gerekli)
 *  2. Professional plan aktifse → izin ver
 *  3. Trial aktifse (7 gün) → izin ver + gerekirse trialStartedAt başlat
 *  4. Trial dolmuşsa → 402 (abonelik gerekli)
 *
 * PUBLIC MODE (geri alınabilir):
 *  NEXT_PUBLIC_OPEN_ACCESS=true iken tüm AI endpoint'leri (grain-size,
 *  sem-eds, corrosion, phase-diagram) anonim erişime açıktır. Kötüye kullanım
 *  ve Gemini API maliyetine karşı IP başına saatlik ortak bir hız limiti
 *  uygulanır. Bayrağı kaldırınca/false yapınca eski login+abonelik düzeni
 *  aynen geri gelir (yalnızca redeploy gerekir).
 */

import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { trialStatus } from "@/lib/trialUtils";
import { rateLimit } from "@/lib/rateLimit";

const OPEN_ACCESS = process.env.NEXT_PUBLIC_OPEN_ACCESS === "true";

// Public mode'da tüm AI araçları için IP başına saatlik ortak tavan.
// Gemini maliyetini sınırlar; gerçek kullanıcı için bolca yeterli.
// Gerektiğinde tek yerden ayarla.
const OPEN_ACCESS_IP_LIMIT = 40;         // istek / saat / IP (tüm AI araçları toplam)
const OPEN_ACCESS_WINDOW_SEC = 3600;

function getClientIp(request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function checkToolAccess(request) {
  // 0. PUBLIC MODE — login/abonelik aranmaz; yalnızca IP hız limiti.
  if (OPEN_ACCESS) {
    const ip = getClientIp(request);
    const rl = await rateLimit(`open:ai:ip:${ip}`, {
      limit: OPEN_ACCESS_IP_LIMIT,
      windowSec: OPEN_ACCESS_WINDOW_SEC,
    });
    if (!rl.ok) {
      return { allowed: false, mode: "rate_limited", userId: null, retryAfter: rl.retryAfter };
    }
    return { allowed: true, mode: "open", userId: null, daysLeft: null };
  }

  // 1. Clerk auth
  const { userId } = await auth();
  if (!userId) {
    return { allowed: false, mode: "unauthenticated", userId: null };
  }

  const user = await currentUser();
  const meta = { ...(user?.publicMetadata ?? {}) };

  // 2. Trial / plan durumu
  const status = trialStatus(meta);

  if (status.mode === "professional") {
    return { allowed: true, mode: "professional", userId, daysLeft: null };
  }

  if (status.mode === "trial_pending") {
    // İlk araç kullanımı → trialStartedAt yaz
    const now = new Date().toISOString();
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...meta,
        trialStartedAt: now,
        plan: "trial",
      },
    });
    return { allowed: true, mode: "trial", userId, daysLeft: 7 };
  }

  if (status.mode === "trial") {
    return { allowed: true, mode: "trial", userId, daysLeft: status.daysLeft };
  }

  // trial_expired veya expired
  return { allowed: false, mode: status.mode, userId };
}

// ─── Standart hata yanıtı ─────────────────────────────────────────────────────

const MESSAGES = {
  unauthenticated: "Bu aracı kullanmak için giriş yapmanız gerekiyor.",
  trial_expired:   "7 günlük ücretsiz deneme süreniz doldu.",
  expired:         "Aboneliğinizin süresi dolmuştur.",
  rate_limited:    "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.",
};

export function accessDeniedResponse(mode) {
  // Public mode hız limiti → 429
  if (mode === "rate_limited") {
    return NextResponse.json(
      { error: MESSAGES.rate_limited, mode },
      { status: 429 }
    );
  }
  return NextResponse.json(
    {
      error:    MESSAGES[mode] ?? "Erişim reddedildi.",
      redirect: mode === "unauthenticated" ? "/signup" : "/subscribe",
      mode,
    },
    { status: mode === "unauthenticated" ? 401 : 402 }
  );
}
