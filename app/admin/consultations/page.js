"use client";
import { useState, useEffect } from "react";

const ADMIN_KEY = "metallurgy2026";

const CAT_LABELS = {
  hasar_analizi:     "Hasar Analizi",
  mekanik_test:      "Mekanik Test",
  surekli_dokum:     "Sürekli Döküm",
  sicak_hadde:       "Sıcak Hadde",
  ikincil_metalurji: "İkincil Metalurji",
  kalite_kontrol:    "Kalite Kontrol",
  mikroyapi:         "Mikroyapı",
  diger:             "Diğer",
};

const STATUS_COLORS = {
  pending: { bg: "#422006", color: "#fb923c", label: "Bekliyor" },
  replied: { bg: "#052e16", color: "#4ade80", label: "Yanıtlandı" },
  closed:  { bg: "#1e1e2e", color: "#64748b", label: "Kapatıldı" },
};

const S = {
  page:    { background: "#0a0a0a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" },
  header:  { background: "#111827", borderBottom: "1px solid #1e293b", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  title:   { color: "#f1f5f9", fontWeight: 800, fontSize: 18, margin: 0 },
  badge:   (status) => ({ background: STATUS_COLORS[status]?.bg || "#1e293b", color: STATUS_COLORS[status]?.color || "#94a3b8", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }),
  card:    (active) => ({ background: active ? "#0f172a" : "#111827", border: active ? "1px solid #2563eb" : "1px solid #1e293b", borderRadius: 10, padding: "14px 18px", marginBottom: 10, cursor: "pointer", transition: "border-color .15s" }),
  detail:  { background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: "24px" },
  label:   { color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 },
  value:   { color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" },
  sectionHead: { color: "#94a3b8", fontWeight: 700, fontSize: 13, borderBottom: "1px solid #1e293b", paddingBottom: 8, marginBottom: 14, marginTop: 20 },
  textarea:{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, resize: "vertical", boxSizing: "border-box", minHeight: 160, fontFamily: "inherit", outline: "none" },
  btn:     (color) => ({ padding: "8px 18px", background: color || "#2563eb", border: "none", borderRadius: 7, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }),
};

function formatDate(iso) {
  return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function InfoBlock({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={S.label}>{label}</div>
      <div style={S.value}>{value}</div>
    </div>
  );
}

function DetailPanel({ id, onBack }) {
  const [item, setItem] = useState(null);
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/consultation?key=${ADMIN_KEY}&id=${id}`)
      .then(r => r.json())
      .then(d => { setItem(d.item); setReply(d.item?.reply || ""); });
  }, [id]);

  const sendReply = async () => {
    setSaving(true);
    await fetch(`/api/consultation?key=${ADMIN_KEY}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, reply }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setItem(prev => ({ ...prev, reply, status: "replied" }));
  };

  const setStatus = async (status) => {
    await fetch(`/api/consultation?key=${ADMIN_KEY}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setItem(prev => ({ ...prev, status }));
  };

  if (!item) return <div style={{ padding: 40, color: "#64748b", textAlign: "center" }}>Yükleniyor...</div>;

  return (
    <div style={S.detail}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ ...S.btn("#1e293b"), padding: "6px 12px", fontSize: 12 }}>← Geri</button>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 18, margin: "0 0 6px" }}>{item.subject}</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={S.badge(item.status)}>{STATUS_COLORS[item.status]?.label || item.status}</span>
            <span style={{ background: "#1e293b", color: "#64748b", borderRadius: 6, padding: "3px 10px", fontSize: 12 }}>{CAT_LABELS[item.category] || item.category}</span>
            <span style={{ color: "#64748b", fontSize: 12 }}>{formatDate(item.date)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setStatus("pending")} style={S.btn("#78350f")}>Bekliyor</button>
          <button onClick={() => setStatus("closed")} style={S.btn("#1e293b")}>Kapat</button>
        </div>
      </div>

      {/* Kişi */}
      <div style={S.sectionHead}>👤 İletişim</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 6 }}>
        <InfoBlock label="Ad Soyad" value={item.name} />
        <InfoBlock label="E-posta" value={item.email} />
        <InfoBlock label="Şirket" value={item.company} />
      </div>

      {/* Çelik */}
      <div style={S.sectionHead}>🔩 Malzeme</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InfoBlock label="Çelik Kalitesi" value={item.steelGrade} />
        <InfoBlock label="Standart" value={item.standard} />
      </div>

      {/* Kimyasal */}
      {item.chemicalAnalysis && <>
        <div style={S.sectionHead}>🧪 Kimyasal Analiz</div>
        <div style={{ ...S.value, fontFamily: "monospace", background: "#0a0a0a", padding: "12px 14px", borderRadius: 8, border: "1px solid #1e293b", marginBottom: 6 }}>{item.chemicalAnalysis}</div>
      </>}

      {/* Durum */}
      <div style={S.sectionHead}>🔍 Yaşanan Durum</div>
      <InfoBlock label="" value={item.situation} />

      {/* Proses */}
      {item.processParams && <>
        <div style={S.sectionHead}>⚙️ Proses Parametreleri</div>
        <InfoBlock label="" value={item.processParams} />
      </>}

      {/* Ek */}
      {item.additionalInfo && <>
        <div style={S.sectionHead}>📝 Ek Bilgiler</div>
        <InfoBlock label="" value={item.additionalInfo} />
      </>}

      {/* Dosyalar */}
      {item.files?.length > 0 && <>
        <div style={S.sectionHead}>📎 Yüklenen Dosyalar ({item.files.length})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
          {item.files.map((f, i) => (
            <a
              key={i}
              href={f.data}
              download={f.name}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e293b", borderRadius: 8, padding: "8px 14px", textDecoration: "none", color: "#60a5fa", fontSize: 13 }}
            >
              {f.type?.startsWith("image/") ? "🖼️" : "📄"} {f.name}
              <span style={{ color: "#64748b", fontSize: 11 }}>({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
            </a>
          ))}
        </div>
        {/* Preview images */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
          {item.files.filter(f => f.type?.startsWith("image/")).map((f, i) => (
            <img key={i} src={f.data} alt={f.name} style={{ maxWidth: 200, maxHeight: 150, borderRadius: 6, border: "1px solid #1e293b", objectFit: "cover" }} />
          ))}
        </div>
      </>}

      {/* Yanıt */}
      <div style={S.sectionHead}>✉️ Yanıtınız</div>
      {item.repliedAt && <div style={{ color: "#64748b", fontSize: 11, marginBottom: 8 }}>Son yanıt: {formatDate(item.repliedAt)}</div>}
      <textarea
        style={S.textarea}
        placeholder="Detaylı mühendislik yanıtınızı buraya yazınız..."
        value={reply}
        onChange={e => setReply(e.target.value)}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={sendReply} disabled={saving} style={S.btn("#1d4ed8")}>
          {saving ? "Kaydediliyor..." : saved ? "✅ Kaydedildi" : "Yanıtı Kaydet"}
        </button>
      </div>
    </div>
  );
}

export default function AdminConsultations() {
  const [auth, setAuth] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (keyInput === ADMIN_KEY) { setAuth(true); loadList(); }
  };

  const loadList = () => {
    setLoading(true);
    fetch(`/api/consultation?key=${ADMIN_KEY}`)
      .then(r => r.json())
      .then(d => { setList(d.consultations || []); setLoading(false); });
  };

  const filtered = filter === "all" ? list : list.filter(x => x.status === filter);
  const counts = { all: list.length, pending: list.filter(x => x.status === "pending").length, replied: list.filter(x => x.status === "replied").length };

  if (!auth) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: 40, width: 340, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🔐</div>
          <h2 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 20 }}>Admin Girişi</h2>
          <input
            type="password"
            placeholder="Erişim anahtarı"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
          />
          <button onClick={login} style={{ ...S.btn(), width: "100%" }}>Giriş</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>⚗️ Danışmanlık Yönetimi</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: "#64748b", fontSize: 13 }}>{counts.pending} bekleyen</span>
          <button onClick={loadList} style={S.btn("#1e293b")}>Yenile</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>

        {/* Liste */}
        <div>
          {/* Filtreler */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[["all","Tümü"], ["pending","Bekleyen"], ["replied","Yanıtlandı"]].map(([val, lbl]) => (
              <button key={val} onClick={() => setFilter(val)} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #1e293b", background: filter === val ? "#2563eb" : "#111827", color: filter === val ? "#fff" : "#94a3b8", fontSize: 12, cursor: "pointer" }}>
                {lbl} {counts[val] !== undefined ? `(${counts[val]})` : ""}
              </button>
            ))}
          </div>

          {loading && <div style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Yükleniyor...</div>}
          {!loading && filtered.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 20 }}>Kayıt yok</div>}

          {filtered.map(item => (
            <div key={item.id} style={S.card(selected === item.id)} onClick={() => setSelected(item.id)}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.subject}</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>{item.name} • {formatDate(item.date)}</div>
                  <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{CAT_LABELS[item.category] || item.category} {item.filesCount > 0 ? `• 📎 ${item.filesCount}` : ""}</div>
                </div>
                <span style={S.badge(item.status)}>{STATUS_COLORS[item.status]?.label || item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detay */}
        <div>
          {selected
            ? <DetailPanel key={selected} id={selected} onBack={() => setSelected(null)} />
            : <div style={{ ...S.detail, textAlign: "center", padding: "60px 40px", color: "#475569" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
                <div>Sol listeden bir talep seçin</div>
              </div>
          }
        </div>
      </div>
    </div>
  );
}
