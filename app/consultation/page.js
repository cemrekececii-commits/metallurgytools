"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const CATEGORIES = {
  tr: [
    { value: "hasar_analizi",     label: "Hasar Analizi / Kırılma Analizi" },
    { value: "mekanik_test",      label: "Mekanik Test Yorumlama" },
    { value: "surekli_dokum",     label: "Sürekli Döküm Prosesi" },
    { value: "sicak_hadde",       label: "Sıcak Haddeleme" },
    { value: "ikincil_metalurji", label: "İkincil Metalurji / BOF / EAF" },
    { value: "kalite_kontrol",    label: "Kalite Kontrol & Standart Uyumu" },
    { value: "mikroyapi",         label: "Mikroyapı & Faz Analizi" },
    { value: "diger",             label: "Diğer" },
  ],
  en: [
    { value: "hasar_analizi",     label: "Failure Analysis / Fracture Analysis" },
    { value: "mekanik_test",      label: "Mechanical Test Interpretation" },
    { value: "surekli_dokum",     label: "Continuous Casting Process" },
    { value: "sicak_hadde",       label: "Hot Rolling" },
    { value: "ikincil_metalurji", label: "Secondary Metallurgy / BOF / EAF" },
    { value: "kalite_kontrol",    label: "Quality Control & Standard Compliance" },
    { value: "mikroyapi",         label: "Microstructure & Phase Analysis" },
    { value: "diger",             label: "Other" },
  ],
};

