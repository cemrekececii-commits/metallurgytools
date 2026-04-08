// ─── Plan Definitions ────────────────────────────────────────────────────────
export const PLANS = {
  starter:      { id: "starter",      label: "Starter",      labelTr: "Ücretsiz",       usageLimit: 5,   price: 0 },
  professional: { id: "professional", label: "Professional", labelTr: "Profesyonel",    usageLimit: null, price: 415 },
};

export const STARTER_LIMIT = 5;   // per tool
export const ADMIN_KEY     = "metallurgy2026";

// ─── Tool ID ↔ Route Mapping ──────────────────────────────────────────────────
export const TOOL_ROUTES = {
  "/tools/carbon-equivalent":        "carbon-equivalent",
  "/tools/cct-ttt":                  "cct-ttt",
  "/tools/corrosion":                "corrosion",
  "/tools/dbtt":                     "dbtt",
  "/tools/dwtt":                     "dwtt",
  "/tools/grain-size":               "grain-size",
  "/tools/hardness":                 "hardness",
  "/tools/hasar-vakalari":           "hasar-vakalari",
  "/tools/inclusion":                "inclusion",
  "/tools/inclusion-atlas":          "inclusion-atlas",
  "/tools/phase-diagram":            "phase-diagram",
  "/tools/preheat":                  "preheat",
  "/tools/sem-eds":                  "sem-eds",
  "/tools/tensile-specimen":         "tensile-specimen",
  "/tools/ultrasonic":               "ultrasonic",
  "/tools/unit-converter":           "unit-converter",
  "/mechanical-tests/cekme-testi":       "cekme-testi",
  "/mechanical-tests/darbe-testi":       "darbe-testi",
  "/mechanical-tests/sertlik-olcumu":    "sertlik-olcumu",
  "/mechanical-tests/katlama-egme-testi":"katlama-egme-testi",
  "/mechanical-tests/dwtt":             "dwtt-mechanical",
  "/mechanical-tests/basma-testi":       "basma-testi",
};

export const TOOL_LABELS = {
  "carbon-equivalent":   { tr: "Karbon Eşdeğeri", en: "Carbon Equivalent" },
  "cct-ttt":             { tr: "CCT/TTT Diyagramı", en: "CCT/TTT Diagram" },
  "corrosion":           { tr: "Korozyon Analizi", en: "Corrosion Analysis" },
  "dbtt":                { tr: "DBTT Hesaplama", en: "DBTT Calculator" },
  "dwtt":                { tr: "DWTT Analizi", en: "DWTT Analysis" },
  "grain-size":          { tr: "Tane Boyutu", en: "Grain Size" },
  "hardness":            { tr: "Sertlik Dönüşümü", en: "Hardness Conversion" },
  "hasar-vakalari":      { tr: "Hasar Analizi Atlası", en: "Failure Analysis Atlas" },
  "inclusion":           { tr: "İnklüzyon Analizi", en: "Inclusion Analysis" },
  "inclusion-atlas":     { tr: "İnklüzyon Atlası", en: "Inclusion Atlas" },
  "phase-diagram":       { tr: "Faz Diyagramı", en: "Phase Diagram" },
  "preheat":             { tr: "Ön Isıtma", en: "Preheat Calculator" },
  "sem-eds":             { tr: "SEM-EDS Analizi", en: "SEM-EDS Analysis" },
  "tensile-specimen":    { tr: "Çekme Numunesi", en: "Tensile Specimen" },
  "ultrasonic":          { tr: "Ultrasonik Test", en: "Ultrasonic Testing" },
  "unit-converter":      { tr: "Birim Çevirici", en: "Unit Converter" },
  "cekme-testi":         { tr: "Çekme Testi", en: "Tensile Test" },
  "darbe-testi":         { tr: "Darbe Testi", en: "Impact Test" },
  "sertlik-olcumu":      { tr: "Sertlik Ölçümü", en: "Hardness Measurement" },
  "katlama-egme-testi":  { tr: "Katlama/Eğme Testi", en: "Bend Test" },
  "dwtt-mechanical":     { tr: "DWTT Testi", en: "DWTT Test" },
  "basma-testi":         { tr: "Basma Testi", en: "Compression Test" },
};

// ─── Default User Record ──────────────────────────────────────────────────────
export function defaultUser({ userId, email, name }) {
  return {
    userId,
    email:   email || "",
    name:    name  || "",
    plan:    "starter",
    planStartedAt:  new Date().toISOString(),
    planExpiresAt:  null,
    toolUsage:      {},
    consultationFreeUsed:     false,   // starter once-free consultation
    consultationMonthlyCount: 0,       // pro resets monthly
    consultationMonth:        currentMonth(),
    stripeCustomerId:     null,
    stripeSubscriptionId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// ─── Access Check ─────────────────────────────────────────────────────────────
export function canUseTool(user, toolId) {
  if (!user) return { allowed: false, reason: "unauthenticated" };

  // Professional plan
  if (user.plan === "professional") {
    if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date()) {
      return { allowed: false, reason: "expired", usageLeft: 0 };
    }
    return { allowed: true, reason: "pro", usageLeft: null };
  }

  // Starter plan
  const used = (user.toolUsage || {})[toolId] || 0;
  const left = STARTER_LIMIT - used;
  if (left <= 0) return { allowed: false, reason: "limit", usageLeft: 0, used };
  return { allowed: true, reason: "starter", usageLeft: left, used };
}

// ─── Consultation Check ───────────────────────────────────────────────────────
export function canUseConsultation(user) {
  if (!user) return { allowed: false, reason: "unauthenticated" };

  if (user.plan === "professional") {
    // Reset monthly count if new month
    const month = currentMonth();
    const count = user.consultationMonth === month ? (user.consultationMonthlyCount || 0) : 0;
    if (count >= 1) return { allowed: false, reason: "monthly_limit" };
    return { allowed: true, reason: "pro_monthly", remaining: 1 - count };
  }

  // Starter: 1 free ever
  if (!user.consultationFreeUsed) return { allowed: true, reason: "starter_free", remaining: 1 };
  return { allowed: false, reason: "starter_exhausted" };
}
