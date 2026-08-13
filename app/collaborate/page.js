"use client";
// ─────────────────────────────────────────────────────────────────────────────
// /collaborate — İş birliği başvuru formu
//
// Amaç: derin metalurji bilgisi ile yazılım / yapay zeka / otomasyon
// yetkinliğini bir araya getirecek kişi ve kurumlardan başvuru toplamak.
// Gönderim POST /api/collaboration üzerinden yapılır (rate-limit + KVKK rıza).
//
// Alan grupları:
//   1. Kimlik & iletişim
//   2. Uzmanlık alanları (metalurji) + teknik yığın
//   3. Bağlantılar & portföy
//   4. İş birliği modeli & müsaitlik
//   5. Proje fikri & motivasyon
//   6. Dosya (CV / portföy — maks. 3, PDF/görsel)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

/* ── Seçenek kümeleri — value'lar API beyaz listesiyle birebir aynı ── */

const PROFILES = {
  tr: [
    { value: "metalurji_muhendisi", label: "Metalurji / Malzeme Mühendisi" },
    { value: "yazilim_muhendisi",   label: "Yazılım Mühendisi / Geliştirici" },
    { value: "veri_bilimci",        label: "Veri Bilimci / ML Mühendisi" },
    { value: "otomasyon_muhendisi", label: "Otomasyon / Kontrol Mühendisi" },
    { value: "akademisyen",         label: "Akademisyen / Araştırmacı" },
    { value: "ogrenci",             label: "Lisans / Lisansüstü Öğrenci" },
    { value: "sirket",              label: "Şirket / Kurum" },
    { value: "diger",               label: "Diğer" },
  ],
  en: [
    { value: "metalurji_muhendisi", label: "Metallurgical / Materials Engineer" },
    { value: "yazilim_muhendisi",   label: "Software Engineer / Developer" },
    { value: "veri_bilimci",        label: "Data Scientist / ML Engineer" },
    { value: "otomasyon_muhendisi", label: "Automation / Control Engineer" },
    { value: "akademisyen",         label: "Academic / Researcher" },
    { value: "ogrenci",             label: "Undergraduate / Graduate Student" },
    { value: "sirket",              label: "Company / Institution" },
    { value: "diger",               label: "Other" },
  ],
};

const METALLURGY_AREAS = {
  tr: [
    { value: "hasar_analizi",     label: "Hasar & Kırılma Analizi" },
    { value: "mekanik_test",      label: "Mekanik Test / Fraktografi" },
    { value: "metalografi",       label: "Metalografi & Mikroyapı" },
    { value: "ndt",               label: "Tahribatsız Muayene (UT/RT/MT/PT)" },
    { value: "surekli_dokum",     label: "Sürekli Döküm" },
    { value: "sicak_hadde",       label: "Sıcak Haddeleme / TMCP" },
    { value: "ikincil_metalurji", label: "İkincil Metalurji (LF–RH/VD)" },
    { value: "isil_islem",        label: "Isıl İşlem & Faz Dönüşümü" },
    { value: "kaynak",            label: "Kaynak Metalurjisi" },
    { value: "korozyon",          label: "Korozyon & Yüzey" },
    { value: "kalite_sistemleri", label: "Kalite Sistemleri (IATF/VDA/17025)" },
    { value: "simulasyon",        label: "Proses Simülasyonu / Termodinamik" },
  ],
  en: [
    { value: "hasar_analizi",     label: "Failure & Fracture Analysis" },
    { value: "mekanik_test",      label: "Mechanical Testing / Fractography" },
    { value: "metalografi",       label: "Metallography & Microstructure" },
    { value: "ndt",               label: "Non-Destructive Testing (UT/RT/MT/PT)" },
    { value: "surekli_dokum",     label: "Continuous Casting" },
    { value: "sicak_hadde",       label: "Hot Rolling / TMCP" },
    { value: "ikincil_metalurji", label: "Secondary Metallurgy (LF–RH/VD)" },
    { value: "isil_islem",        label: "Heat Treatment & Phase Transformation" },
    { value: "kaynak",            label: "Welding Metallurgy" },
    { value: "korozyon",          label: "Corrosion & Surface" },
    { value: "kalite_sistemleri", label: "Quality Systems (IATF/VDA/17025)" },
    { value: "simulasyon",        label: "Process Simulation / Thermodynamics" },
  ],
};

