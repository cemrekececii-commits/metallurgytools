"use client";
import { useState, useEffect } from "react";
import { ADMIN_KEY, TOOL_LABELS, STARTER_LIMIT } from "@/lib/planUtils";

const S = {
  page:   { background: "#0a0a0a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" },
  header: { background: "#0d1117", borderBottom: "1px solid #1e293b", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  table:  { width: "100%", borderCollapse: "collapse" },
  th:     { background: "#0f172a", color: "#64748b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "10px 14px", textAlign: "left", borderBottom: "1px solid #1e293b" },
  td:     { padding: "12px 14px", borderBottom: "1px solid #0f172a", fontSize: 13, color: "#e2e8f0", verticalAlign: "top" },
  badge:  (plan) => ({ background: plan === "professional" ? "#052e16" : "#1e1b4b", color: plan === "professional" ? "#4ade80" : "#818cf8", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }),
  btn:    (c) => ({ padding: "6px 14px", background: c || "#2563eb", border: "none", borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }),
  modal:  { position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  modalBox: { background: "#0d1117", border: "1px solid #1e293b", borderRadius: 12, padding: "28px 32px", width: 420 },
  input:  { width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 7, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" },
  select: { width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 7, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" },
  label:  { color: "#64748b", fontSize: 12, fontWeight: 600, marginBottom: 5, display: "block" },
};

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("tr-TR");
}

function ToolUsageBar({ usage }) {
  const tools = Object.entries(usage || {});
  if (tools.length === 0) return <span style={{ color: "#475569" }}>—</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {tools.map(([toolId, count]) => (
        <span key={toolId} style={{ background: count >= STARTER_LIMIT ? "#450a0a" : "#1e293b", color: count >= STARTER_LIMIT ? "#f87171" : "#94a3b8", borderRadius: 4, padding: "2px 7px", fontSize: 11 }}>
          {TOOL_LABELS[toolId]?.tr || toolId}: {count}/{STARTER_LIMIT}
        </span>
      ))}
    </div>
  );
}

function EditModal({ user, onClose, onSave }) {
  const [plan, setPlan]   = useState(user.plan);
  const [expires, setExp] = useState(user.planExpiresAt ? user.planExpiresAt.slice(0, 10) : "");
  const [resetU, setRU]   = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const planExpiresAt = plan === "professional" && expires ? new Date(expires).toISOString() : null;
    await fetch(`/api/admin/users?key=${ADMIN_KEY}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify({ userId: user.userId, plan, planExpiresAt, resetUsage: resetU }),
    });
    setSaving(false);
    onSave();
    onClose();
  };

  return (
    <div style={S.modal} onClick={onClose}>
      <div style={S.modalBox} onClick={e => e.stopPropagation()}>
        <h3 style={{ color: "#f1f5f9", margin: "0 0 20px", fontWeight: 700 }}>Kullanıcı Planı Düzenle</h3>
        <div style={{ marginBottom: 4, color: "#94a3b8", fontSize: 13 }}>{user.name} — {user.email}</div>
        <hr style={{ border: "none", borderTop: "1px solid #1e293b", margin: "16px 0" }} />

        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Plan</label>
          <select style={S.select} value={plan} onChange={e => setPlan(e.target.value)}>
            <option value="starter">Starter (Ücretsiz)</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        {plan === "professional" && (
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Plan Bitiş Tarihi</label>
            <input style={S.input} type="date" value={expires} onChange={e => setExp(e.target.value)} />
            <div style={{ color: "#475569", fontSize: 11, marginTop: 4 }}>Boş bırakılırsa süresiz olarak ayarlanır</div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <input type="checkbox" id="resetU" checked={resetU} onChange={e => setRU(e.target.checked)} />
          <label htmlFor="resetU" style={{ color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>Araç kullanım sayaçlarını sıfırla</label>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={save} disabled={saving} style={S.btn()}>{saving ? "Kaydediliyor..." : "Kaydet"}</button>
          <button onClick={onClose} style={S.btn("#1e293b")}>İptal</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    const res  = await fetch(`/api/admin/users?key=${ADMIN_KEY}`, { headers: { "x-admin-key": ADMIN_KEY } });
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = users
    .filter(u => filterPlan === "all" || u.plan === filterPlan)
    .filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: users.length,
    pro:   users.filter(u => u.plan === "professional").length,
    starter: users.filter(u => u.plan === "starter").length,
  };

  return (
    <div style={S.page}>
      {editing && <EditModal user={editing} onClose={() => setEditing(null)} onSave={load} />}

      <div style={S.header}>
        <h1 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 18, margin: 0 }}>👥 Kullanıcı Yönetimi</h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ color: "#64748b", fontSize: 13 }}>
            Toplam: <strong style={{ color: "#e2e8f0" }}>{stats.total}</strong>
            &nbsp;|&nbsp;
            Pro: <strong style={{ color: "#4ade80" }}>{stats.pro}</strong>
            &nbsp;|&nbsp;
            Starter: <strong style={{ color: "#818cf8" }}>{stats.starter}</strong>
          </span>
          <button onClick={load} style={S.btn("#1e293b")}>Yenile</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: "14px 28px", display: "flex", gap: 12, alignItems: "center", borderBottom: "1px solid #1e293b" }}>
        <input
          placeholder="İsim veya e-posta ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 7, padding: "7px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", maxWidth: 280 }}
        />
        {["all", "professional", "starter"].map(p => (
          <button key={p} onClick={() => setFilter(p)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #1e293b", background: filterPlan === p ? "#2563eb" : "#0d1117", color: filterPlan === p ? "#fff" : "#94a3b8", fontSize: 12, cursor: "pointer" }}>
            {p === "all" ? "Tümü" : p === "professional" ? "Professional" : "Starter"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", padding: "0 12px 40px" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Yükleniyor...</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                {["İsim / E-posta", "Plan", "Plan Bitiş", "Kayıt", "Araç Kullanım", "İşlem"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.userId} style={{ background: "#0a0a0a" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0f172a"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0a0a0a"}
                >
                  <td style={S.td}>
                    <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{u.name || "—"}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{u.email}</div>
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(u.plan)}>{u.plan === "professional" ? "Professional" : "Starter"}</span>
                    {u.subscriptionStatus && <div style={{ color: "#475569", fontSize: 11, marginTop: 3 }}>{u.subscriptionStatus}</div>}
                  </td>
                  <td style={S.td}><span style={{ color: "#94a3b8" }}>{formatDate(u.planExpiresAt)}</span></td>
                  <td style={S.td}><span style={{ color: "#64748b", fontSize: 12 }}>{formatDate(u.createdAt)}</span></td>
                  <td style={S.td}><ToolUsageBar usage={u.toolUsage} /></td>
                  <td style={S.td}>
                    <button onClick={() => setEditing(u)} style={S.btn("#1e3a6e")}>Düzenle</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: "#475569", padding: 32 }}>Kayıt bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
