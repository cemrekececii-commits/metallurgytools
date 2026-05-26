/**
 * accessControl.js
 *
 * Tüm tool API route'larında tek bir noktadan erişim kontrolü.
 *
 * Öncelik sırası:
 *  1. x-trial-active header (middleware tarafından enjekte edilir) → izin ver
 *  2. Clerk auth + professional plan (süresi geçmemiş) → izin ver
 *  3. Aksi hâlde → erişim reddi
 */

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function checkToolAccess(request) {
  // 1. Middleware'den gelen geçerli trial header
  if (request.headers.get("x-trial-active") === "1") {
    const daysLeft = request.headers.get("x-trial-days-left");
    return {
      allowed:  true,
      mode:     "trial",
      daysLeft: daysLeft ? parseInt(daysLeft, 10) : null,
      userId:   null,
    };
  }

  // 2. Clerk auth
  const { userId } = await auth();
  if (!userId) {
    return { allowed: false, mode: "unauthenticated", userId: null };
  }

  // 3. Plan kontrolü (Clerk publicMetadata)
  const user = await currentUser();
  const meta = user?.publicMetadata || {};
  const plan       = meta.plan;
  const expiresAt  = meta.planExpiresAt;

  if (plan === "professional") {
    const notExpired = !expiresAt || new Date(expiresAt) > new Date();
    if (notExpired) return { allowed: true, mode: "professional", userId };
    return { allowed: false, mode: "expired", userId };
  }

  return { allowed: false, mode: "no_plan", userId };
}

// ─── Standart hata yanıtı ─────────────────────────────────────────────────────

const MESSAGES = {
  unauthenticated: "Oturum açmanız gerekiyor.",
  expired:         "Aboneliğinizin süresi dolmuştur.",
  no_plan:         "Bu araçı kullanmak için abone olmanız gerekiyor.",
  trial_expired:   "7 günlük ücretsiz deneme süreniz doldu.",
};

export function accessDeniedResponse(mode) {
  return NextResponse.json(
    {
      error:    MESSAGES[mode] ?? "Erişim reddedildi.",
      redirect: "/subscribe",
      mode,
    },
    { status: 402 }
  );
}