const TECH_STACK = {
  tr: [
    { value: "python",             label: "Python" },
    { value: "matlab_r",           label: "MATLAB / R" },
    { value: "cpp_rust",           label: "C / C++ / Rust" },
    { value: "javascript_web",     label: "JavaScript / React / Web" },
    { value: "sql_veritabani",     label: "SQL / Veri Tabanı" },
    { value: "makine_ogrenmesi",   label: "Makine Öğrenmesi (scikit-learn, PyTorch)" },
    { value: "goruntu_isleme",     label: "Görüntü İşleme / Computer Vision" },
    { value: "llm_nlp",            label: "LLM / NLP / RAG" },
    { value: "plc_scada",          label: "PLC / SCADA / DCS" },
    { value: "iiot_sensor",        label: "IIoT / Sensör & Veri Toplama" },
    { value: "bulut_devops",       label: "Bulut / DevOps" },
    { value: "istatistik_doe",     label: "İstatistik / DOE / SPC" },
    { value: "cad_fem",            label: "CAD / FEM / CFD" },
    { value: "veri_gorsellestirme",label: "Veri Görselleştirme / BI" },
  ],
  en: [
    { value: "python",             label: "Python" },
    { value: "matlab_r",           label: "MATLAB / R" },
    { value: "cpp_rust",           label: "C / C++ / Rust" },
    { value: "javascript_web",     label: "JavaScript / React / Web" },
    { value: "sql_veritabani",     label: "SQL / Databases" },
    { value: "makine_ogrenmesi",   label: "Machine Learning (scikit-learn, PyTorch)" },
    { value: "goruntu_isleme",     label: "Image Processing / Computer Vision" },
    { value: "llm_nlp",            label: "LLM / NLP / RAG" },
    { value: "plc_scada",          label: "PLC / SCADA / DCS" },
    { value: "iiot_sensor",        label: "IIoT / Sensors & Data Acquisition" },
    { value: "bulut_devops",       label: "Cloud / DevOps" },
    { value: "istatistik_doe",     label: "Statistics / DOE / SPC" },
    { value: "cad_fem",            label: "CAD / FEM / CFD" },
    { value: "veri_gorsellestirme",label: "Data Visualization / BI" },
  ],
};

const COLLAB_MODES = {
  tr: [
    { value: "ortak_proje",     label: "Ortak proje geliştirme" },
    { value: "acik_kaynak",     label: "Açık kaynak katkı" },
    { value: "danismanlik",     label: "Danışmanlık / freelance" },
    { value: "akademik_yayin",  label: "Akademik yayın & araştırma" },
    { value: "staj_mentorluk",  label: "Staj / mentorluk" },
    { value: "ticari_ortaklik", label: "Ticari ortaklık" },
  ],
  en: [
    { value: "ortak_proje",     label: "Joint project development" },
    { value: "acik_kaynak",     label: "Open-source contribution" },
    { value: "danismanlik",     label: "Consulting / freelance" },
    { value: "akademik_yayin",  label: "Academic publication & research" },
    { value: "staj_mentorluk",  label: "Internship / mentoring" },
    { value: "ticari_ortaklik", label: "Commercial partnership" },
  ],
};

const WORK_MODES = {
  tr: [
    { value: "uzaktan",   label: "Uzaktan" },
    { value: "hibrit",    label: "Hibrit" },
    { value: "yerinde",   label: "Yerinde" },
    { value: "farketmez", label: "Farketmez" },
  ],
  en: [
    { value: "uzaktan",   label: "Remote" },
    { value: "hibrit",    label: "Hybrid" },
    { value: "yerinde",   label: "On-site" },
    { value: "farketmez", label: "No preference" },
  ],
};

const AVAILABILITY = {
  tr: [
    { value: "lt5",         label: "Haftada 5 saatten az" },
    { value: "5_10",        label: "Haftada 5–10 saat" },
    { value: "10_20",       label: "Haftada 10–20 saat" },
    { value: "gt20",        label: "Haftada 20 saatten fazla" },
    { value: "proje_bazli", label: "Proje bazlı / esnek" },
  ],
  en: [
    { value: "lt5",         label: "Less than 5 h / week" },
    { value: "5_10",        label: "5–10 h / week" },
    { value: "10_20",       label: "10–20 h / week" },
    { value: "gt20",        label: "More than 20 h / week" },
    { value: "proje_bazli", label: "Project-based / flexible" },
  ],
};

