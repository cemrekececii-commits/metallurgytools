/**
 * GET /api/trial/init
 *
 * Giriş yapmış kullanıcının trial durumunu döndürür.
 * TrialBanner ve useTrial hook'u tarafından çağrılır.
 * Trial başlatma (trialStartedAt yazma) artık ilk tool API çağrısında
 * accessControl.js tarafından otomatik yapılır.
 */

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { trialStatus } from "@/lib/trialUtils";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const user   = await currentUser();
  const meta   = user?.publicMetadata ?? {};
  const status = trialStatus(meta);

  return NextResponse.json({
    authenticated: true,
    ...status,
    trialStartedAt: meta.trialStartedAt ?? null,
    planExpiresAt:  meta.planExpiresAt  ?? null,
  });
}
