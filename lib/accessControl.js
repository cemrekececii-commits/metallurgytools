/**
 * accessControl.js
 *
 * Tüm tool API route'larında tek noktadan erişim kontrolü.
 *
 * Öncelik:
 *  1. Clerk auth yoksa → 401 (login gerekli)
 *  2. Professional plan aktifse → izin ver
 *  3. Trial aktifse (7 gün) → izin ver + gerekirse trialStartedAt başlat
 *  4. Trial dolmuşsa → 402 (abonelik gerekli)
 */

import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { trialStatus } from "@/lib/trialUtils";

export async function checkToolAccess(request) {
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
};

export function accessDeniedResponse(mode) {
  return NextResponse.json(
    {
      error:    MESSAGES[mode] ?? "Erişim reddedildi.",
      redirect: mode === "unauthenticated" ? "/signup" : "/subscribe",
      mode,
    },
    { status: mode === "unauthenticated" ? 401 : 402 }
  );
}
