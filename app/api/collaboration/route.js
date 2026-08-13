// ─────────────────────────────────────────────────────────────────────────────
// /api/collaboration
//
// İş birliği başvuruları (metalurji × yazılım/YZ/otomasyon). Mimari olarak
// /api/consultation ile birebir aynı desendedir:
//   POST   → public başvuru (rate-limit + validation + KVKK açık rıza + KV)
//   GET    → admin liste / tek kayıt (HttpOnly cookie ile isAdminAuthed)
//   PATCH  → admin durum, etiket ve dahili not güncellemesi
//
// KV namespace: "collaboration"  (lib/kvStore.js)
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminAuthed } from "@/lib/adminAuth";
import {
  cleanString, stripTags, isEmail, approxByteSize, validateAttachments
} from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";
import { putEntry, getEntry, patchEntry, listEntries } from "@/lib/kvStore";

export const dynamic = "force-dynamic";

const NS = "collaboration";

// Beyaz liste — client'tan gelen değerler bu kümelerin dışındaysa atılır.
const PROFILES = [
  "metalurji_muhendisi", "yazilim_muhendisi", "veri_bilimci", "otomasyon_muhendisi",
  "akademisyen", "ogrenci", "sirket", "diger",
];
const COLLAB_MODES = [
  "ortak_proje", "acik_kaynak", "danismanlik", "akademik_yayin", "staj_mentorluk", "ticari_ortaklik",
];
const WORK_MODES  = ["uzaktan", "hibrit", "yerinde", "farketmez"];
const AVAILABILITY = ["lt5", "5_10", "10_20", "gt20", "proje_bazli"];

const METALLURGY_TAGS = [
  "hasar_analizi", "mekanik_test", "metalografi", "ndt", "surekli_dokum",
  "sicak_hadde", "ikincil_metalurji", "isil_islem", "kaynak", "korozyon",
  "kalite_sistemleri", "simulasyon",
];
const TECH_TAGS = [
  "python", "matlab_r", "cpp_rust", "javascript_web", "sql_veritabani",
  "makine_ogrenmesi", "goruntu_isleme", "llm_nlp", "plc_scada", "iiot_sensor",
  "bulut_devops", "istatistik_doe", "cad_fem", "veri_gorsellestirme",
];

function pickFrom(list, v) {
  const s = cleanString(v, 60);
  return list.includes(s) ? s : "";
}

function pickManyFrom(list, arr, max = 30) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (const v of arr.slice(0, max)) {
    const s = cleanString(v, 60);
    if (list.includes(s) && !out.includes(s)) out.push(s);
  }
  return out;
}