/* ── Metinler ── */

const T = {
  tr: {
    title: "İş Birliği Başvurusu",
    subtitle: "Derin metalurji bilgisini yazılım, yapay zeka ve otomasyonla birleştiren projelerde birlikte çalışmak isteyen mühendis, araştırmacı, geliştirici ve kurumlar için açık çağrı.",
    breadHome: "Ana Sayfa",
    breadSection: "İş Birliği",

    introTitle: "Neyi Birlikte Kurmak İstiyoruz?",
    introItems: [
      "Mekanik test, metalografi ve NDT verisinin otomatik toplanması, doğrulanması ve istatistiksel değerlendirilmesi",
      "Mikroyapı ve fraktografi görüntülerinde görüntü işleme / derin öğrenme tabanlı sınıflandırma (tane boyutu, inklüzyon, kırılma morfolojisi)",
      "Proses parametresi ↔ mikroyapı ↔ mekanik özellik ilişkilerini modelleyen tahmin araçları",
      "Laboratuvar ve kalite süreçleri için otomasyon: rapor üretimi, standart uyumu kontrolü, akredite kayıt akışı",
      "Metalurji alanında alan-özgü LLM uygulamaları: standart yorumlama, kök neden analizi desteği, teknik doküman üretimi",
    ],

    sectionIdentity: "Kimlik ve İletişim",
    name: "Ad Soyad *",
    email: "E-posta Adresi *",
    country: "Ülke / Şehir",
    org: "Şirket / Kurum / Üniversite",
    role: "Görev / Unvan",
    profile: "Profil *",
    experienceYears: "Deneyim (yıl)",

    sectionExpertise: "Uzmanlık ve Teknik Yığın",
    expertiseDesc: "Katkı sağlayabileceğiniz tüm alanları işaretleyin. Metalurji veya yazılım taraflarından yalnızca birinde derinliğe sahip olmanız yeterlidir.",
    metallurgyAreas: "Metalurji Uzmanlık Alanları",
    techStack: "Teknik Yığın / Araçlar",
    skillsOther: "Listede olmayan yetkinlikler",
    skillsOtherPh: "Örn: Thermo-Calc / DICTRA, LIMS entegrasyonu, OPC-UA, Power Automate, LaTeX, ImageJ makroları...",

    sectionLinks: "Bağlantılar ve Portföy",
    linksDesc: "Yalnızca http:// veya https:// ile başlayan adresler kaydedilir.",
    github: "GitHub / GitLab",
    linkedin: "LinkedIn",
    website: "Kişisel Site / Blog",
    scholar: "Google Scholar / ResearchGate",
    orcid: "ORCID",
    portfolioNotes: "Öne çıkan çalışmalar",
    portfolioNotesPh: "Geliştirdiğiniz araçlar, yayınlar, açık kaynak katkıları, tez konusu, patent...",

    sectionCollab: "İş Birliği Modeli ve Müsaitlik",
    collabModes: "İlgilendiğiniz iş birliği modeli * (birden fazla seçilebilir)",
    workMode: "Çalışma biçimi",
    availability: "Ayırabileceğiniz süre",

    sectionProject: "Proje Fikri ve Motivasyon",
    projectTitle: "Proje / Katkı Başlığı *",
    projectTitlePh: "Örn: Charpy geçiş eğrisi için otomatik regresyon ve kırılma yüzeyi sınıflandırma modülü",
    projectIdea: "Ne üzerinde çalışmak istiyorsunuz? *",
    projectIdeaPh: "Mümkün olduğunca somut yazınız:\n— Hangi metalurjik problemi hedefliyorsunuz?\n— Hangi veri girdisiyle çalışacak?\n— Hangi yöntem / model / mimariyi düşünüyorsunuz?\n— Beklenen çıktı nedir (araç, model, makale, otomasyon akışı)?",
    contribution: "Somut olarak ne katkı sağlayabilirsiniz?",
    contributionPh: "Örn: Veri etiketleme ve model eğitimi, backend geliştirme, standart yorumlama ve doğrulama, laboratuvar validasyonu, saha verisi...",
    motivation: "Motivasyon / ek notlar",
    motivationPh: "Bu alanda neden çalışmak istediğiniz, daha önceki deneyimleriniz, beklentileriniz...",

    sectionFiles: "CV / Portföy Dosyası",
    filesDesc: "İsteğe bağlı. CV, yayın listesi veya portföy dosyası yükleyebilirsiniz. Maks. 3 dosya, toplam 6 MB (PDF, JPG, PNG).",
    filesBtn: "Dosya Seç (PDF, JPG, PNG)",
    filesNone: "Henüz dosya seçilmedi",

    kvkkLabel: "KVKK Aydınlatma Metni'ni okudum; başvurumun değerlendirilmesi amacıyla verilerimin işlenmesine açık rıza veriyorum. *",
    kvkkLink: "KVKK Aydınlatma Metni",

    privacyTitle: "Gizlilik ve Veri Kullanımı",
    privacyBody: "Bu formdaki bilgiler yalnızca iş birliği başvurunuzun değerlendirilmesi amacıyla kullanılır, üçüncü taraflarla paylaşılmaz ve ticari amaçla işlenmez. Paylaştığınız proje fikirleri gizli tutulur; talebiniz halinde kayıtlarınız sistemden tamamen silinir.",

    submit: "Başvuruyu Gönder",
    submitting: "Gönderiliyor...",
    successTitle: "Başvurunuz Alındı",
    successMsg: "İş birliği başvurunuz iletildi. Değerlendirme sonrası e-posta adresinize dönüş yapılacaktır.",
    successBack: "Ana Sayfaya Dön",
    errorMsg: "Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyiniz.",
    required: "* ile işaretli alanlar zorunludur.",
    missingFields: "Zorunlu alanları doldurunuz: Ad Soyad, e-posta, proje başlığı, proje açıklaması ve en az bir iş birliği modeli.",
    kvkkRequired: "Devam etmek için KVKK açık rıza kutusunu işaretlemeniz gerekmektedir.",
    fileSizeErr: (n) => `"${n}" dosyası 4 MB sınırını aşıyor.`,
    fileCountErr: "En fazla 3 dosya yükleyebilirsiniz.",
    fileTypeErr: "Yalnızca PDF, JPG ve PNG dosyaları kabul edilir.",
  },
  en: {
    title: "Collaboration Application",
    subtitle: "An open call for engineers, researchers, developers and organisations who want to work on projects that combine deep metallurgical knowledge with software, artificial intelligence and automation.",
    breadHome: "Home",
    breadSection: "Collaboration",

    introTitle: "What We Want to Build Together",
    introItems: [
      "Automated acquisition, validation and statistical evaluation of mechanical testing, metallography and NDT data",
      "Image processing / deep learning classification on microstructure and fractography images (grain size, inclusions, fracture morphology)",
      "Predictive tools modelling process parameter ↔ microstructure ↔ mechanical property relationships",
      "Automation for laboratory and quality processes: report generation, standard compliance checks, accredited record workflows",
      "Domain-specific LLM applications in metallurgy: standard interpretation, root cause analysis support, technical documentation",
    ],

    sectionIdentity: "Identity and Contact",
    name: "Full Name *",
    email: "Email Address *",
    country: "Country / City",
    org: "Company / Institution / University",
    role: "Role / Title",
    profile: "Profile *",
    experienceYears: "Experience (years)",

    sectionExpertise: "Expertise and Technical Stack",
    expertiseDesc: "Select every area you can contribute to. Depth on either the metallurgy or the software side alone is sufficient.",
    metallurgyAreas: "Metallurgical Areas of Expertise",
    techStack: "Technical Stack / Tools",
    skillsOther: "Skills not listed above",
    skillsOtherPh: "e.g. Thermo-Calc / DICTRA, LIMS integration, OPC-UA, Power Automate, LaTeX, ImageJ macros...",

    sectionLinks: "Links and Portfolio",
    linksDesc: "Only addresses starting with http:// or https:// are stored.",
    github: "GitHub / GitLab",
    linkedin: "LinkedIn",
    website: "Personal Site / Blog",
    scholar: "Google Scholar / ResearchGate",
    orcid: "ORCID",
    portfolioNotes: "Selected work",
    portfolioNotesPh: "Tools you developed, publications, open-source contributions, thesis topic, patents...",

    sectionCollab: "Collaboration Model and Availability",
    collabModes: "Collaboration models you are interested in * (multiple allowed)",
    workMode: "Working mode",
    availability: "Time you can commit",

    sectionProject: "Project Idea and Motivation",
    projectTitle: "Project / Contribution Title *",
    projectTitlePh: "e.g. Automated regression of Charpy transition curves with fracture surface classification",
    projectIdea: "What would you like to work on? *",
    projectIdeaPh: "Be as concrete as possible:\n— Which metallurgical problem are you targeting?\n— What data will it operate on?\n— Which method / model / architecture do you have in mind?\n— What is the expected output (tool, model, paper, automation workflow)?",
    contribution: "What can you concretely contribute?",
    contributionPh: "e.g. Data labelling and model training, backend development, standard interpretation and verification, laboratory validation, field data...",
    motivation: "Motivation / additional notes",
    motivationPh: "Why you want to work in this area, previous experience, expectations...",

    sectionFiles: "CV / Portfolio File",
    filesDesc: "Optional. You may upload a CV, publication list or portfolio file. Max. 3 files, 6 MB total (PDF, JPG, PNG).",
    filesBtn: "Select Files (PDF, JPG, PNG)",
    filesNone: "No files selected",

    kvkkLabel: "I have read the KVKK Privacy Notice and give explicit consent to the processing of my data for the evaluation of my application. *",
    kvkkLink: "KVKK Privacy Notice",

    privacyTitle: "Privacy and Data Use",
    privacyBody: "The information in this form is used solely to evaluate your collaboration application, is not shared with third parties and is not processed for commercial purposes. Project ideas you share are kept confidential; upon request your records are permanently deleted.",

    submit: "Submit Application",
    submitting: "Submitting...",
    successTitle: "Application Received",
    successMsg: "Your collaboration application has been submitted. You will be contacted by email after review.",
    successBack: "Return to Home",
    errorMsg: "An error occurred during submission. Please try again.",
    required: "Fields marked with * are required.",
    missingFields: "Please complete the required fields: full name, email, project title, project description and at least one collaboration model.",
    kvkkRequired: "You must tick the explicit consent box to continue.",
    fileSizeErr: (n) => `"${n}" exceeds the 4 MB file size limit.`,
    fileCountErr: "You may upload a maximum of 3 files.",
    fileTypeErr: "Only PDF, JPG and PNG files are accepted.",
  },
};

