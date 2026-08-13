"use client";
// ─────────────────────────────────────────────────────────────────────────────
// /admin/collaborations — iş birliği başvuruları yönetim paneli.
// Kimlik doğrulama HttpOnly admin cookie ile sağlanır (bkz. lib/adminAuth.js);
// ADMIN_KEY client tarafında TUTULMAZ.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";

const PROFILE_LABELS = {
  metalurji_muhendisi: "Metalurji/Malzeme Müh.",
  yazilim_muhendisi:   "Yazılım Mühendisi",
  veri_bilimci:        "Veri Bilimci / ML",
  otomasyon_muhendisi: "Otomasyon Müh.",
  akademisyen:         "Akademisyen",
  ogrenci:             "Öğrenci",
  sirket:              "Şirket / Kurum",
  diger:               "Diğer",
};

const METALLURGY_LABELS = {
  hasar_analizi: "Hasar Analizi", mekanik_test: "Mekanik Test", metalografi: "Metalografi",
  ndt: "NDT", surekli_dokum: "Sürekli Döküm", sicak_hadde: "Sıcak Hadde",
  ikincil_metalurji: "İkincil Metalurji", isil_islem: "Isıl İşlem", kaynak: "Kaynak",
  korozyon: "Korozyon", kalite_sistemleri: "Kalite Sistemleri", simulasyon: "Simülasyon",
};

const TECH_LABELS = {
  python: "Python", matlab_r: "MATLAB/R", cpp_rust: "C/C++/Rust",
  javascript_web: "JS/React", sql_veritabani: "SQL", makine_ogrenmesi: "ML",
  goruntu_isleme: "Görüntü İşleme", llm_nlp: "LLM/NLP", plc_scada: "PLC/SCADA",
  iiot_sensor: "IIoT", bulut_devops: "Bulut/DevOps", istatistik_doe: "İstatistik/DOE",
  cad_fem: "CAD/FEM", veri_gorsellestirme: "Veri Görselleştirme",
};

const MODE_LABELS = {
  ortak_proje: "Ortak Proje", acik_kaynak: "Açık Kaynak", danismanlik: "Danışmanlık",
  akademik_yayin: "Akademik Yayın", staj_mentorluk: "Staj/Mentorluk", ticari_ortaklik: "Ticari Ortaklık",
};

const WORK_LABELS = { uzaktan: "Uzaktan", hibrit: "Hibrit", yerinde: "Yerinde", farketmez: "Farketmez" };

const AVAIL_LABELS = {
  lt5: "< 5 sa/hafta", "5_10": "5–10 sa/hafta", "10_20": "10–20 sa/hafta",
  gt20: "> 20 sa/hafta", proje_bazli: "Proje bazlı",
};

const STATUS_COLORS = {
  new:       { bg: "#422006", color: "#fb923c", label: "Yeni" },
  reviewing: { bg: "#1e1b4b", color: "#a5b4fc", label: "İnceleniyor" },
  contacted: { bg: "#0c2a4d", color: "#60a5fa", label: "İletişime Geçildi" },
  accepted:  { bg: "#052e16", color: "#4ade80", label: "Kabul" },
  archived:  { bg: "#1e1e2e", color: "#64748b", label: "Arşiv" },
};

const S = {
  page:    { background: "#0a0a0a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" },
  header:  { background: "#0d1117", borderBottom: "1px solid #1e293b", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  title:   { color: "#f1f5f9", fontWeight: 800, fontSize: 18, margin: 0 },
  badge:   (status) => ({ background: STATUS_COLORS[status]?.bg || "#1e293b", color: STATUS_COLORS[status]?.color || "#94a3b8", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }),
  card:    (active) => ({ background: active ? "#0f172a" : "#0d1117", border: active ? "1px solid #2563eb" : "1px solid #1e293b", borderRadius: 10, padding: "14px 18px", marginBottom: 10, cursor: "pointer", transition: "border-color .15s" }),
  detail:  { background: "#0d1117", border: "1px solid #1e293b", borderRadius: 12, padding: "24px" },
  label:   { color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 },
  value:   { color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" },
  sectionHead: { color: "#94a3b8", fontWeight: 700, fontSize: 13, borderBottom: "1px solid #1e293b", paddingBottom: 8, marginBottom: 14, marginTop: 20 },
  textarea:{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, resize: "vertical", boxSizing: "border-box", minHeight: 120, fontFamily: "inherit", outline: "none" },
  btn:     (color) => ({ padding: "8px 16px", background: color || "#2563eb", border: "none", borderRadius: 7, color: "#fff", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }),
  tag:     { background: "#1e293b", color: "#94a3b8", borderRadius: 6, padding: "3px 9px", fontSize: 11.5, fontWeight: 600 },
  link:    { color: "#60a5fa", fontSize: 13, textDecoration: "none", wordBreak: "break-all" },
};

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
}

function InfoBlock({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={S.label}>{label}</div>}
      <div style={S.value}>{value}</div>
    </div>
  );
}