// URL alanları: yalnızca http/https, uzunluk sınırlı, tag temizlenmiş.
function cleanUrl(v, max = 300) {
  const s = cleanString(v, max);
  if (!s) return "";
  if (!/^https?:\/\/[^\s<>"']+$/i.test(s)) return "";
  return s;
}

function clientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function requireAdmin() {
  return isAdminAuthed(cookies());
}

export async function POST(req) {
  const ip = clientIp(req);
  const rl = await rateLimit(`collab-post:${ip}`, { limit: 3, windowSec: 600 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen birkaç dakika sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter || 60) } }
    );
  }

  try {
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    if (approxByteSize({ ...body, files: undefined }) > 64 * 1024) {
      return NextResponse.json({ error: "Metin alanları çok büyük" }, { status: 413 });
    }

    // ── Kimlik / iletişim ──
    const name    = cleanString(body.name, 120);
    const email   = cleanString(body.email, 254);
    const country = cleanString(body.country, 80);
    const org     = cleanString(body.org, 160);
    const role    = cleanString(body.role, 160);
    const profile = pickFrom(PROFILES, body.profile) || "diger";
    const experienceYears = Number.isFinite(+body.experienceYears)
      ? Math.max(0, Math.min(60, Math.round(+body.experienceYears)))
      : null;

    // ── Uzmanlık & teknik yığın ──
    const metallurgyAreas = pickManyFrom(METALLURGY_TAGS, body.metallurgyAreas);
    const techStack       = pickManyFrom(TECH_TAGS, body.techStack);
    const skillsOther     = stripTags(body.skillsOther, 1000);

    // ── Bağlantılar & portföy ──
    const github    = cleanUrl(body.github);
    const linkedin  = cleanUrl(body.linkedin);
    const website   = cleanUrl(body.website);
    const scholar   = cleanUrl(body.scholar);
    const orcid     = cleanString(body.orcid, 40);
    const portfolioNotes = stripTags(body.portfolioNotes, 2000);

    // ── İş birliği modeli & müsaitlik ──
    const collabModes  = pickManyFrom(COLLAB_MODES, body.collabModes);
    const workMode     = pickFrom(WORK_MODES, body.workMode);
    const availability = pickFrom(AVAILABILITY, body.availability);

    // ── Proje fikri & motivasyon ──
    const projectTitle = cleanString(body.projectTitle, 200);
    const projectIdea  = stripTags(body.projectIdea, 8000);
    const motivation   = stripTags(body.motivation, 4000);
    const contribution = stripTags(body.contribution, 4000);

    // Zorunlular
    if (!name || !isEmail(email) || !projectTitle || !projectIdea) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik veya geçersiz" }, { status: 400 });
    }
    if (collabModes.length === 0) {
      return NextResponse.json({ error: "En az bir iş birliği modeli seçilmelidir" }, { status: 400 });
    }

    // KVKK aydınlatma metnine açık rıza beyanı
    if (body.kvkkConsent !== true) {
      return NextResponse.json(
        { error: "Aydınlatma metnine açık rıza zorunludur." },
        { status: 400 }
      );
    }

    const att = validateAttachments(body.files, { maxCount: 3, maxTotalBytes: 6 * 1024 * 1024 });
    if (!att.ok) return NextResponse.json({ error: att.error }, { status: 400 });

    const now = new Date().toISOString();
    const entry = {
      id: Date.now().toString(),
      date: now,
      createdAt: now,
      status: "new",
      name, email, country, org, role, profile, experienceYears,
      metallurgyAreas, techStack, skillsOther,
      github, linkedin, website, scholar, orcid, portfolioNotes,
      collabModes, workMode, availability,
      projectTitle, projectIdea, motivation, contribution,
      files: att.files,
      adminNote: null,
      reviewedAt: null,
      kvkkConsentAt: now,
    };

    const saved = await putEntry(NS, entry);
    return NextResponse.json({ success: true, id: saved.id });
  } catch (err) {
    console.error("collaboration POST:", err?.message);
    return NextResponse.json({ error: "Gönderim başarısız" }, { status: 500 });
  }
}

export async function GET(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const item = await getEntry(NS, id);
    return NextResponse.json({ item: item || null });
  }
  const all = await listEntries(NS, { limit: 500 });
  const list = all.map((x) => ({
    id: x.id, date: x.date, status: x.status,
    name: x.name, email: x.email, org: x.org,
    profile: x.profile, projectTitle: x.projectTitle,
    collabModes: x.collabModes || [],
    techStack: x.techStack || [],
    filesCount: x.files?.length || 0,
  }));
  return NextResponse.json({ collaborations: list });
}

export async function PATCH(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const { id, status, adminNote } = await req.json();
    const patch = {};
    if (status) {
      const s = cleanString(status, 40);
      const ALLOWED = ["new", "reviewing", "contacted", "accepted", "archived"];
      if (!ALLOWED.includes(s)) {
        return NextResponse.json({ error: "Geçersiz durum" }, { status: 400 });
      }
      patch.status = s;
      patch.reviewedAt = new Date().toISOString();
    }
    if (adminNote !== undefined) patch.adminNote = stripTags(adminNote, 8000);

    const updated = await patchEntry(NS, id, patch);
    if (!updated) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
