"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const ADMIN_KEY = "metallurgy2026";

const LANGS = [
  { code: "tr", label: "🇹🇷 TR", name: "Türkçe" },
  { code: "en", label: "🇬🇧 EN", name: "English" },
  { code: "zh", label: "🇨🇳 ZH", name: "中文" },
  { code: "ja", label: "🇯🇵 JA", name: "日本語" },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function wordCount(text) {
  return text?.split(/\s+/).filter(Boolean).length || 0;
}

function estimateReadingTime(text) {
  return Math.max(1, Math.ceil(wordCount(text) / 200));
}

const EMPTY_LANG = { title: "", summary: "", content: "" };
const EMPTY_FORM = {
  slug: "",
  coverImage: "",
  tags: "",
  status: "draft",
  date: new Date().toISOString().slice(0, 10),
  tr: { ...EMPTY_LANG },
  en: { ...EMPTY_LANG },
  zh: { ...EMPTY_LANG },
  ja: { ...EMPTY_LANG },
};

/* ── Simple Markdown Preview ── */
function previewHtml(md) {
  if (!md) return "<p style='color:#555;font-style:italic'>İçerik yok / No content.</p>";
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/```[\w]*\n([\s\S]*?)```/g, (_, c) =>
      `<pre style="background:#0d1117;padding:1rem;border-radius:6px;overflow-x:auto;font-size:0.83rem;color:#c9d1d9;border:1px solid #30363d;margin:0.75rem 0"><code>${c.trimEnd()}</code></pre>`)
    .replace(/(\|.+\|\n)+/g, (tbl) => {
      const rows = tbl.trim().split("\n");
      let out = '<div style="overflow-x:auto;margin:0.75rem 0"><table style="width:100%;border-collapse:collapse;font-size:0.875rem">';
      rows.forEach((row, i) => {
        if (/^\|[-| ]+\|$/.test(row)) return;
        const cells = row.split("|").slice(1, -1);
        const tag = i === 0 ? "th" : "td";
        const style = i === 0
          ? "padding:0.4rem 0.7rem;border:1px solid #30363d;background:#161b22;color:#d2a935;font-weight:600;font-size:0.8rem"
          : "padding:0.4rem 0.7rem;border:1px solid #21262d;color:#c9d1d9";
        out += "<tr>" + cells.map(c => `<${tag} style="${style}">${c.trim()}</${tag}>`).join("") + "</tr>";
      });
      return out + "</table></div>";
    })
    .replace(/^&gt; (.+)$/gm, '<blockquote style="border-left:3px solid #d2a935;padding:0.2rem 0 0.2rem 1rem;margin:0.5rem 0;color:#8b949e;font-style:italic">$1</blockquote>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#d2a935;margin:1rem 0 0.3rem;font-size:1rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#e6edf3;border-bottom:1px solid #21262d;padding-bottom:0.3rem;margin:1.2rem 0 0.5rem;font-size:1.1rem">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:#f0f6fc;font-size:1.3rem;margin:1rem 0 0.5rem;font-weight:700">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08);padding:0.1em 0.4em;border-radius:3px;font-size:0.85em;color:#d2a935">$1</code>')
    .replace(/((?:^- .+\n?)+)/gm, b =>
      `<ul style="padding-left:1.5rem;margin:0.5rem 0">${b.trim().split("\n").map(l => `<li style="margin:0.2rem 0;color:#c9d1d9">${l.replace(/^- /, "")}</li>`).join("")}</ul>`)
    .replace(/((?:^\d+\. .+\n?)+)/gm, b =>
      `<ol style="padding-left:1.5rem;margin:0.5rem 0">${b.trim().split("\n").map(l => `<li style="margin:0.2rem 0;color:#c9d1d9">${l.replace(/^\d+\. /, "")}</li>`).join("")}</ol>`)
    .replace(/^(?!<[huo]|<pre|<bloc|<div|<table)(.+)$/gm, '<p style="margin:0.5rem 0;color:#c9d1d9;line-height:1.7">$1</p>');
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [activeLang, setActiveLang] = useState("tr"); // current language tab in editor
  const [contentTab, setContentTab] = useState("editor"); // editor | preview
  const [uploading, setUploading] = useState(false);
  const [multiUploading, setMultiUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState("");
  const fileInputRef = useRef(null);
  const multiFileInputRef = useRef(null);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    fetch(`/api/blog?adminKey=${ADMIN_KEY}&_t=${Date.now()}`, { cache: "no-store" })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPosts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  /* ── helpers ── */
  const setMsg_ = (text, type = "ok") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 4000);
  };

  const updateLangField = (langCode, field, value) => {
    setForm(f => ({ ...f, [langCode]: { ...f[langCode], [field]: value } }));
  };

  /* ── Base64 upload (reliable, no FormData parsing issues) ── */
  const uploadFileBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      if (file.size > 15 * 1024 * 1024) {
        reject(new Error(`Dosya çok büyük (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimum 15 MB.`));
        return;
      }
      if (!file.type.startsWith("image/")) {
        reject(new Error(`Geçersiz dosya türü: ${file.type}. Lütfen resim dosyası seçin.`));
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const r = await fetch("/api/blog/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              adminKey: ADMIN_KEY,
              name: file.name,
              type: file.type,
              data: e.target.result, // data:image/...;base64,...
            }),
          });
          let data;
          try { data = await r.json(); } catch { data = { error: "Sunucu JSON döndürmedi" }; }
          if (r.ok) resolve(data);
          else reject(new Error(data.error || `Sunucu hatası (${r.status})`));
        } catch (err) {
          reject(new Error(`Bağlantı hatası: ${err.message}`));
        }
      };
      reader.onerror = () => reject(new Error("Dosya okunamadı."));
      reader.readAsDataURL(file);
    });
  };

  /* ── Cover image upload ── */
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadFileBase64(file);
      setForm(f => ({ ...f, coverImage: data.url }));
      setMsg_("✓ Kapak görseli yüklendi.");
    } catch (err) {
      setMsg_(err.message, "err");
    } finally {
      setUploading(false);
    }
  };

  /* ── Multi-image upload for article body ── */
  const handleMultiUpload = async (files) => {
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files);
    setMultiUploading(true);
    const results = [];
    for (const file of fileArr) {
      try {
        const data = await uploadFileBase64(file);
        results.push({ url: data.url, name: file.name, ok: true });
      } catch (err) {
        results.push({ url: null, name: file.name, ok: false, error: err.message });
      }
    }
    setUploadedImages(prev => [
      ...results.filter(r => r.ok).map(r => r.url),
      ...prev,
    ]);
    const failed = results.filter(r => !r.ok);
    if (failed.length > 0) {
      setMsg_(`${results.length - failed.length} yüklendi, ${failed.length} başarısız: ${failed[0].error}`, "err");
    } else {
      setMsg_(`✓ ${results.length} görsel yüklendi.`);
    }
    setMultiUploading(false);
  };

  /* ── Insert image markdown at cursor ── */
  const insertImageMarkdown = (url, textareaRef) => {
    const md = `\n![görsel](${url})\n`;
    updateLangField(activeLang, "content", (curLang.content || "") + md);
    setMsg_("✓ Görsel markdown'a eklendi.");
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = "";
  };

  /* ── Drag & drop on cover image ── */
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleImageUpload(file);
  };

  /* ── Edit / New ── */
  const handleEdit = (post) => {
    setEditId(post.id);
    setForm({
      slug: post.slug || "",
      coverImage: post.coverImage || "",
      tags: (post.tags || []).join(", "),
      status: post.status || "draft",
      date: post.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      tr: post.tr || { ...EMPTY_LANG },
      en: post.en || { ...EMPTY_LANG },
      zh: post.zh || { ...EMPTY_LANG },
      ja: post.ja || { ...EMPTY_LANG },
    });
    setActiveLang("tr");
    setContentTab("editor");
    setView("edit");
    setMsg({ text: "", type: "" });
  };

  const handleNew = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setActiveLang("tr");
    setContentTab("editor");
    setView("edit");
    setMsg({ text: "", type: "" });
  };

  /* ── Auto-slug from TR title ── */
  const handleTrTitleChange = (val) => {
    updateLangField("tr", "title", val);
    if (!editId) {
      setForm(f => ({ ...f, slug: f.slug || slugify(val) }));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu makaleyi silmek istediğinizden emin misiniz?")) return;
    const r = await fetch(`/api/blog/${id}?adminKey=${ADMIN_KEY}`, { method: "DELETE" });
    if (r.ok) { setMsg_("Silindi."); fetchPosts(); }
  };

  /* ── Save ── */
  const handleSave = async (statusOverride) => {
    setSaving(true);
    setMsg({ text: "", type: "" });

    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const finalStatus = statusOverride || form.status;
    const payload = {
      slug: form.slug,
      coverImage: form.coverImage,
      tags,
      status: finalStatus,
      date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
      tr: form.tr,
      en: form.en,
      zh: form.zh,
      ja: form.ja,
      adminKey: ADMIN_KEY,
    };

    try {
      if (editId) {
        const r = await fetch(`/api/blog/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        let data;
        try { data = await r.json(); } catch { data = {}; }
        if (r.ok) {
          setForm(f => ({ ...f, status: data.status || finalStatus }));
          setMsg_(finalStatus === "published" ? "✓ Yayınlandı." : "✓ Taslak kaydedildi.");
          fetchPosts();
        } else {
          setMsg_(data.error || `Sunucu hatası (${r.status})`, "err");
        }
      } else {
        const r = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        let data;
        try { data = await r.json(); } catch { data = {}; }
        if (r.ok) {
          setMsg_(finalStatus === "published" ? "✓ Yayınlandı." : "✓ Taslak oluşturuldu.");
          setEditId(data.id);
          setForm(f => ({ ...f, status: data.status || finalStatus }));
          fetchPosts();
        } else {
          setMsg_(data.error || `Sunucu hatası (${r.status})`, "err");
        }
      }
    } catch (err) {
      setMsg_("Bağlantı hatası — sunucu yanıt vermedi.", "err");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  /* ── Current lang data ── */
  const curLang = form[activeLang] || EMPTY_LANG;
  const primaryContent = form.tr?.content || form.en?.content || "";

  /* ══════════════════════════════════════════════════════════
     EDIT VIEW
  ══════════════════════════════════════════════════════════ */
  if (view === "edit") {
    return (
      <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setView("list")} className="text-sm text-dark-400 hover:text-gold-400 cursor-pointer bg-transparent border-none font-sans">
              ← Liste
            </button>
            <h1 className="text-xl font-bold text-dark-50">
              {editId ? "Makale Düzenle" : "Yeni Makale"}
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {msg.text && (
              <span className={`text-sm ${msg.type === "err" ? "text-red-400" : "text-green-400"}`}>
                {msg.text}
              </span>
            )}
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg border border-white/15 text-dark-200 text-sm cursor-pointer font-sans hover:border-gold-400/40 hover:text-gold-400 transition-all disabled:opacity-50"
            >
              Taslak Kaydet
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="px-4 py-1.5 rounded-lg bg-gold-400 text-dark-800 text-sm font-semibold cursor-pointer font-sans hover:bg-gold-300 transition-all disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Yayınla"}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* ── LEFT: Language tabs + Editor ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Language Tabs */}
            <div className="flex items-center gap-1 bg-dark-800/60 border border-white/[0.07] rounded-xl p-1.5">
              {LANGS.map((l) => {
                const hasContent = !!(form[l.code]?.title);
                return (
                  <button
                    key={l.code}
                    onClick={() => setActiveLang(l.code)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer font-sans transition-all border ${
                      activeLang === l.code
                        ? "bg-gold-400/10 border-gold-400/30 text-gold-400"
                        : "bg-transparent border-transparent text-dark-400 hover:text-dark-200"
                    }`}
                  >
                    {l.label}
                    {hasContent && <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Language helper text */}
            <p className="text-[11px] text-dark-500 -mt-2 px-1">
              {activeLang === "tr"
                ? "Ana dil — slug buradan otomatik oluşturulur."
                : `${LANGS.find(l => l.code === activeLang)?.name} çevirisi — boşsa Türkçe içerik gösterilir.`}
            </p>

            {/* Title */}
            <div>
              <label className="block text-xs text-dark-400 font-mono uppercase tracking-wide mb-1">
                Başlık / Title *
              </label>
              <input
                type="text"
                value={curLang.title}
                onChange={(e) => {
                  if (activeLang === "tr") handleTrTitleChange(e.target.value);
                  else updateLangField(activeLang, "title", e.target.value);
                }}
                placeholder={activeLang === "tr" ? "Makale başlığı..." : "Article title..."}
                className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-white/10 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-gold-400/50 text-sm"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs text-dark-400 font-mono uppercase tracking-wide mb-1">
                Özet / Summary
              </label>
              <textarea
                value={curLang.summary}
                onChange={(e) => updateLangField(activeLang, "summary", e.target.value)}
                placeholder="150–200 karakter özet..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-white/10 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-gold-400/50 text-sm resize-y"
              />
            </div>

            {/* Content editor / preview */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <label className="text-xs text-dark-400 font-mono uppercase tracking-wide mr-1">
                  İçerik / Content (Markdown)
                </label>
                <button
                  onClick={() => setContentTab("editor")}
                  className={`text-xs px-2.5 py-1 rounded cursor-pointer font-sans border transition-all ${
                    contentTab === "editor"
                      ? "bg-gold-400/10 border-gold-400/30 text-gold-400"
                      : "bg-transparent border-white/10 text-dark-400 hover:text-dark-200"
                  }`}
                >
                  Editör
                </button>
                <button
                  onClick={() => setContentTab("preview")}
                  className={`text-xs px-2.5 py-1 rounded cursor-pointer font-sans border transition-all ${
                    contentTab === "preview"
                      ? "bg-gold-400/10 border-gold-400/30 text-gold-400"
                      : "bg-transparent border-white/10 text-dark-400 hover:text-dark-200"
                  }`}
                >
                  Önizleme
                </button>
                {/* Toggle image panel */}
                <button
                  onClick={() => setShowImagePanel(p => !p)}
                  className={`ml-auto text-xs px-2.5 py-1 rounded cursor-pointer font-sans border transition-all ${
                    showImagePanel
                      ? "bg-blue-500/10 border-blue-400/30 text-blue-400"
                      : "bg-transparent border-white/10 text-dark-400 hover:text-dark-200"
                  }`}
                >
                  🖼️ Makale Görselleri {uploadedImages.length > 0 && `(${uploadedImages.length})`}
                </button>
              </div>

              {contentTab === "editor" ? (
                <textarea
                  value={curLang.content}
                  onChange={(e) => updateLangField(activeLang, "content", e.target.value)}
                  placeholder={`# Başlık / Heading\n\n## Alt Başlık / Subheading\n\nMetin...\n\n| Sütun 1 | Sütun 2 |\n|---------|----------|\n| Değer   | Value    |\n\n\`\`\`\nformül / formula\n\`\`\``}
                  rows={24}
                  className="w-full px-3 py-3 rounded-lg bg-dark-700 border border-white/10 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-gold-400/50 text-sm font-mono resize-y"
                  style={{ lineHeight: 1.6 }}
                />
              ) : (
                <div
                  className="w-full min-h-[440px] px-4 py-4 rounded-lg bg-dark-700 border border-white/10 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: previewHtml(curLang.content) }}
                />
              )}

              <div className="flex items-center gap-4 mt-1 text-[11px] text-dark-500">
                <span>{wordCount(curLang.content)} kelime</span>
                <span>~{estimateReadingTime(curLang.content)} dk okuma</span>
                {activeLang !== "tr" && !curLang.content && (
                  <button
                    onClick={() => updateLangField(activeLang, "content", form.tr?.content || "")}
                    className="text-gold-400/70 hover:text-gold-400 cursor-pointer bg-transparent border-none font-sans text-[11px]"
                  >
                    TR içeriği buraya kopyala →
                  </button>
                )}
              </div>
            </div>

            {/* ── Multi-image upload panel ── */}
            {showImagePanel && (
              <div className="bg-dark-800/60 border border-blue-400/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-blue-400 font-mono uppercase tracking-wide">
                    🖼️ Makale Görselleri
                  </label>
                  <span className="text-[11px] text-dark-500">Görsele tıkla → markdown'a ekle</span>
                </div>

                {/* Drop zone / upload button */}
                <div
                  onClick={() => multiFileInputRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
                    if (files.length) handleMultiUpload(files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="cursor-pointer rounded-lg border-2 border-dashed border-blue-400/20 hover:border-blue-400/50 transition-colors flex flex-col items-center justify-center py-5 gap-2"
                >
                  {multiUploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                      <span className="text-xs text-dark-400">Yükleniyor...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-2xl">📁</span>
                      <span className="text-xs text-dark-400 text-center">
                        Birden fazla fotoğraf seç veya sürükle bırak<br/>
                        <span className="text-dark-500">JPG, PNG, WebP, GIF · maks 15 MB</span>
                      </span>
                    </>
                  )}
                </div>

                <input
                  ref={multiFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files?.length) handleMultiUpload(files);
                    e.target.value = "";
                  }}
                />

                {/* Uploaded images gallery */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {uploadedImages.map((url, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={url}
                          alt=""
                          className="w-full h-24 object-cover"
                          onError={(e) => e.target.style.opacity = "0.3"}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                          <button
                            onClick={() => insertImageMarkdown(url)}
                            className="w-full py-1 rounded bg-gold-400 text-dark-800 text-[11px] font-bold cursor-pointer font-sans"
                          >
                            + Yazıya Ekle
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(url);
                              setCopiedUrl(url);
                              setTimeout(() => setCopiedUrl(""), 2000);
                            }}
                            className="w-full py-1 rounded bg-white/10 text-dark-200 text-[11px] cursor-pointer font-sans"
                          >
                            {copiedUrl === url ? "✓ Kopyalandı" : "URL Kopyala"}
                          </button>
                        </div>
                        {/* Remove button */}
                        <button
                          onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-sans leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadedImages.length === 0 && (
                  <p className="text-[11px] text-dark-500 text-center">Henüz görsel yüklenmedi.</p>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Metadata ── */}
          <div className="space-y-4">

            {/* Cover Image */}
            <div className="bg-dark-800/60 border border-white/[0.07] rounded-xl p-4">
              <label className="block text-xs text-dark-400 font-mono uppercase tracking-wide mb-3">
                Kapak Görseli
              </label>

              {/* Drag & drop / click area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-white/15 hover:border-gold-400/40 transition-colors overflow-hidden"
                style={{ minHeight: form.coverImage ? "auto" : "100px" }}
              >
                {form.coverImage ? (
                  <div className="relative">
                    <img
                      src={form.coverImage}
                      alt="cover"
                      className="w-full h-36 object-cover"
                      onError={(e) => e.target.style.display = "none"}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Değiştir / Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-24 text-dark-400">
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-2xl mb-1">🖼️</span>
                        <span className="text-[11px] text-center px-2">Tıkla veya sürükle<br/>Click or drag & drop</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFilePick}
              />

              {/* Buttons row */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex-1 py-1.5 rounded-lg border border-white/10 text-dark-300 hover:text-dark-50 hover:border-white/25 text-xs cursor-pointer font-sans transition-colors disabled:opacity-50"
                >
                  {uploading ? "Yükleniyor..." : "📁 Bilgisayardan Seç"}
                </button>
              </div>

              {/* URL input */}
              <div className="mt-3">
                <label className="block text-[11px] text-dark-500 mb-1">veya URL gir / or enter URL</label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm(f => ({ ...f, coverImage: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-lg bg-dark-700 border border-white/10 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-gold-400/50 text-xs"
                />
              </div>

              {form.coverImage && (
                <button
                  onClick={() => setForm(f => ({ ...f, coverImage: "" }))}
                  className="mt-2 text-[11px] text-red-400/60 hover:text-red-400 cursor-pointer bg-transparent border-none font-sans"
                >
                  Görseli kaldır / Remove
                </button>
              )}
            </div>

            {/* Slug */}
            <div className="bg-dark-800/60 border border-white/[0.07] rounded-xl p-4">
              <label className="block text-xs text-dark-400 font-mono uppercase tracking-wide mb-2">Slug (URL) *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="makale-url-slug"
                className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-white/10 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-gold-400/50 text-sm font-mono"
              />
              {form.slug && (
                <p className="text-[11px] text-dark-400 mt-1">
                  /blog/<span className="text-dark-200">{form.slug}</span>
                </p>
              )}
            </div>

            {/* Status + Date */}
            <div className="bg-dark-800/60 border border-white/[0.07] rounded-xl p-4 space-y-3">
              <div>
                <label className="block text-xs text-dark-400 font-mono uppercase tracking-wide mb-1">Durum</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-white/10 text-dark-50 text-sm cursor-pointer"
                >
                  <option value="draft">Taslak (Draft)</option>
                  <option value="published">Yayında (Published)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-400 font-mono uppercase tracking-wide mb-1">Tarih</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-white/10 text-dark-50 text-sm"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-dark-800/60 border border-white/[0.07] rounded-xl p-4">
              <label className="block text-xs text-dark-400 font-mono uppercase tracking-wide mb-2">Etiketler / Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="S700MC, DWTT, Failure Analysis"
                className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-white/10 text-dark-50 placeholder-dark-400 focus:outline-none focus:border-gold-400/50 text-sm"
              />
              <p className="text-[11px] text-dark-500 mt-1">Virgülle ayırın / Comma separated</p>
              {form.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 text-[11px] font-mono">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Translation status */}
            <div className="bg-dark-800/60 border border-white/[0.07] rounded-xl p-4">
              <label className="block text-xs text-dark-400 font-mono uppercase tracking-wide mb-3">Çeviri Durumu</label>
              <div className="space-y-1.5">
                {LANGS.map(l => {
                  const has = !!(form[l.code]?.title && form[l.code]?.content);
                  return (
                    <div key={l.code} className="flex items-center justify-between">
                      <button
                        onClick={() => setActiveLang(l.code)}
                        className={`text-xs cursor-pointer bg-transparent border-none font-sans ${activeLang === l.code ? "text-gold-400 font-semibold" : "text-dark-300 hover:text-dark-100"}`}
                      >
                        {l.label} {l.name}
                      </button>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${has ? "bg-green-500/10 text-green-400" : "bg-white/[0.04] text-dark-500"}`}>
                        {has ? "✓ Hazır" : "Boş"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live link */}
            {editId && form.status === "published" && form.slug && (
              <Link
                href={`/blog/${form.slug}`}
                target="_blank"
                className="block text-center text-xs text-gold-400 hover:underline no-underline py-2 border border-gold-400/20 rounded-lg hover:border-gold-400/40 transition-colors"
              >
                /blog/{form.slug} ↗ Yayını Gör
              </Link>
            )}
          </div>
        </div>
      </main>
    );
  }

  /* ══════════════════════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════════════════════ */
  return (
    <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-dark-400 mb-2">
            <Link href="/admin" className="hover:text-gold-400 no-underline text-dark-400">Admin</Link>
            <span>/</span>
            <span className="text-dark-200">Blog</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-50">Blog Yönetimi</h1>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 rounded-lg bg-gold-400 text-dark-800 text-sm font-semibold cursor-pointer font-sans hover:bg-gold-300 transition-all"
        >
          + Yeni Makale
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-dark-400">
          <p className="text-4xl mb-3">📝</p>
          <p>Henüz makale yok. İlk makaleyi oluşturun!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const trTitle = post.tr?.title || "(Başlıksız)";
            const hasEn = !!(post.en?.title);
            return (
              <div
                key={post.id}
                className="flex items-center gap-4 bg-dark-800/60 border border-white/[0.07] rounded-xl px-4 py-3 hover:border-white/15 transition-all"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt=""
                    className="w-14 h-12 object-cover rounded-lg opacity-70 shrink-0 hidden sm:block"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                      post.status === "published" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                    {/* Translation indicators */}
                    {LANGS.map(l => (
                      <span
                        key={l.code}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          post[l.code]?.title
                            ? "text-green-400 bg-green-400/10"
                            : "text-dark-500 bg-white/[0.03]"
                        }`}
                      >
                        {l.code.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-dark-100 truncate">{trTitle}</p>
                  <p className="text-[11px] text-dark-400 mt-0.5">
                    {post.date?.slice(0, 10)} · {post.readingTime} dk · {(post.tags || []).slice(0, 3).join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {post.status === "published" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-xs text-dark-400 hover:text-gold-400 no-underline transition-colors"
                      title="Yayını gör"
                    >
                      ↗
                    </Link>
                  )}
                  <button
                    onClick={() => handleEdit(post)}
                    className="px-3 py-1 rounded-lg border border-white/10 text-dark-300 hover:text-dark-50 hover:border-white/25 text-xs cursor-pointer font-sans transition-colors"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-1 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 text-xs cursor-pointer font-sans transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
