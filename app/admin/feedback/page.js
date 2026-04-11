"use client";
import { useState, useEffect } from "react";

const ADMIN_KEY = "metallurgy2026";

const TYPE_MAP = {
  "🔧 Yeni Araç Talebi":      { icon: "🔧", bg: "#1e3a6e", clr: "#60a5fa", label: "Yeni Araç" },
  "New Tool Request":          { icon: "🔧", bg: "#1e3a6e", clr: "#60a5fa", label: "New Tool" },
  "💡 Mevcut Araç Önerisi":   { icon: "💡", bg: "#422006", clr: "#fb923c", label: "Öneri" },
  "Existing Tool Suggestion":  { icon: "💡", bg: "#422006", clr: "#fb923c", label: "Suggestion" },
  "🐛 Hata Bildirimi":        { icon: "🐛", bg: "#450a0a", clr: "#f87171", label: "Hata" },
  "Bug Report":                { icon: "🐛", bg: "#450a0a", clr: "#f87171", label: "Bug" },
  "💬 Genel Görüş":           { icon: "💬", bg: "#1e293b", clr: "#94a3b8", label: "Görüş" },
  "General Feedback":          { icon: "💬", bg: "#1e293b", clr: "#94a3b8", label: "Feedback" },
};

const S = {
  page:    { background: "#0a0a0a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "system-ui,sans-serif" },
  header:  { background: "#0d1117", borderBottom: "1px solid #1e293b", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  title:   { color: "#f1f5f9", fontWeight: 800, fontSize: 18, margin: 0 },
  body:    { padding: "24px 28px", maxWidth: 1100, margin: "0 auto" },
  toolbar: { display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" },
  input:   { background: "#0d1117", border: "1px solid #1e293b", borderRadius: 7, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" },
  filterBtn: (active) => ({
    padding: "6px 14px", borderRadius: 6, border: "1px solid #1e293b",
    background: active ? "#2563eb" : "#0d1117",
    color: active ? "#fff" : "#64748b",
    fontSize: 12, cursor: "pointer", fontWeight: 600,
  }),
  card:    (unread) => ({
    background: unread ? "#0d1117" : "#090c12",
    border: `1px solid ${unread ? "#1e3a6e" : "#1e293b"}`,
    borderRadius: 10, padding: "16px 18px", marginBottom: 10,
    transition: "border-color .15s",
  }),
  tag:     (type) => {
    const t = TYPE_MAP[type] || TYPE_MAP["💬 Genel Görüş"];
    return { background: t.bg, color: t.clr, borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 700 };
  },
  dot:     { width: 8, height: 8, borderRadius: "50%", background: "#d4af37", flexShrink: 0, marginTop: 3, animation: "pulse 2s infinite" },
  meta:    { color: "#475569", fontSize: 11, marginTop: 4 },
  msg:     { color: "#cbd5e1", fontSize: 13, lineHeight: 1.7, marginTop: 8, whiteSpace: "pre-wrap" },
  btn:     (c) => ({ padding: "5px 12px", background: c || "#1e293b", border: "1px solid #2d3748", borderRadius: 6, color: "#e2e8f0", fontSize: 11, fontWeight: 600, cursor: "pointer" }),
  badge:   (n) => ({ background: n > 0 ? "rgba(212,175,55,0.15)" : "#1e293b", color: n > 0 ? "#d4af37" : "#64748b", borderRadius: 6, padding: "2px 9px", fontSize: 12, fontWeight: 700 }),
};

function fmt(iso) {
  return new Date(iso).toLocaleString("tr-TR", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

export default function AdminFeedback() {
  const [list, setList]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    fetch(`/api/feedback?key=${ADMIN_KEY}`)
      .then(r => r.json())
      .then(d => { setList(d.feedback || []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await fetch(`/api/feedback?key=${ADMIN_KEY}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setList(prev => prev.map(x => x.id === id ? { ...x, read: true } : x));
  };

  const markAllRead = async () => {
    await fetch(`/api/feedback?key=${ADMIN_KEY}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setList(prev => prev.map(x => ({ ...x, read: true })));
  };

  const deleteItem = async (id) => {
    await fetch(`/api/feedback?key=${ADMIN_KEY}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setList(prev => prev.filter(x => x.id !== id));
    if (expanded === id) setExpanded(null);
  };

  // Filter types for toolbar
  const allTypes = [...new Set(list.map(x => x.type).filter(Boolean))];
  const unreadCount = list.filter(x => !x.read).length;

  const filtered = list
    .filter(x => filter === "all" || filter === "unread" ? (filter === "unread" ? !x.read : true) : x.type === filter)
    .filter(x => !search || x.name?.toLowerCase().includes(search.toLowerCase()) || x.email?.toLowerCase().includes(search.toLowerCase()) || x.message?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>💬 Görüş, Öneri & İstekler</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={S.badge(unreadCount)}>{unreadCount} okunmamış</span>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={S.btn("#1e3a6e")}>Tümünü okundu işaretle</button>
          )}
          <button onClick={load} style={S.btn()}>Yenile</button>
        </div>
      </div>

      <div style={S.body}>
        {/* Toolbar */}
        <div style={S.toolbar}>
          <input
            style={{ ...S.input, minWidth: 220 }}
            placeholder="İsim, e-posta veya mesaj ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button style={S.filterBtn(filter === "all")} onClick={() => setFilter("all")}>
            Tümü ({list.length})
          </button>
          <button style={S.filterBtn(filter === "unread")} onClick={() => setFilter("unread")}>
            Okunmamış ({unreadCount})
          </button>
          {allTypes.map(t => (
            <button key={t} style={S.filterBtn(filter === t)} onClick={() => setFilter(t)}>
              {TYPE_MAP[t]?.icon || "💬"} {TYPE_MAP[t]?.label || t}
            </button>
          ))}
        </div>

        {loading && <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>Yükleniyor...</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 12, padding: "48px", textAlign: "center", color: "#334155" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div>Kayıt bulunamadı</div>
          </div>
        )}

        {filtered.map(fb => {
          const isOpen = expanded === fb.id;
          const tMeta  = TYPE_MAP[fb.type] || TYPE_MAP["💬 Genel Görüş"];
          return (
            <div key={fb.id} style={S.card(!fb.read)}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                {/* Unread dot */}
                {!fb.read && <div style={S.dot} />}

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <span style={S.tag(fb.type)}>{tMeta.icon} {tMeta.label}</span>
                    <span style={{ color: "#334155", fontSize: 11 }}>{fmt(fb.date)}</span>
                  </div>

                  {/* Message preview / full */}
                  <div
                    style={{ ...S.msg, WebkitLineClamp: isOpen ? undefined : 2, WebkitBoxOrient: "vertical", overflow: isOpen ? "visible" : "hidden", display: isOpen ? "block" : "-webkit-box", cursor: "pointer" }}
                    onClick={() => { setExpanded(isOpen ? null : fb.id); if (!fb.read) markRead(fb.id); }}
                  >
                    {fb.message}
                  </div>

                  <div style={S.meta}>
                    👤 <strong style={{ color: "#94a3b8" }}>{fb.name}</strong>
                    &nbsp;·&nbsp;
                    📧 <a href={`mailto:${fb.email}`} style={{ color: "#3b82f6", textDecoration: "none" }}>{fb.email}</a>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}>
                  {!fb.read && (
                    <button onClick={() => markRead(fb.id)} style={S.btn("#052e16")} title="Okundu işaretle">
                      ✓ Okundu
                    </button>
                  )}
                  <button
                    onClick={() => { setExpanded(isOpen ? null : fb.id); if (!fb.read) markRead(fb.id); }}
                    style={S.btn()}
                  >
                    {isOpen ? "Daralt" : "Genişlet"}
                  </button>
                  <button onClick={() => { if (confirm("Bu kaydı silmek istediğinizden emin misiniz?")) deleteItem(fb.id); }} style={S.btn("#450a0a")} title="Sil">
                    🗑 Sil
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