const T = {
  tr: {
    title: "Metalurji Danışmanlık Talebi",
    subtitle: "Sorunuzu veya analiz talebinizi ayrıntılı biçimde iletin. Mühendislik topluluğumuz inceleyerek yanıt verecektir.",
    breadHome: "Ana Sayfa",
    breadSection: "Danışmanlık",
    sectionContact: "İletişim Bilgileri",
    name: "Ad Soyad *",
    email: "E-posta Adresi *",
    company: "Şirket / Kurum",
    sectionProblem: "Sorun Tanımı",
    subject: "Konu Başlığı *",
    category: "Kategori *",
    steelGrade: "Çelik Kalitesi / Grade",
    steelGradePh: "Örn: S355J2, API 5L X70, DP600, 1080HC...",
    standard: "İlgili Standart / Spesifikasyon",
    standardPh: "Örn: EN 10025, API 5L PSL2, ASTM A615...",
    sectionChem: "Kimyasal Analiz",
    chemDesc: "Kimyasal kompozisyon verilerini giriniz. Sertifika değerleri veya tahlil sonuçları kabul edilir.",
    chemPh: "Örn:\nC: 0.18%  Mn: 1.42%  Si: 0.28%  P: 0.012%  S: 0.004%\nCr: 0.08%  Ni: 0.06%  Mo: 0.01%  V: 0.003%  Nb: 0.038%\nAl(sol): 0.032%  Cu: 0.05%  N: 0.006%  Ceq: 0.44",
    sectionSituation: "Yaşanan Durum",
    situation: "Sorun / Arıza Açıklaması *",
    situationPh: "Yaşanan sorunu mümkün olduğunca ayrıntılı açıklayınız:\n— Ne zaman fark edildi?\n— Hangi proses aşamasında oluşuyor?\n— Müşteri şikayeti mi, yoksa tesis içi tespit mi?\n— Makroskopik / mikroskopik bulgular neler?\n— Kırılma yüzeyi morfolojisi, çatlak yönü vs.",
    sectionProcess: "Proses Parametreleri",
    processParams: "Proses Koşulları",
    processPh: "İlgili proses parametrelerini giriniz:\n\n[Sürekli Döküm] Döküm hızı, menisküs seviyesi, soğutma suyu debisi, tundish sıcaklığı...\n[Haddeleme] Slab/kütük giriş sıcaklığı, bitiş sıcaklığı, redüksiyon oranları, soğutma hızı...\n[Isıl İşlem] Tavlama sıcaklığı, süre, soğutma ortamı...\n[Test Koşulları] Test sıcaklığı, yüklenme hızı, numune boyutları...",
    sectionAddl: "Ek Bilgiler",
    additionalInfo: "Diğer Bilgiler / Gözlemler",
    addlPh: "Periyodik gözlemler, geçmiş veriler, üretim hattı geçmişi, benzer vakalar, daha önce denenen çözümler...",
    sectionFiles: "Dosya ve Görüntü Yükleme",
    filesDesc: "Metalografik görüntüler, kırılma yüzeyi fotoğrafları, test raporları veya çizimler yükleyebilirsiniz. Maks. 5 dosya, her biri 8 MB.",
    filesBtn: "Dosya Seç (JPG, PNG, PDF, TIFF)",
    filesNone: "Henüz dosya seçilmedi",
    submit: "Danışmanlık Talebini Gönder",
    submitting: "Gönderiliyor...",
    successTitle: "Talebiniz Alındı",
    successMsg: "Danışmanlık talebiniz başarıyla iletildi. Mühendislik ekibimiz en kısa sürede inceleyerek e-posta adresinize yanıt verecektir.",
    successBack: "Ana Sayfaya Dön",
    errorMsg: "Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyiniz.",
    required: "* ile işaretli alanlar zorunludur.",
    fileSizeErr: (name) => `"${name}" dosyası 8 MB sınırını aşıyor.`,
    fileCountErr: "En fazla 5 dosya yükleyebilirsiniz.",
  },
  en: {
    title: "Metallurgical Consultation Request",
    subtitle: "Submit your problem or analysis request in detail. Our engineering collective will review and respond.",
    breadHome: "Home",
    breadSection: "Consultation",
    sectionContact: "Contact Information",
    name: "Full Name *",
    email: "Email Address *",
    company: "Company / Institution",
    sectionProblem: "Problem Definition",
    subject: "Subject Title *",
    category: "Category *",
    steelGrade: "Steel Grade / Quality",
    steelGradePh: "e.g. S355J2, API 5L X70, DP600, 1080HC...",
    standard: "Applicable Standard / Specification",
    standardPh: "e.g. EN 10025, API 5L PSL2, ASTM A615...",
    sectionChem: "Chemical Analysis",
    chemDesc: "Enter chemical composition data. Certificate values or analytical results are accepted.",
    chemPh: "e.g.:\nC: 0.18%  Mn: 1.42%  Si: 0.28%  P: 0.012%  S: 0.004%\nCr: 0.08%  Ni: 0.06%  Mo: 0.01%  V: 0.003%  Nb: 0.038%\nAl(sol): 0.032%  Cu: 0.05%  N: 0.006%  Ceq: 0.44",
    sectionSituation: "Observed Condition",
    situation: "Problem / Failure Description *",
    situationPh: "Describe the problem in as much detail as possible:\n— When was it detected?\n— At which process stage does it occur?\n— Customer complaint or in-house detection?\n— Macroscopic / microscopic findings?\n— Fracture surface morphology, crack direction, etc.",
    sectionProcess: "Process Parameters",
    processParams: "Process Conditions",
    processPh: "Enter relevant process parameters:\n\n[Continuous Casting] Casting speed, meniscus level, cooling water flow, tundish temperature...\n[Rolling] Slab/billet entry temperature, finishing temperature, reduction ratios, cooling rate...\n[Heat Treatment] Annealing temperature, duration, cooling medium...\n[Test Conditions] Test temperature, loading rate, specimen dimensions...",
    sectionAddl: "Additional Information",
    additionalInfo: "Other Observations / Notes",
    addlPh: "Periodic observations, historical data, production history, similar cases, previously attempted remedies...",
    sectionFiles: "File & Image Upload",
    filesDesc: "You may upload micrographs, fracture surface photographs, test reports, or drawings. Max. 5 files, 8 MB each.",
    filesBtn: "Select Files (JPG, PNG, PDF, TIFF)",
    filesNone: "No files selected",
    submit: "Submit Consultation Request",
    submitting: "Submitting...",
    successTitle: "Request Received",
    successMsg: "Your consultation request has been successfully submitted. Our engineering team will review it and respond to your email address as soon as possible.",
    successBack: "Return to Home",
    errorMsg: "An error occurred during submission. Please try again.",
    required: "Fields marked with * are required.",
    fileSizeErr: (name) => `"${name}" exceeds the 8 MB file size limit.`,
    fileCountErr: "You may upload a maximum of 5 files.",
  },
};