function TagRow({ label, values, map }) {
  if (!values || values.length === 0) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={S.label}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {values.map((v) => <span key={v} style={S.tag}>{map[v] || v}</span>)}
      </div>
    </div>
  );
}

function LinkRow({ label, href }) {
  if (!href) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={S.label}>{label}</div>
      <a href={href} target="_blank" rel="noopener noreferrer nofollow" style={S.link}>{href}</a>
    </div>
  );
}

function DetailPanel({ id, onBack, onChanged }) {
  const [item, setItem] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/collaboration?id=${id}`)
      .then((r) => r.json())
      .then((d) => { setItem(d.item); setNote(d.item?.adminNote || ""); });
  }, [id]);

  const patch = async (payload) => {
    await fetch(`/api/collaboration`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
  };

  const saveNote = async () => {
    setSaving(true);
    await patch({ adminNote: note });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setItem((p) => ({ ...p, adminNote: note }));
  };

  const setStatus = async (status) => {
    await patch({ status });
    setItem((p) => ({ ...p, status }));
    onChanged?.();
  };

  if (!item) return <div style={{ padding: 40, color: "#64748b", textAlign: "center" }}>Yükleniyor...</div>;

  return (
    <div style={S.detail}>
      {/* Başlık */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
        <button onClick={onBack} style={{ ...S.btn("#1e293b"), padding: "6px 12px", fontSize: 12 }}>← Geri</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 18, margin: "0 0 6px" }}>{item.projectTitle}</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={S.badge(item.status)}>{STATUS_COLORS[item.status]?.label || item.status}</span>
            <span style={S.tag}>{PROFILE_LABELS[item.profile] || item.profile}</span>
            <span style={{ color: "#64748b", fontSize: 12 }}>{formatDate(item.date)}</span>
          </div>
        </div>
      </div>

      {/* Durum aksiyonları */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        <button onClick={() => setStatus("reviewing")} style={S.btn("#312e81")}>İnceleniyor</button>
        <button onClick={() => setStatus("contacted")} style={S.btn("#1d4ed8")}>İletişime Geçildi</button>
        <button onClick={() => setStatus("accepted")}  style={S.btn("#166534")}>Kabul</button>
        <button onClick={() => setStatus("archived")}  style={S.btn("#1e293b")}>Arşivle</button>
      </div>

      {/* Kimlik */}
      <div style={S.sectionHead}>👤 Kimlik ve İletişim</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        <InfoBlock label="Ad Soyad" value={item.name} />
        <InfoBlock label="E-posta" value={item.email} />
        <InfoBlock label="Kurum" value={item.org} />
        <InfoBlock label="Görev" value={item.role} />
        <InfoBlock label="Ülke / Şehir" value={item.country} />
        <InfoBlock label="Deneyim (yıl)" value={item.experienceYears ?? ""} />
      </div>

      {/* Uzmanlık */}
      <div style={S.sectionHead}>🧭 Uzmanlık ve Teknik Yığın</div>
      <TagRow label="Metalurji" values={item.metallurgyAreas} map={METALLURGY_LABELS} />
      <TagRow label="Teknik yığın" values={item.techStack} map={TECH_LABELS} />
      <InfoBlock label="Diğer yetkinlikler" value={item.skillsOther} />

      {/* Bağlantılar */}
      {(item.github || item.linkedin || item.website || item.scholar || item.orcid || item.portfolioNotes) && <>
        <div style={S.sectionHead}>🌐 Bağlantılar ve Portföy</div>
        <LinkRow label="GitHub / GitLab" href={item.github} />
        <LinkRow label="LinkedIn" href={item.linkedin} />
        <LinkRow label="Web sitesi" href={item.website} />
        <LinkRow label="Scholar / ResearchGate" href={item.scholar} />
        <InfoBlock label="ORCID" value={item.orcid} />
        <InfoBlock label="Öne çıkan çalışmalar" value={item.portfolioNotes} />
      </>}

      {/* İş birliği */}
      <div style={S.sectionHead}>🤝 İş Birliği Modeli</div>
      <TagRow label="Modeller" values={item.collabModes} map={MODE_LABELS} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InfoBlock label="Çalışma biçimi" value={WORK_LABELS[item.workMode] || item.workMode} />
        <InfoBlock label="Müsaitlik" value={AVAIL_LABELS[item.availability] || item.availability} />
      </div>

      {/* Proje */}
      <div style={S.sectionHead}>💡 Proje Fikri</div>
      <InfoBlock label="" value={item.projectIdea} />
      <InfoBlock label="Sağlayabileceği katkı" value={item.contribution} />
      <InfoBlock label="Motivasyon" value={item.motivation} />

      {/* Dosyalar */}
      {item.files?.length > 0 && <>
        <div style={S.sectionHead}>📎 Dosyalar ({item.files.length})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
          {item.files.map((f, i) => (
            <a key={i} href={f.dataUrl} download={f.name}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e293b", borderRadius: 8, padding: "8px 14px", textDecoration: "none", color: "#60a5fa", fontSize: 13 }}>
              {f.type?.startsWith("image/") ? "🖼️" : "📄"} {f.name}
            </a>
          ))}
        </div>
      </>}

      {/* Dahili not */}
      <div style={S.sectionHead}>🗒️ Dahili Not (başvurana gösterilmez)</div>
      {item.reviewedAt && <div style={{ color: "#64748b", fontSize: 11, marginBottom: 8 }}>Son durum değişikliği: {formatDate(item.reviewedAt)}</div>}
      <textarea style={S.textarea} placeholder="Değerlendirme notları, sonraki adım, kimle eşleştirilecek..."
        value={note} onChange={(e) => setNote(e.target.value)} />
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={saveNote} disabled={saving} style={S.btn("#1d4ed8")}>
          {saving ? "Kaydediliyor..." : saved ? "✅ Kaydedildi" : "Notu Kaydet"}
        </button>
        <a href={`mailto:${item.email}?subject=${encodeURIComponent("MetallurgyTools — İş Birliği Başvurunuz: " + (item.projectTitle || ""))}`}
          style={{ ...S.btn("#1e293b"), textDecoration: "none", display: "inline-block" }}>
          ✉️ E-posta Gönder
        </a>
      </div>

      <div style={{ color: "#334155", fontSize: 11, marginTop: 16 }}>
        KVKK açık rıza: {formatDate(item.kvkkConsentAt)}
      </div>
    </div>
  );
}

export default function AdminCollaborations() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const loadList = () => {
    setLoading(true);
    fetch(`/api/collaboration`)
      .then((r) => r.json())
      .then((d) => { setList(d.collaborations || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadList(); }, []);

  const filtered = filter === "all" ? list : list.filter((x) => x.status === filter);
  const counts = {
    all: list.length,
    new: list.filter((x) => x.status === "new").length,
    reviewing: list.filter((x) => x.status === "reviewing").length,
    accepted: list.filter((x) => x.status === "accepted").length,
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>🤝 İş Birliği Başvuruları</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {counts.new > 0 && (
            <span style={{ background: "#422006", color: "#fb923c", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
              {counts.new} yeni
            </span>
          )}
          <button onClick={loadList} style={S.btn("#1e293b")}>Yenile</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>

        {/* Liste */}
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {[["all", "Tümü"], ["new", "Yeni"], ["reviewing", "İnceleniyor"], ["accepted", "Kabul"]].map(([val, lbl]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #1e293b", background: filter === val ? "#2563eb" : "#0d1117", color: filter === val ? "#fff" : "#94a3b8", fontSize: 12, cursor: "pointer" }}>
                {lbl} {counts[val] !== undefined ? `(${counts[val]})` : ""}
              </button>
            ))}
          </div>

          {loading && <div style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Yükleniyor...</div>}
          {!loading && filtered.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Kayıt yok</div>}

          {filtered.map((item) => (
            <div key={item.id} style={S.card(selected === item.id)} onClick={() => setSelected(item.id)}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.projectTitle}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>
                    {item.name}{item.org ? ` · ${item.org}` : ""} • {formatDate(item.date)}
                  </div>
                  <div style={{ color: "#475569", fontSize: 11, marginTop: 3 }}>
                    {PROFILE_LABELS[item.profile] || item.profile}
                    {item.techStack?.length > 0 ? ` • ${item.techStack.slice(0, 3).map((x) => TECH_LABELS[x] || x).join(", ")}` : ""}
                    {item.filesCount > 0 ? ` • 📎 ${item.filesCount}` : ""}
                  </div>
                </div>
                <span style={S.badge(item.status)}>{STATUS_COLORS[item.status]?.label || item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detay */}
        <div>
          {selected
            ? <DetailPanel key={selected} id={selected} onBack={() => setSelected(null)} onChanged={loadList} />
            : <div style={{ ...S.detail, textAlign: "center", padding: "60px 40px", color: "#475569" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
                <div>Sol listeden bir başvuru seçin</div>
              </div>
          }
        </div>
      </div>
    </div>
  );
}
