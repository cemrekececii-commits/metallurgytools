"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ADMIN_KEY = "metallurgy2026";

const S = {
  wrap:     { padding: "28px 32px", maxWidth: 1200, margin: "0 auto" },
  heading:  { color: "#f1f5f9", fontWeight: 800, fontSize: 22, margin: "0 0 6px" },
  sub:      { color: "#475569", fontSize: 13, margin: "0 0 28px" },
  grid:     { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 },
  card:     (accent) => ({
    background: "#0d1117", border: `1px solid ${accent || "#1e293b"}`,
    borderRadius: 12, padding: "20px 22px", cursor: "default",
  }),
  cardVal:  { color: "#f1f5f9", fontSize: 30, fontWeight: 800, margin: "8px 0 2px" },
  cardLbl:  { color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" },
  cardSub:  { color: "#334155", fontSize: 11, marginTop: 4 },
  sect:     { marginBottom: 32 },
  sectHd:   { color: "#94a3b8", fontWeight: 700, fontSize: 13, borderBottom: "1px solid #1e293b", paddingBottom: 8, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" },
  row:      (alt) => ({ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 16px", background: alt ? "#0f172a" : "#0d1117", borderBottom: "1px solid #0f172a" }),
  badge:    (status) => {
    const map = { pending: ["#422006","#fb923c"], replied: ["#052e16","#4ade80"], closed: ["#1e1e2e","#64748b"] };
    const [bg, clr] = map[status] || ["#1e293b","#94a3b8"];
    return { background: bg, color: clr, borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 600 };
  },
  typeTag:  { background: "#1e293b", color: "#94a3b8", borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 600 },
  link:     { color: "#3b82f6", fontSize: 12, textDecoration: "none", fontWeight: 600 },
  navBtn:   { display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "#1e293b", border: "1px solid #2d3748", borderRadius: 8, color: "#e2e8f0", fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "border-color .15s" },
};

function fmt(iso) {
  return iso ? new Date(iso).toLocaleString("tr-TR", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";
}

export default function AdminDashboard() {
  const [cons, setCons] = useState([]);
  const [feed, setFeed] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/consultation?key=${ADMIN_KEY}`).then(r => r.json()).catch(() => ({})),
      fetch(`/api/feedback?key=${ADMIN_KEY}`).then(r => r.json()).catch(() => ({})),
      fetch(`/api/admin/users?key=${ADMIN_KEY}`, { headers: { "x-admin-key": ADMIN_KEY } }).then(r => r.json()).catch(() => ({})),
    ]).then(([c, f, u]) => {
      setCons(c.consultations || []);
      setFeed(f.feedback || []);
      setUsers(u.users || []);
      setLoading(false);
    });
  }, []);

  const pendingCons  = cons.filter(x => x.status === "pending").length;
  const unreadFeed   = feed.filter(x => !x.read).length;
  const proPlan      = users.filter(u => u.plan === "professional").length;

  const recentCons = cons.slice(0, 6);
  const recentFeed = feed.slice(0, 6);

  return (
    <div style={S.wrap}>
      {/* Header */}
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #1e293b" }}>
        <h1 style={S.heading}>📊 Admin Dashboard</h1>
        <p style={S.sub}>MetallurgyTools yönetim özeti — {new Date().toLocaleDateString("tr-TR", { day:"2-digit", month:"long", year:"numeric" })}</p>

        {/* Quick nav */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            ["/admin/consultations", "⚗️ Danışmanlık", pendingCons > 0 ? `${pendingCons} bekliyor` : null, "#f97316"],
            ["/admin/feedback",      "💬 Görüş & İstekler", unreadFeed > 0 ? `${unreadFeed} yeni` : null, "#60a5fa"],
            ["/admin/users",         "👥 Kullanıcılar", null, null],
            ["/admin/blog",          "📝 Blog Yönetimi", null, "#d2a935"],
          ].map(([href, lbl, badge, badgeClr]) => (
            <Link key={href} href={href} style={S.navBtn}>
              {lbl}
              {badge && <span style={{ background: badgeClr + "22", color: badgeClr, borderRadius: 5, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{badge}</span>}
            </Link>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ color: "#475569", textAlign: "center", padding: 60, fontSize: 14 }}>Veriler yükleniyor...</div>
      ) : (
        <>
          {/* Stats */}
          <div style={S.grid}>
            <div style={S.card("#1e3a5f")}>
              <div style={S.cardLbl}>Toplam Kullanıcı</div>
              <div style={S.cardVal}>{users.length}</div>
              <div style={S.cardSub}>{proPlan} Professional · {users.length - proPlan} Starter</div>
            </div>
            <div style={S.card(pendingCons > 0 ? "#422006" : "#1e293b")}>
              <div style={S.cardLbl}>Bekleyen Danışmanlık</div>
              <div style={{ ...S.cardVal, color: pendingCons > 0 ? "#fb923c" : "#f1f5f9" }}>{pendingCons}</div>
              <div style={S.cardSub}>{cons.length} toplam talep</div>
            </div>
            <div style={S.card(unreadFeed > 0 ? "#1e3a6e" : "#1e293b")}>
              <div style={S.cardLbl}>Okunmamış Görüş</div>
              <div style={{ ...S.cardVal, color: unreadFeed > 0 ? "#60a5fa" : "#f1f5f9" }}>{unreadFeed}</div>
              <div style={S.cardSub}>{feed.length} toplam kayıt</div>
            </div>
            <div style={S.card("#052e16")}>
              <div style={S.cardLbl}>Professional Üye</div>
              <div style={{ ...S.cardVal, color: "#4ade80" }}>{proPlan}</div>
              <div style={S.cardSub}>{users.length > 0 ? Math.round(proPlan / users.length * 100) : 0}% dönüşüm oranı</div>
            </div>
          </div>

          {/* Recent Consultations */}
          <div style={S.sect}>
            <div style={S.sectHd}>
              <span>⚗️ Son Danışmanlık Talepleri</span>
              <Link href="/admin/consultations" style={S.link}>Tümünü gör →</Link>
            </div>
            <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden" }}>
              {recentCons.length === 0 && <div style={{ padding: "28px", color: "#334155", textAlign: "center", fontSize: 13 }}>Henüz danışmanlık talebi yok</div>}
              {recentCons.map((item, i) => (
                <div key={item.id} style={S.row(i % 2 === 1)}>
                  <span style={S.badge(item.status)}>
                    {item.status === "pending" ? "Bekliyor" : item.status === "replied" ? "Yanıtlandı" : "Kapatıldı"}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.subject}</div>
                    <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{item.name} · {fmt(item.date)}</div>
                  </div>
                  {item.filesCount > 0 && <span style={{ color: "#64748b", fontSize: 11 }}>📎 {item.filesCount}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Feedback */}
          <div style={S.sect}>
            <div style={S.sectHd}>
              <span>💬 Son Görüş & İstekler</span>
              <Link href="/admin/feedback" style={S.link}>Tümünü gör →</Link>
            </div>
            <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden" }}>
              {recentFeed.length === 0 && <div style={{ padding: "28px", color: "#334155", textAlign: "center", fontSize: 13 }}>Henüz geri bildirim yok</div>}
              {recentFeed.map((fb, i) => (
                <div key={fb.id} style={S.row(i % 2 === 1)}>
                  {!fb.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#d4af37", flexShrink: 0, marginTop: 5 }} />}
                  <span style={S.typeTag}>{fb.type || "Görüş"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#e2e8f0", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fb.message}</div>
                    <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{fb.name} · {fmt(fb.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
