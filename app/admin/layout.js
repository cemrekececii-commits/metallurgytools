"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_KEY = "metallurgy2026";
const SESSION_KEY = "mt_admin_authed";

export const AdminAuthContext = createContext({ authed: false });

const NAV_ITEMS = [
  { href: "/admin",               icon: "📊", label: "Dashboard"       },
  { href: "/admin/consultations", icon: "⚗️", label: "Danışmanlık"     },
  { href: "/admin/feedback",      icon: "💬", label: "Görüş & İstekler" },
  { href: "/admin/users",         icon: "👥", label: "Kullanıcılar"     },
];

const S = {
  page:    { background: "#0a0a0a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "system-ui,sans-serif", display: "flex" },
  sidebar: { width: 220, background: "#0d1117", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0 },
  logo:    { padding: "20px 18px 16px", borderBottom: "1px solid #1e293b" },
  logoInner: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 34, height: 34, background: "linear-gradient(135deg,#d4af37,#f5d55e)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#0a0a0a", fontFamily: "monospace" },
  logoText: { fontSize: 14, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em" },
  adminBadge: { fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "#ef4444", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 4, padding: "1px 6px", marginTop: 2 },
  nav:     { padding: "14px 10px", flex: 1 },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
    background: active ? "rgba(37,99,235,0.15)" : "transparent",
    border: active ? "1px solid rgba(37,99,235,0.3)" : "1px solid transparent",
    color: active ? "#93c5fd" : "#64748b",
    fontSize: 13, fontWeight: active ? 600 : 400, textDecoration: "none",
    marginBottom: 2, transition: "all .15s", cursor: "pointer",
  }),
  footer:  { padding: "14px 18px", borderTop: "1px solid #1e293b" },
  content: { flex: 1, minWidth: 0, overflow: "auto" },
  loginWrap: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0a0a0a" },
  loginBox: { background: "#0d1117", border: "1px solid #1e293b", borderRadius: 16, padding: "44px 40px", width: 360, textAlign: "center" },
  input:   { width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "11px 14px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 },
  btn:     (c) => ({ padding: "11px 20px", background: c || "#2563eb", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", width: "100%" }),
};

function LoginScreen({ onLogin }) {
  const [key, setKey] = useState("");
  const [err, setErr] = useState(false);

  const attempt = () => {
    if (key === ADMIN_KEY) { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 2000); }
  };

  return (
    <div style={S.loginWrap}>
      <div style={S.loginBox}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🔐</div>
        <div style={{ ...S.logoMark, margin: "0 auto 16px", width: 44, height: 44, fontSize: 20 }}>M</div>
        <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 20, margin: "0 0 6px" }}>Admin Paneli</h2>
        <p style={{ color: "#475569", fontSize: 13, margin: "0 0 24px" }}>MetallurgyTools yönetim girişi</p>
        <input
          type="password"
          placeholder="Erişim anahtarı"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === "Enter" && attempt()}
          style={{ ...S.input, borderColor: err ? "#ef4444" : "#1e293b" }}
          autoFocus
        />
        {err && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 10, marginTop: -6 }}>Hatalı anahtar</div>}
        <button onClick={attempt} style={S.btn()}>Giriş Yap</button>
        <p style={{ color: "#334155", fontSize: 11, marginTop: 20 }}>MetallurgyTools Admin · v2026</p>
      </div>
    </div>
  );
}

function Sidebar({ onLogout }) {
  const pathname = usePathname();

  return (
    <div style={S.sidebar}>
      <div style={S.logo}>
        <div style={S.logoInner}>
          <div style={S.logoMark}>M</div>
          <div>
            <div style={S.logoText}>MetallurgyTools</div>
            <div style={S.adminBadge}>ADMIN</div>
          </div>
        </div>
      </div>

      <nav style={S.nav}>
        <div style={{ color: "#334155", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 12px", marginBottom: 8 }}>
          Yönetim
        </div>
        {NAV_ITEMS.map(item => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname?.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={S.navItem(isActive)}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={S.footer}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", fontSize: 12, textDecoration: "none", marginBottom: 10 }}>
          ← Siteye dön
        </a>
        <button onClick={onLogout} style={{ ...S.btn("#1e293b"), fontSize: 12, padding: "7px 12px" }}>
          🚪 Çıkış
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "1") setAuthed(true);
    setChecked(true);
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!checked) return null;
  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  return (
    <AdminAuthContext.Provider value={{ authed, ADMIN_KEY }}>
      <div style={S.page}>
        <Sidebar onLogout={handleLogout} />
        <main style={S.content}>
          {children}
        </main>
      </div>
    </AdminAuthContext.Provider>
  );
}