function getS(isDark) {
  return {
    page:    { background: isDark ? "#0a0a0a" : "#f1f5f9", minHeight: "100vh" },
    hero:    { background: isDark ? "linear-gradient(135deg,#0f1e3a,#091225 70%,#0a0a0a)" : "linear-gradient(135deg,#dbeafe,#eff6ff 70%,#f1f5f9)" },
    card:    { background: isDark ? "#111827" : "#ffffff", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", borderRadius: 12, padding: "24px 28px", marginBottom: 20 },
    label:   { color: isDark ? "#94a3b8" : "#475569", fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" },
    input:   { width: "100%", background: isDark ? "#0f172a" : "#f8fafc", border: isDark ? "1px solid #1e293b" : "1px solid #cbd5e1", borderRadius: 8, padding: "10px 14px", color: isDark ? "#e2e8f0" : "#0f172a", fontSize: 14, outline: "none", boxSizing: "border-box" },
    textarea:{ width: "100%", background: isDark ? "#0f172a" : "#f8fafc", border: isDark ? "1px solid #1e293b" : "1px solid #cbd5e1", borderRadius: 8, padding: "10px 14px", color: isDark ? "#e2e8f0" : "#0f172a", fontSize: 13, lineHeight: 1.7, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "monospace" },
    select:  { width: "100%", background: isDark ? "#0f172a" : "#f8fafc", border: isDark ? "1px solid #1e293b" : "1px solid #cbd5e1", borderRadius: 8, padding: "10px 14px", color: isDark ? "#e2e8f0" : "#0f172a", fontSize: 14, outline: "none", boxSizing: "border-box" },
    sectionHead: { color: isDark ? "#f1f5f9" : "#0f172a", fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
    desc:    { color: isDark ? "#64748b" : "#94a3b8", fontSize: 12, marginBottom: 10, lineHeight: 1.6 },
    fileBox: { border: isDark ? "2px dashed #1e293b" : "2px dashed #cbd5e1", borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer", transition: "border-color .2s" },
    fileChip:{ display: "inline-flex", alignItems: "center", gap: 6, background: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: isDark ? "#94a3b8" : "#475569", margin: "4px" },
    submitBtn:{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em" },
    errorBox:{ background: "#450a0a", border: "1px solid #dc2626", borderRadius: 8, padding: "12px 16px", color: "#f87171", fontSize: 13, marginBottom: 16 },
    linkColor: isDark ? "#60a5fa" : "#2563eb",
    breadcrumb: isDark ? "#64748b" : "#94a3b8",
    titleColor: isDark ? "#f1f5f9" : "#0f172a",
    subColor: isDark ? "#64748b" : "#6b7280",
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  };
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block", color: "inherit" }}>{label}</label>
      {children}
    </div>
  );
}

export default function ConsultationPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const S = getS(isDark);
  const t = T[lang] || T.tr;
  const cats = CATEGORIES[lang] || CATEGORIES.tr;
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "", email: "", company: "",
    subject: "", category: "hasar_analizi",
    steelGrade: "", standard: "",
    chemicalAnalysis: "",
    situation: "",
    processParams: "",
    additionalInfo: "",
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    const combined = [...files, ...selected];
    if (combined.length > 5) { setError(t.fileCountErr); return; }
    for (const f of selected) {
      if (f.size > 8 * 1024 * 1024) { setError(t.fileSizeErr(f.name)); return; }
    }
    setError("");
    setFiles(combined);
  };

  const removeFile = (i) => setFiles(f => f.filter((_, idx) => idx !== i));

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, data: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.subject || !form.situation) {
      setError(t.required); return;
    }
    setSubmitting(true);
    try {
      const encodedFiles = await Promise.all(files.map(toBase64));
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, files: encodedFiles }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "err");
      setSuccess(true);
    } catch {
      setError(t.errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={S.page}>
        <Navbar />
        <div style={{ paddingTop: 120, maxWidth: 560, margin: "0 auto", padding: "120px 24px 60px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
          <h2 style={{ color: S.titleColor, fontWeight: 800, fontSize: 24, marginBottom: 12 }}>{t.successTitle}</h2>
          <p style={{ color: S.subColor, lineHeight: 1.7, marginBottom: 28 }}>{t.successMsg}</p>
          <Link href="/" style={{ display: "inline-block", background: "#2563eb", color: "#fff", padding: "12px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>
            {t.successBack}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <Navbar />

      {/* HERO */}
      <div style={{ ...S.hero, paddingTop: 64 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 32px" }}>
          <div style={{ color: S.breadcrumb, fontSize: 13, marginBottom: 14 }}>
            <Link href="/" style={{ color: S.linkColor }}>{t.breadHome}</Link>
            {" → "}
            <span>{t.breadSection}</span>
          </div>
          <h1 style={{ color: S.titleColor, fontWeight: 800, fontSize: 28, margin: "0 0 8px" }}>{t.title}</h1>
          <p style={{ color: S.subColor, fontSize: 14, lineHeight: 1.7, maxWidth: 620 }}>{t.subtitle}</p>
        </div>
      </div>

      {/* FORM */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 80px" }}>
        <form onSubmit={handleSubmit}>

          {/* ── 1. İLETİŞİM ── */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>👤</span>{t.sectionContact}</div>
            <div style={S.grid2}>
              <Field label={t.name}>
                <input style={S.input} value={form.name} onChange={set("name")} required />
              </Field>
              <Field label={t.email}>
                <input style={S.input} type="email" value={form.email} onChange={set("email")} required />
              </Field>
            </div>
            <Field label={t.company}>
              <input style={S.input} value={form.company} onChange={set("company")} />
            </Field>
          </div>

          {/* ── 2. SORUN TANIMI ── */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>📋</span>{t.sectionProblem}</div>
            <Field label={t.subject}>
              <input style={S.input} value={form.subject} onChange={set("subject")} required />
            </Field>
            <div style={S.grid2}>
              <Field label={t.category}>
                <select style={S.select} value={form.category} onChange={set("category")}>
                  {cats.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Field>
              <Field label={t.steelGrade}>
                <input style={S.input} placeholder={t.steelGradePh} value={form.steelGrade} onChange={set("steelGrade")} />
              </Field>
            </div>
            <Field label={t.standard}>
              <input style={S.input} placeholder={t.standardPh} value={form.standard} onChange={set("standard")} />
            </Field>
          </div>

          {/* ── 3. KİMYASAL ANALİZ ── */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>🧪</span>{t.sectionChem}</div>
            <p style={S.desc}>{t.chemDesc}</p>
            <textarea
              style={{ ...S.textarea, minHeight: 110 }}
              placeholder={t.chemPh}
              value={form.chemicalAnalysis}
              onChange={set("chemicalAnalysis")}
            />
          </div>

          {/* ── 4. YAŞANAN DURUM ── */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>🔍</span>{t.sectionSituation}</div>
            <Field label={t.situation}>
              <textarea
                style={{ ...S.textarea, minHeight: 180, fontFamily: "inherit" }}
                placeholder={t.situationPh}
                value={form.situation}
                onChange={set("situation")}
                required
              />
            </Field>
          </div>

          {/* ── 5. PROSES PARAMETRELERİ ── */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>⚙️</span>{t.sectionProcess}</div>
            <Field label={t.processParams}>
              <textarea
                style={{ ...S.textarea, minHeight: 160 }}
                placeholder={t.processPh}
                value={form.processParams}
                onChange={set("processParams")}
              />
            </Field>
          </div>

          {/* ── 6. EK BİLGİLER ── */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>📝</span>{t.sectionAddl}</div>
            <Field label={t.additionalInfo}>
              <textarea
                style={{ ...S.textarea, minHeight: 100, fontFamily: "inherit" }}
                placeholder={t.addlPh}
                value={form.additionalInfo}
                onChange={set("additionalInfo")}
              />
            </Field>
          </div>

          {/* ── 7. DOSYA YÜKLEME ── */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>📎</span>{t.sectionFiles}</div>
            <p style={S.desc}>{t.filesDesc}</p>

            <div
              style={S.fileBox}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFiles({ target: { files: e.dataTransfer.files } }); }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
              <div style={{ color: S.linkColor, fontWeight: 600, fontSize: 14 }}>{t.filesBtn}</div>
              <div style={{ color: S.subColor, fontSize: 12, marginTop: 4 }}>drag & drop</div>
            </div>
            <input ref={fileRef} type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.tif,.tiff" style={{ display: "none" }} onChange={handleFiles} />

            {files.length === 0 ? (
              <div style={{ color: S.subColor, fontSize: 12, marginTop: 10 }}>{t.filesNone}</div>
            ) : (
              <div style={{ marginTop: 12 }}>
                {files.map((f, i) => (
                  <span key={i} style={S.fileChip}>
                    📄 {f.name} <span style={{ fontSize: 10, opacity: .7 }}>({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
                    <button type="button" onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── GİZLİLİK BİLDİRİMİ ── */}
          <div style={{ background: isDark ? "#0c1a2e" : "#eff6ff", border: isDark ? "1px solid #1e3a6e" : "1px solid #bfdbfe", borderRadius: 12, padding: "20px 24px", marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>🔒</span>
              <div>
                <div style={{ color: isDark ? "#60a5fa" : "#1d4ed8", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                  {lang === "tr" ? "Gizlilik ve Veri Güvenliği Güvencesi" : "Privacy & Data Security Assurance"}
                </div>
                {lang === "tr" ? (
                  <div style={{ color: isDark ? "#94a3b8" : "#475569", fontSize: 13, lineHeight: 1.8 }}>
                    Bu forma girilen tüm bilgiler — kimyasal analiz verileri, proses parametreleri, firma bilgileri ve yüklenen dosyalar dahil — <strong style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}>yalnızca danışmanlık hizmetinin sunulması amacıyla</strong> kullanılmakta olup hiçbir üçüncü tarafla paylaşılmamaktadır.
                    <br /><br />
                    Verileriniz <strong style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}>şifrelenmiş sunucularda</strong> saklanmakta, ticari amaçlarla kullanılmamakta ve herhangi bir reklam, araştırma veya yayın platformuna iletilmemektedir. Talep etmeniz halinde verileriniz sistemden tamamen silinir.
                    <br /><br />
                    <span style={{ color: isDark ? "#64748b" : "#6b7280", fontSize: 12 }}>MetallurgyTools · Tüm iletişim gizlilik esasıyla yürütülür · ISO 27001 uyumlu altyapı</span>
                  </div>
                ) : (
                  <div style={{ color: isDark ? "#94a3b8" : "#475569", fontSize: 13, lineHeight: 1.8 }}>
                    All information entered in this form — including chemical analysis data, process parameters, company information and uploaded files — is used <strong style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}>solely for the purpose of providing the consultation service</strong> and is not shared with any third party.
                    <br /><br />
                    Your data is stored on <strong style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}>encrypted servers</strong>, is not used for commercial purposes, and is not transmitted to any advertising, research or publication platform. Upon request, your data will be permanently deleted from our systems.
                    <br /><br />
                    <span style={{ color: isDark ? "#64748b" : "#6b7280", fontSize: 12 }}>MetallurgyTools · All communications are conducted under strict confidentiality · ISO 27001 compliant infrastructure</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && <div style={S.errorBox}>⚠️ {error}</div>}

          {/* SUBMIT */}
          <button type="submit" style={{ ...S.submitBtn, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
            {submitting ? t.submitting : t.submit}
          </button>

          <p style={{ color: S.subColor, fontSize: 11, textAlign: "center", marginTop: 12 }}>{t.required}</p>
        </form>
      </div>
    </div>
  );
}
