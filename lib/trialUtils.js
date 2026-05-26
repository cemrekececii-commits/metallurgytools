/**
 * trialUtils.js
 *
 * Trial yönetimi — Clerk publicMetadata tabanlı.
 * Kimlik = email (Clerk userId) → bypass imkansız.
 *
 * publicMetadata şeması:
 *   trialStartedAt : ISO string  — trial başlangıç tarihi
 *   plan           : "trial" | "professional"
 *   planExpiresAt  : ISO string  — professional plan bitiş tarihi (opsiyonel)
 */

export const TRIAL_DAYS = 7;

/**
 * Clerk publicMetadata'dan trial durumunu hesaplar.
 * @param {object} meta - user.publicMetadata
 */
export function trialStatus(meta = {}) {
  const plan       = meta.plan ?? "trial";
  const expiresAt  = meta.planExpiresAt;
  const startedAt  = meta.trialStartedAt;

  // Professional plan kontrolü
  if (plan === "professional") {
    const notExpired = !expiresAt || new Date(expiresAt) > new Date();
    if (notExpired) return { mode: "professional", active: true, daysLeft: null };
    return { mode: "expired", active: false, daysLeft: 0 };
  }

  // Trial henüz başlatılmamış (ilk araç kullanımında başlatılır)
  if (!startedAt) return { mode: "trial_pending", active: true, daysLeft: TRIAL_DAYS };

  // Trial süresi hesapla
  const elapsed  = Date.now() - new Date(startedAt).getTime();
  const daysLeft = Math.max(0, TRIAL_DAYS - elapsed / (1000 * 60 * 60 * 24));

  if (daysLeft > 0) {
    return { mode: "trial", active: true, daysLeft: Math.ceil(daysLeft) };
  }

  return { mode: "trial_expired", active: false, daysLeft: 0 };
}