/* ── Stiller ── */

function getS(isDark) {
  return {
    page:    { background: isDark ? "#0a0a0a" : "#f1f5f9", minHeight: "100vh" },
    hero:    { background: isDark ? "linear-gradient(135deg,#0f1e3a,#091225 70%,#0a0a0a)" : "linear-gradient(135deg,#dbeafe,#eff6ff 70%,#f1f5f9)" },
    card:    { background: isDark ? "#111827" : "#ffffff", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", borderRadius: 12, padding: "24px 28px", marginBottom: 20 },
    input:   { width: "100%", background: isDark ? "#0f172a" : "#f8fafc", border: isDark ? "1px solid #1e293b" : "1px solid #cbd5e1", borderRadius: 8, padding: "10px 14px", color: isDark ? "#e2e8f0" : "#0f172a", fontSize: 14, outline: "none", boxSizing: "border-box" },
    textarea:{ width: "100%", background: isDark ? "#0f172a" : "#f8fafc", border: isDark ? "1px solid #1e293b" : "1px solid #cbd5e1", borderRadius: 8, padding: "10px 14px", color: isDark ? "#e2e8f0" : "#0f172a", fontSize: 13, lineHeight: 1.7, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" },
    select:  { width: "100%", background: isDark ? "#0f172a" : "#f8fafc", border: isDark ? "1px solid #1e293b" : "1px solid #cbd5e1", borderRadius: 8, padding: "10px 14px", color: isDark ? "#e2e8f0" : "#0f172a", fontSize: 14, outline: "none", boxSizing: "border-box" },
    sectionHead: { color: isDark ? "#f1f5f9" : "#0f172a", fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
    desc:    { color: isDark ? "#64748b" : "#94a3b8", fontSize: 12, marginBottom: 12, lineHeight: 1.6 },
    fileBox: { border: isDark ? "2px dashed #1e293b" : "2px dashed #cbd5e1", borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer" },
    fileChip:{ display: "inline-flex", alignItems: "center", gap: 6, background: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: isDark ? "#94a3b8" : "#475569", margin: "4px" },
    submitBtn:{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em" },
    errorBox:{ background: isDark ? "#450a0a" : "#fef2f2", border: "1px solid #dc2626", borderRadius: 8, padding: "12px 16px", color: isDark ? "#f87171" : "#b91c1c", fontSize: 13, marginBottom: 16 },
    linkColor: isDark ? "#60a5fa" : "#2563eb",
    breadcrumb: isDark ? "#64748b" : "#94a3b8",
    titleColor: isDark ? "#f1f5f9" : "#0f172a",
    subColor: isDark ? "#64748b" : "#6b7280",
    bodyColor: isDark ? "#94a3b8" : "#475569",
    grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 },
    grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 },
    chipGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 8 },
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

/** Çoklu seçim rozeti — kontrollü checkbox. */
function Chip({ checked, onChange, label, isDark }) {
  return (
    <label
      style={{
        display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
        padding: "9px 12px", borderRadius: 8, fontSize: 13, lineHeight: 1.35,
        background: checked ? (isDark ? "#0c1a2e" : "#eff6ff") : (isDark ? "#0f172a" : "#f8fafc"),
        border: checked
          ? (isDark ? "1px solid #2563eb" : "1px solid #93c5fd")
          : (isDark ? "1px solid #1e293b" : "1px solid #e2e8f0"),
        color: checked ? (isDark ? "#bfdbfe" : "#1d4ed8") : (isDark ? "#94a3b8" : "#475569"),
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ accentColor: "#2563eb", width: 15, height: 15, flexShrink: 0, cursor: "pointer" }}
      />
      <span>{label}</span>
    </label>
  );
}

export default function CollaboratePage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const S = getS(isDark);
  const L = lang === "tr" ? "tr" : "en";
  const t = T[L];
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "", email: "", country: "", org: "", role: "",
    profile: "metalurji_muhendisi", experienceYears: "",
    skillsOther: "",
    github: "", linkedin: "", website: "", scholar: "", orcid: "",
    portfolioNotes: "",
    workMode: "uzaktan", availability: "proje_bazli",
    projectTitle: "", projectIdea: "", contribution: "", motivation: "",
  });
  const [metallurgyAreas, setMetallurgyAreas] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [collabModes, setCollabModes] = useState([]);
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggle = (list, setList) => (value) => () =>
    setList((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));

  const toggleMet = toggle(metallurgyAreas, setMetallurgyAreas);
  const toggleTech = toggle(techStack, setTechStack);
  const toggleMode = toggle(collabModes, setCollabModes);

  const ACCEPTED = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    const combined = [...files, ...selected];
    if (combined.length > 3) { setError(t.fileCountErr); return; }
    for (const f of selected) {
      if (!ACCEPTED.includes(f.type)) { setError(t.fileTypeErr); return; }
      if (f.size > 4 * 1024 * 1024) { setError(t.fileSizeErr(f.name)); return; }
    }
    setError("");
    setFiles(combined);
  };

  const removeFile = (i) => setFiles((f) => f.filter((_, idx) => idx !== i));

  // API tarafı validateAttachments() `dataUrl` alanını bekler.
  const toDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, dataUrl: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.projectTitle || !form.projectIdea || collabModes.length === 0) {
      setError(t.missingFields); return;
    }
    if (!kvkkConsent) { setError(t.kvkkRequired); return; }

    setSubmitting(true);
    try {
      const encodedFiles = await Promise.all(files.map(toDataUrl));
      const res = await fetch("/api/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          experienceYears: form.experienceYears === "" ? null : Number(form.experienceYears),
          metallurgyAreas, techStack, collabModes,
          kvkkConsent: true,
          files: encodedFiles,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "err");
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "140px 24px 80px", textAlign: "center" }}>
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
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 32px" }}>
          <div style={{ color: S.breadcrumb, fontSize: 13, marginBottom: 14 }}>
            <Link href="/" style={{ color: S.linkColor }}>{t.breadHome}</Link>
            {" → "}
            <span>{t.breadSection}</span>
          </div>
          <h1 style={{ color: S.titleColor, fontWeight: 800, fontSize: 30, margin: "0 0 10px" }}>{t.title}</h1>
          <p style={{ color: S.subColor, fontSize: 14, lineHeight: 1.75, maxWidth: 680 }}>{t.subtitle}</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* ODAK ALANLARI */}
        <div style={{ ...S.card, background: isDark ? "#0c1a2e" : "#eff6ff", border: isDark ? "1px solid #1e3a6e" : "1px solid #bfdbfe" }}>
          <div style={{ ...S.sectionHead, color: isDark ? "#60a5fa" : "#1d4ed8" }}><span>🔗</span>{t.introTitle}</div>
          <ul style={{ margin: 0, paddingLeft: 20, color: S.bodyColor, fontSize: 13.5, lineHeight: 1.9 }}>
            {t.introItems.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>

        <form onSubmit={handleSubmit}>

          {/* 1 — KİMLİK */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>👤</span>{t.sectionIdentity}</div>
            <div style={S.grid2}>
              <Field label={t.name}>
                <input style={S.input} value={form.name} onChange={set("name")} required />
              </Field>
              <Field label={t.email}>
                <input style={S.input} type="email" value={form.email} onChange={set("email")} required />
              </Field>
            </div>
            <div style={S.grid2}>
              <Field label={t.org}>
                <input style={S.input} value={form.org} onChange={set("org")} />
              </Field>
              <Field label={t.role}>
                <input style={S.input} value={form.role} onChange={set("role")} />
              </Field>
            </div>
            <div style={S.grid3}>
              <Field label={t.profile}>
                <select style={S.select} value={form.profile} onChange={set("profile")}>
                  {PROFILES[L].map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </Field>
              <Field label={t.experienceYears}>
                <input style={S.input} type="number" min="0" max="60" value={form.experienceYears} onChange={set("experienceYears")} />
              </Field>
              <Field label={t.country}>
                <input style={S.input} value={form.country} onChange={set("country")} />
              </Field>
            </div>
          </div>

          {/* 2 — UZMANLIK & TEKNİK YIĞIN */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>🧭</span>{t.sectionExpertise}</div>
            <p style={S.desc}>{t.expertiseDesc}</p>

            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: S.titleColor }}>{t.metallurgyAreas}</div>
            <div style={{ ...S.chipGrid, marginBottom: 20 }}>
              {METALLURGY_AREAS[L].map((o) => (
                <Chip key={o.value} isDark={isDark} label={o.label}
                  checked={metallurgyAreas.includes(o.value)} onChange={toggleMet(o.value)} />
              ))}
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: S.titleColor }}>{t.techStack}</div>
            <div style={{ ...S.chipGrid, marginBottom: 20 }}>
              {TECH_STACK[L].map((o) => (
                <Chip key={o.value} isDark={isDark} label={o.label}
                  checked={techStack.includes(o.value)} onChange={toggleTech(o.value)} />
              ))}
            </div>

            <Field label={t.skillsOther}>
              <textarea style={{ ...S.textarea, minHeight: 70 }} placeholder={t.skillsOtherPh}
                value={form.skillsOther} onChange={set("skillsOther")} />
            </Field>
          </div>

          {/* 3 — BAĞLANTILAR */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>🌐</span>{t.sectionLinks}</div>
            <p style={S.desc}>{t.linksDesc}</p>
            <div style={S.grid2}>
              <Field label={t.github}>
                <input style={S.input} type="url" placeholder="https://github.com/..." value={form.github} onChange={set("github")} />
              </Field>
              <Field label={t.linkedin}>
                <input style={S.input} type="url" placeholder="https://www.linkedin.com/in/..." value={form.linkedin} onChange={set("linkedin")} />
              </Field>
            </div>
            <div style={S.grid2}>
              <Field label={t.website}>
                <input style={S.input} type="url" placeholder="https://" value={form.website} onChange={set("website")} />
              </Field>
              <Field label={t.scholar}>
                <input style={S.input} type="url" placeholder="https://scholar.google.com/..." value={form.scholar} onChange={set("scholar")} />
              </Field>
            </div>
            <Field label={t.orcid}>
              <input style={S.input} placeholder="0000-0000-0000-0000" value={form.orcid} onChange={set("orcid")} />
            </Field>
            <Field label={t.portfolioNotes}>
              <textarea style={{ ...S.textarea, minHeight: 90 }} placeholder={t.portfolioNotesPh}
                value={form.portfolioNotes} onChange={set("portfolioNotes")} />
            </Field>
          </div>

          {/* 4 — İŞ BİRLİĞİ MODELİ */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>🤝</span>{t.sectionCollab}</div>

            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: S.titleColor }}>{t.collabModes}</div>
            <div style={{ ...S.chipGrid, marginBottom: 20 }}>
              {COLLAB_MODES[L].map((o) => (
                <Chip key={o.value} isDark={isDark} label={o.label}
                  checked={collabModes.includes(o.value)} onChange={toggleMode(o.value)} />
              ))}
            </div>

            <div style={S.grid2}>
              <Field label={t.workMode}>
                <select style={S.select} value={form.workMode} onChange={set("workMode")}>
                  {WORK_MODES[L].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label={t.availability}>
                <select style={S.select} value={form.availability} onChange={set("availability")}>
                  {AVAILABILITY[L].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* 5 — PROJE FİKRİ */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>💡</span>{t.sectionProject}</div>
            <Field label={t.projectTitle}>
              <input style={S.input} placeholder={t.projectTitlePh} value={form.projectTitle} onChange={set("projectTitle")} required />
            </Field>
            <Field label={t.projectIdea}>
              <textarea style={{ ...S.textarea, minHeight: 180 }} placeholder={t.projectIdeaPh}
                value={form.projectIdea} onChange={set("projectIdea")} required />
            </Field>
            <Field label={t.contribution}>
              <textarea style={{ ...S.textarea, minHeight: 110 }} placeholder={t.contributionPh}
                value={form.contribution} onChange={set("contribution")} />
            </Field>
            <Field label={t.motivation}>
              <textarea style={{ ...S.textarea, minHeight: 90 }} placeholder={t.motivationPh}
                value={form.motivation} onChange={set("motivation")} />
            </Field>
          </div>

          {/* 6 — DOSYA */}
          <div style={S.card}>
            <div style={S.sectionHead}><span>📎</span>{t.sectionFiles}</div>
            <p style={S.desc}>{t.filesDesc}</p>

            <div
              style={S.fileBox}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles({ target: { files: e.dataTransfer.files } }); }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
              <div style={{ color: S.linkColor, fontWeight: 600, fontSize: 14 }}>{t.filesBtn}</div>
              <div style={{ color: S.subColor, fontSize: 12, marginTop: 4 }}>drag &amp; drop</div>
            </div>
            <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={handleFiles} />

            {files.length === 0 ? (
              <div style={{ color: S.subColor, fontSize: 12, marginTop: 10 }}>{t.filesNone}</div>
            ) : (
              <div style={{ marginTop: 12 }}>
                {files.map((f, i) => (
                  <span key={i} style={S.fileChip}>
                    📄 {f.name} <span style={{ fontSize: 10, opacity: 0.7 }}>({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
                    <button type="button" onClick={() => removeFile(i)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* GİZLİLİK + KVKK RIZA */}
          <div style={{ background: isDark ? "#0c1a2e" : "#eff6ff", border: isDark ? "1px solid #1e3a6e" : "1px solid #bfdbfe", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>🔒</span>
              <div>
                <div style={{ color: isDark ? "#60a5fa" : "#1d4ed8", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{t.privacyTitle}</div>
                <div style={{ color: S.bodyColor, fontSize: 13, lineHeight: 1.8 }}>{t.privacyBody}</div>
              </div>
            </div>

            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={kvkkConsent}
                onChange={(e) => setKvkkConsent(e.target.checked)}
                style={{ accentColor: "#2563eb", width: 16, height: 16, marginTop: 2, flexShrink: 0, cursor: "pointer" }}
              />
              <span style={{ color: S.bodyColor, fontSize: 12.5, lineHeight: 1.7 }}>
                {t.kvkkLabel}{" "}
                <Link href="/kvkk-aydinlatma" target="_blank" style={{ color: S.linkColor, textDecoration: "underline" }}>
                  ({t.kvkkLink})
                </Link>
              </span>
            </label>
          </div>

          {error && <div style={S.errorBox}>⚠️ {error}</div>}

          <button type="submit" style={{ ...S.submitBtn, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
            {submitting ? t.submitting : t.submit}
          </button>

          <p style={{ color: S.subColor, fontSize: 11, textAlign: "center", marginTop: 12 }}>{t.required}</p>
        </form>
      </div>
    </div>
  );
}
