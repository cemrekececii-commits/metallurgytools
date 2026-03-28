"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function FeedbackAdmin() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/feedback?key=metallurgy2026")
      .then(r => r.json())
      .then(data => {
        if (data.feedback) setFeedback(data.feedback);
        else setError("No data");
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const typeIcon = { "Yeni Araç Talebi": "🔧", "New Tool Request": "🔧", "Mevcut Araç Önerisi": "💡", "Existing Tool Suggestion": "💡", "Hata Bildirimi": "🐛", "Bug Report": "🐛", "Genel Görüş": "💬", "General Feedback": "💬" };
  const typeColor = { "Yeni Araç Talebi": "bg-blue-500/20 text-blue-400", "New Tool Request": "bg-blue-500/20 text-blue-400", "Hata Bildirimi": "bg-red-500/20 text-red-400", "Bug Report": "bg-red-500/20 text-red-400" };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 no-underline text-dark-50">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-lg tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-dark-200 text-sm">📬 Admin — Geri Bildirimler</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30">ADMIN</span>
          <span className="text-xs text-dark-300 font-mono">{feedback.length} kayıt</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">📬 Geri Bildirimler & İstekler</h1>

        {loading && <p className="text-dark-300">Yükleniyor...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && feedback.length === 0 && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-12 text-center text-dark-300">
            <div className="text-4xl mb-3 opacity-40">📭</div>
            <p>Henüz geri bildirim yok.</p>
          </div>
        )}

        <div className="space-y-4">
          {feedback.map((fb) => (
            <div key={fb.id} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 hover:border-gold-400/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded border ${typeColor[fb.type] || "bg-white/10 text-dark-200"}`}>
                    {typeIcon[fb.type] || "💬"} {fb.type}
                  </span>
                  {!fb.read && <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />}
                </div>
                <span className="text-[10px] text-dark-300 font-mono">
                  {new Date(fb.date).toLocaleString("tr-TR")}
                </span>
              </div>
              <p className="text-dark-50 text-sm leading-relaxed mb-3">{fb.message}</p>
              <div className="flex items-center gap-4 text-xs text-dark-300">
                <span>👤 {fb.name}</span>
                <span>📧 {fb.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
