"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

// ─── FULL SITE SEARCH INDEX ───────────────────────────────────────────────────
const SEARCH_INDEX = [

  // ── TOOLS ──────────────────────────────────────────────────────────────────
  {
    href: "/tools/grain-size",
    icon: "🔬",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["grain size", "tane boyutu", "astm e112", "ferrite", "ferrit", "晶粒度", "結晶粒度",
           "microstructure", "mikrografi", "lineal intercept", "planimetric", "ostwald"],
    tr: { name: "Tane Boyutu Analizörü", desc: "ASTM E112 uyumlu otomatik tane boyutu ölçümü" },
    en: { name: "Grain Size Analyzer", desc: "ASTM E112 automated grain size measurement from optical micrographs" },
    zh: { name: "晶粒度分析仪", desc: "ASTM E112标准晶粒度测量" },
    ja: { name: "結晶粒度アナライザー", desc: "ASTM E112結晶粒度測定" },
  },
  {
    href: "/tools/hardness",
    icon: "🔧",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["hardness", "sertlik", "hrc", "hrb", "hv", "hb", "vickers", "rockwell", "brinell",
           "硬度", "硬さ", "tensile strength", "çekme dayanımı", "astm e140", "e18", "e92"],
    tr: { name: "Sertlik Çevirici", desc: "ASTM E140 — HRC, HRB, HV, HB ve yaklaşık çekme dayanımı dönüşümü" },
    en: { name: "Hardness Converter", desc: "ASTM E140 hardness scale conversion: HRC, HRB, HV, HB" },
    zh: { name: "硬度换算器", desc: "ASTM E140硬度标度换算：HRC、HRB、HV、HB" },
    ja: { name: "硬さ換算器", desc: "ASTM E140硬さスケール換算" },
  },
  {
    href: "/tools/phase-diagram",
    icon: "📊",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["phase diagram", "faz diyagramı", "fe-c", "iron carbon", "demir karbon", "lever rule",
           "kaldıraç kuralı", "cementite", "sementit", "austenite", "ostenit", "相图", "状態図",
           "peritectic", "eutectic", "ötektoid", "eutectoid", "a1", "a3", "acm"],
    tr: { name: "Fe-C Faz Diyagramı Simülatörü", desc: "Kaldıraç kuralı hesaplamalı interaktif demir-sementit denge diyagramı" },
    en: { name: "Fe-C Phase Diagram Simulator", desc: "Interactive iron-cementite equilibrium phase diagram with lever rule" },
    zh: { name: "Fe-C相图模拟器", desc: "带杠杆定律的铁-渗碳体平衡相图" },
    ja: { name: "Fe-C状態図シミュレーター", desc: "てこの原理付き鉄-セメンタイト平衡状態図" },
  },
  {
    href: "/tools/cct-ttt",
    icon: "🌡️",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["cct", "ttt", "cooling", "soğuma", "martensite", "martensit", "bainite", "beynit",
           "pearlite", "perlit", "ms temperature", "ae3", "bs", "冷却曲線", "hardenability",
           "sertleşebilirlik", "phase fraction", "faz fraksiyonu", "carbon equivalent", "ce"],
    tr: { name: "CCT/TTT Diyagram Yorumlayıcı", desc: "Kritik sıcaklıklar, faz fraksiyonu ve soğuma eğrisi analizi" },
    en: { name: "CCT/TTT Diagram Interpreter", desc: "Critical temperatures, phase fraction prediction and cooling curve analysis" },
    zh: { name: "CCT/TTT图解释器", desc: "临界温度、相分数和冷却曲线分析" },
    ja: { name: "CCT/TTT図解釈器", desc: "臨界温度、相分率、冷却曲線分析" },
  },
  {
    href: "/tools/inclusion",
    icon: "🔎",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["inclusion", "inklüzyon", "mns", "manganese sulfide", "al2o3", "alumina", "astm e45",
           "cleanliness", "temizlik", "夹杂物", "介在物", "type a", "type b", "type c", "type d",
           "silicate", "globular", "method a", "severity rating"],
    tr: { name: "İnklüzyon Sınıflandırıcı", desc: "ASTM E45 Method A inklüzyon sınıflandırma ve kabul kriteri" },
    en: { name: "Inclusion Classifier", desc: "ASTM E45 Method A inclusion classification and acceptance criteria" },
    zh: { name: "夹杂物分类器", desc: "ASTM E45 A法夹杂物分类和验收标准" },
    ja: { name: "介在物分類器", desc: "ASTM E45 A法介在物分類と受入れ基準" },
  },
  {
    href: "/tools/sem-eds",
    icon: "🔬",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["sem", "eds", "edx", "electron microscope", "elektron mikroskop", "spectrum", "spektrum",
           "x-ray", "elemental analysis", "element analizi", "扫描电镜", "走査電子顕微鏡",
           "keV", "ka", "kb", "bremsstrahlung", "characteristic x-ray"],
    tr: { name: "SEM-EDS Analizörü", desc: "SEM-EDS verilerinden spektrum analizi ve element tanımlama" },
    en: { name: "SEM-EDS Analyzer", desc: "Spectrum analysis and elemental identification from SEM-EDS data" },
    zh: { name: "SEM-EDS分析器", desc: "SEM-EDS能谱分析和元素鉴定" },
    ja: { name: "SEM-EDS分析器", desc: "SEM-EDSスペクトル分析と元素同定" },
  },
  {
    href: "/tools/hasar-vakalari",
    icon: "🔬",
    category: { tr: "Atlas", en: "Atlas", zh: "图谱", ja: "アトラス" },
    tags: [
      "hasar", "kusur", "vaka", "damage", "defect", "case", "atlas",
      "white layer", "martenzit", "martensite", "GBC", "tane sınırı sementit",
      "grain boundary cementite", "chevron", "merkez çatlak", "central crack",
      "laminasyon", "lamination", "tufal", "kabuk", "scale", "sliver",
      "kızıl oksit", "red scale", "fayalit", "fayalite", "Fe2SiO4",
      "wire rod", "kangal", "bobin", "coil", "SEM-EDS", "mikrograf",
      "HAZ", "kaynak", "rulo kırığı", "coil break", "oyuklanma", "pitting",
      "çizik", "scratch", "inklüzyon", "inclusion", "deformasyon", "deformation",
      "yırtılma", "tearing", "bükme", "bending", "lokal sertlik", "local hardness",
    ],
    tr: { name: "Hasar Vakaları Atlası", desc: "25 gerçek üretim kusuru vakası: kangal ve bobin ürünlerinde metalografik analizler" },
    en: { name: "Failure Analysis Atlas", desc: "25 real production defect cases: wire rod & coil metallographic analyses" },
    zh: { name: "失效分析图谱", desc: "25个真实生产缺陷案例：线材和线圈金相分析" },
    ja: { name: "破損分析アトラス", desc: "25件の実生産欠陥事例：線材とコイルの金属組織解析" },
  },
  {
    href: "/tools/inclusion-atlas",
    icon: "📖",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["atlas", "mns", "al2o3", "tin", "titanium nitride", "calcium aluminate",
           "kalsiyum alüminat", "spinel", "mgal2o4", "nbcn", "silicate", "silikat",
           "morphology", "morfoloji", "formation", "oluşum", "夹杂物图谱", "介在物アトラス",
           "eds keV", "corrective action", "düzeltici", "log k", "delta g"],
    tr: { name: "İnklüzyon Atlası", desc: "MnS, Al₂O₃, TiN, spinel ve kalsiyum alüminat inklüzyonları referansı" },
    en: { name: "Inclusion Atlas", desc: "Reference for MnS, Al₂O₃, TiN, spinel and calcium aluminate inclusions" },
    zh: { name: "夹杂物图谱", desc: "MnS、Al₂O₃、TiN、尖晶石和铝酸钙夹杂物参考" },
    ja: { name: "介在物アトラス", desc: "MnS、Al₂O₃、TiN、スピネル、カルシウムアルミネート介在物リファレンス" },
  },
  {
    href: "/tools/dbtt",
    icon: "❄️",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["dbtt", "charpy", "impact", "darbe", "ductile brittle", "sünek gevrek",
           "transition temperature", "geçiş sıcaklığı", "dwtt", "drop weight",
           "韧脆转变", "延性脆性遷移", "energy absorption", "enerji emilimi", "shelf energy"],
    tr: { name: "DBTT Tahmin Motoru", desc: "Bileşim ve proses parametrelerinden sünek-gevrek geçiş sıcaklığı tahmini" },
    en: { name: "DBTT Prediction Engine", desc: "Ductile-brittle transition temperature from composition and process parameters" },
    zh: { name: "DBTT预测引擎", desc: "从成分和工艺参数预测韧脆转变温度" },
    ja: { name: "DBTT予測エンジン", desc: "組成とプロセスパラメーターからDBTT予測" },
  },
  {
    href: "/tools/tensile-specimen",
    icon: "↕",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["tensile", "çekme", "specimen", "numune", "gauge length", "lo", "l0",
           "en iso 6892", "astm e8", "proportional", "orantısal", "引张试验", "引張試験",
           "cross section", "kesit", "a0", "so", "parallel length", "paralel boy"],
    tr: { name: "Çekme Numunesi L₀ Hesaplayıcı", desc: "EN ISO 6892-1 ve ASTM E8'e göre ölçüm uzunluğu hesaplama" },
    en: { name: "Tensile Specimen L₀ Calculator", desc: "Gauge length per EN ISO 6892-1 and ASTM E8 for tensile specimens" },
    zh: { name: "拉伸试样L₀计算器", desc: "按EN ISO 6892-1和ASTM E8计算拉伸试样标距" },
    ja: { name: "引張試験片L₀計算器", desc: "EN ISO 6892-1、ASTM E8に基づく標点距離計算" },
  },
  {
    href: "/tools/corrosion",
    icon: "⚗️",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["corrosion", "korozyon", "api 570", "asme", "corrosion rate", "korozyon hızı",
           "wall thickness", "et kalınlığı", "inspection", "muayene", "腐蚀", "腐食",
           "mpy", "mils per year", "remaining life", "kalan ömür", "pitting", "uniform"],
    tr: { name: "Korozyon Hesaplayıcı", desc: "API 570 / ASME korozyon hızı ve kalan ömür değerlendirmesi" },
    en: { name: "Corrosion Rate Calculator", desc: "API 570 / ASME corrosion rate and remaining life assessment" },
    zh: { name: "腐蚀速率计算器", desc: "API 570 / ASME腐蚀速率和剩余寿命评估" },
    ja: { name: "腐食速度計算器", desc: "API 570 / ASME腐食速度と残存寿命評価" },
  },
  {
    href: "/tools/dwtt",
    icon: "⬇",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["dwtt", "drop weight tear test", "düşürme ağırlığı", "api 5l", "pipeline",
           "boru hattı", "x42", "x52", "x60", "x65", "x70", "x80", "impact energy",
           "darbe enerjisi", "yırtılma", "tear", "joule", "pragya", "ductile fracture",
           "sünek kırılma", "落锤撕裂", "落錘引裂", "şev alanı", "shear area"],
    tr: { name: "DWTT Simülatörü", desc: "API 5L X42–X80 Düşürme Ağırlığı Yırtılma Testi — enerji hesabı ve makine konfigürasyonu" },
    en: { name: "DWTT Simulator", desc: "API 5L X42–X80 Drop-Weight Tear Test — energy calculation and machine configuration" },
    zh: { name: "落锤撕裂试验模拟器", desc: "API 5L X42–X80落锤撕裂试验能量计算" },
    ja: { name: "落錘引裂試験シミュレーター", desc: "API 5L X42–X80落錘引裂試験エネルギー計算" },
  },
  {
    href: "/tools/ultrasonic",
    icon: "〜",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["ultrasonic", "ultrasonik", "ut", "ndt", "nde", "tahribatsız muayene", "pulse echo",
           "a-scan", "ascan", "flaw detection", "hata tespiti", "k1", "k2", "kalibrasyon",
           "calibration", "angle probe", "açılı prob", "snell", "sound velocity", "ses hızı",
           "超声检测", "超音波探傷", "beam angle", "gate", "kapı", "gain", "kazanç"],
    tr: { name: "UT Simülatör Pro", desc: "Darbe-yankı ultrasonik muayene simülatörü — K1/K2 kalibrasyon, A-tarama, hata konumlandırma" },
    en: { name: "UT Simulator Pro", desc: "Pulse-echo ultrasonic testing simulator — K1/K2 calibration, A-scan, flaw location" },
    zh: { name: "超声检测模拟器Pro", desc: "脉冲回波超声检测模拟器 — K1/K2校准、A扫描、缺陷定位" },
    ja: { name: "超音波探傷シミュレーターPro", desc: "パルスエコー超音波探傷シミュレーター — K1/K2校正、Aスキャン" },
  },
  {
    href: "/tools/carbon-equivalent",
    icon: "🔥",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["carbon equivalent", "karbon eşdeğeri", "ce", "iiw", "cet", "pcm",
           "weldability", "kaynak kabiliyeti", "cold cracking", "soğuk çatlak",
           "碳当量", "炭素当量", "hydrogen cracking", "hidrojen", "preheating"],
    tr: { name: "Karbon Eşdeğeri Hesaplayıcı", desc: "IIW, CET ve Pcm karbon eşdeğeri ve kaynak kabiliyeti değerlendirmesi" },
    en: { name: "Carbon Equivalent Calculator", desc: "IIW, CET and Pcm carbon equivalent for weldability assessment" },
    zh: { name: "碳当量计算器", desc: "IIW、CET和Pcm碳当量及焊接性评估" },
    ja: { name: "炭素当量計算器", desc: "IIW、CETおよびPcm炭素当量と溶接性評価" },
  },
  {
    href: "/tools/preheat",
    icon: "🔥",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["preheat", "ön ısıtma", "welding", "kaynak", "en 1011", "aws d1.1",
           "heat input", "ısı girdisi", "interpass", "预热", "予熱",
           "hydrogen", "hidrojen", "t50", "martensite start", "ms"],
    tr: { name: "Kaynak Ön Isıtma Hesaplayıcı", desc: "EN 1011-2 ve AWS D1.1 ön ısıtma sıcaklığı ve kaynak kabiliyeti" },
    en: { name: "Weld Preheat Calculator", desc: "EN 1011-2 and AWS D1.1 preheat temperature and weldability" },
    zh: { name: "焊接预热计算器", desc: "EN 1011-2和AWS D1.1预热温度和焊接性" },
    ja: { name: "溶接予熱計算器", desc: "EN 1011-2とAWS D1.1予熱温度と溶接性" },
  },
  {
    href: "/tools/unit-converter",
    icon: "🔁",
    category: { tr: "Araç", en: "Tool", zh: "工具", ja: "ツール" },
    tags: ["unit", "birim", "convert", "çevir", "mpa", "ksi", "psi", "joule",
           "ft lb", "celsius", "fahrenheit", "単位", "单位",
           "stress", "force", "energy", "temperature", "pressure", "length", "area", "mass"],
    tr: { name: "Mühendislik Birim Çevirici", desc: "Gerilme, kuvvet, enerji, sıcaklık, basınç birim dönüşümü" },
    en: { name: "Engineering Unit Converter", desc: "Stress, force, energy, temperature, pressure unit conversions" },
    zh: { name: "工程单位换算器", desc: "应力、力、能量、温度、压力单位换算" },
    ja: { name: "工学単位換算器", desc: "応力、力、エネルギー、温度、圧力単位換算" },
  },

  // ── KNOWLEDGE BASE ─────────────────────────────────────────────────────────
  {
    href: "/knowledge/hardness-testing",
    icon: "📚",
    category: { tr: "Bilgi Bankası", en: "Knowledge", zh: "知识库", ja: "ナレッジ" },
    tags: ["hardness", "sertlik", "rockwell", "vickers", "brinell", "hrc", "hv", "hb",
           "astm e18", "astm e92", "astm e10", "astm e140", "indenter", "uç geometrisi",
           "load selection", "yük seçimi", "conversion table", "dönüşüm tablosu"],
    tr: { name: "Sertlik Testleri: Rockwell, Vickers, Brinell", desc: "Ölçüm prensipleri, uç geometrileri, yük seçimi ve ASTM E140 dönüşüm tablosu" },
    en: { name: "Hardness Testing: Rockwell, Vickers and Brinell", desc: "Hardness measurement principles, indenter geometries, load selection and ASTM E140 conversion" },
    zh: { name: "硬度测试：洛氏、维氏和布氏", desc: "硬度测量原理、压头几何形状、载荷选择和ASTM E140换算表" },
    ja: { name: "硬さ試験：ロックウェル、ビッカース、ブリネル", desc: "硬さ測定原理、圧子形状、荷重選択、ASTM E140換算表" },
  },
  {
    href: "/knowledge/fe-c-phase-diagram",
    icon: "📚",
    category: { tr: "Bilgi Bankası", en: "Knowledge", zh: "知识库", ja: "ナレッジ" },
    tags: ["fe-c", "phase diagram", "faz diyagramı", "eutectoid", "ötektoid", "eutectic",
           "peritectic", "lever rule", "kaldıraç kuralı", "a1", "a3", "acm",
           "austenite", "ostenit", "cementite", "sementit", "相图", "状態図",
           "phase regions", "faz bölgeleri", "thermodynamics", "termodinamik"],
    tr: { name: "Fe-C Faz Diyagramı: Kapsamlı Rehber", desc: "Ötektoid reaksiyon, faz bölgeleri, kaldıraç kuralı ve soğuma yolu analizi" },
    en: { name: "Fe-C Phase Diagram: Comprehensive Guide", desc: "Eutectoid reaction, phase regions, lever rule and cooling path analysis" },
    zh: { name: "Fe-C相图：综合指南", desc: "共析反应、相区、杠杆定律和冷却路径分析" },
    ja: { name: "Fe-C状態図：総合ガイド", desc: "共析反応、相領域、てこの原理、冷却経路分析" },
  },
  {
    href: "/knowledge/steel-microstructures",
    icon: "📚",
    category: { tr: "Bilgi Bankası", en: "Knowledge", zh: "知识库", ja: "ナレッジ" },
    tags: ["microstructure", "mikroyapı", "ferrite", "ferrit", "pearlite", "perlit",
           "bainite", "beynit", "martensite", "martenzit", "retained austenite",
           "tempered", "temperleme", "微观组织", "ミクロ組織", "hardness comparison",
           "upper bainite", "lower bainite", "acicular ferrite", "iğnesel ferrit"],
    tr: { name: "Çelik Mikroyapıları: Ferrit, Perlit, Beynit, Martenzit", desc: "Her fazın oluşum koşulları, morfolojisi, sertliği ve mekanik özellikleri" },
    en: { name: "Steel Microstructures: Ferrite, Pearlite, Bainite, Martensite", desc: "Formation conditions, morphology, hardness and mechanical properties of each phase" },
    zh: { name: "钢的显微组织：铁素体、珠光体、贝氏体、马氏体", desc: "各相的形成条件、形态、硬度和力学性能" },
    ja: { name: "鋼の金属組織：フェライト、パーライト、ベイナイト、マルテンサイト", desc: "各相の形成条件、形態、硬さ、機械的性質" },
  },
  {
    href: "/knowledge/grain-size-hall-petch",
    icon: "📚",
    category: { tr: "Bilgi Bankası", en: "Knowledge", zh: "知识库", ja: "ナレッジ" },
    tags: ["hall-petch", "grain size", "tane boyutu", "yield strength", "akma dayanımı",
           "grain boundary", "tane sınırı", "strengthening", "sertleşme",
           "astm e112", "intercept method", "kesişim metodu", "d-1/2", "晶粒细化",
           "結晶粒細化", "sigma yield", "sigma zero", "k constant"],
    tr: { name: "Tane Boyutu ve Hall-Petch İlişkisi", desc: "σy = σ₀ + k·d⁻¹/² — tane inceltmenin akma dayanımına etkisi ve ASTM E112 ölçümü" },
    en: { name: "Grain Size and Hall-Petch Relationship", desc: "σy = σ₀ + k·d⁻¹/² — effect of grain refinement on yield strength and ASTM E112 measurement" },
    zh: { name: "晶粒度与Hall-Petch关系", desc: "σy = σ₀ + k·d⁻¹/² — 晶粒细化对屈服强度的影响" },
    ja: { name: "結晶粒度とHall-Petch関係", desc: "σy = σ₀ + k·d⁻¹/² — 結晶粒微細化と降伏強度の関係" },
  },
  {
    href: "/knowledge/mechanical-testing",
    icon: "📚",
    category: { tr: "Bilgi Bankası", en: "Knowledge", zh: "知识库", ja: "ナレッジ" },
    tags: ["mechanical testing", "mekanik test", "tensile", "çekme", "yield strength",
           "akma dayanımı", "uts", "ultimate", "elongation", "uzama", "reduction of area",
           "kesit dayanımı", "force displacement", "力学测试", "機械的試験",
           "en iso 6892", "astm e8", "stress strain", "gerilme-uzama"],
    tr: { name: "Mekanik Testlere Giriş: Çekme, Darbe, Sertlik", desc: "Gerilme-şekil değiştirme eğrisi, akma dayanımı, UTS, uzama ve kırılma tokluğu temelleri" },
    en: { name: "Introduction to Mechanical Testing: Tensile, Impact, Hardness", desc: "Stress-strain curve, yield strength, UTS, elongation and fracture toughness fundamentals" },
    zh: { name: "力学测试简介：拉伸、冲击、硬度", desc: "应力-应变曲线、屈服强度、UTS、延伸率和断裂韧性基础" },
    ja: { name: "機械的試験入門：引張、衝撃、硬さ", desc: "応力-ひずみ曲線、降伏強度、UTS、延性、破壊靭性の基礎" },
  },
  {
    href: "/knowledge/corrosion-mechanisms",
    icon: "📚",
    category: { tr: "Bilgi Bankası", en: "Knowledge", zh: "知识库", ja: "ナレッジ" },
    tags: ["corrosion", "korozyon", "electrochemical", "elektrokimyasal", "galvanic",
           "galvanik", "pitting", "çukurcuk", "crevice", "aralık", "oxidation",
           "passivation", "pasivasyon", "腐蚀机制", "腐食機構",
           "anode", "cathode", "cathodic protection", "katodik koruma", "rust"],
    tr: { name: "Korozyon Mekanizmaları: Galvanik, Çukurcuk, Aralık", desc: "Elektrokimyasal hücre prensibi, katodik/anodik reaksiyonlar ve korozyon türleri" },
    en: { name: "Corrosion Mechanisms: Galvanic, Pitting, Crevice", desc: "Electrochemical cell principles, cathodic/anodic reactions and corrosion types" },
    zh: { name: "腐蚀机制：电偶腐蚀、点腐蚀、缝隙腐蚀", desc: "电化学电池原理、阴极/阳极反应和腐蚀类型" },
    ja: { name: "腐食機構：ガルバニック、孔食、隙間腐食", desc: "電気化学セル原理、陰極/陽極反応、腐食の種類" },
  },

  // ── MECHANICAL TESTS PAGES ─────────────────────────────────────────────────
  {
    href: "/mechanical-tests/cekme-testi",
    icon: "🧪",
    category: { tr: "Mekanik Test", en: "Mech. Test", zh: "力学测试", ja: "機械試験" },
    tags: ["tensile test", "çekme testi", "rp0.2", "yield", "akma", "uts", "rm", "re",
           "elongation", "uzama", "reduction", "kesit dayanımı", "z%", "a%",
           "s600mc", "x65", "x70", "api 5l", "tmcp", "nb", "ti", "tnr",
           "引拉伸试验", "引張試験", "en iso 6892", "astm e8"],
    tr: { name: "Çekme Testi", desc: "Rp0.2, Rm, A%, Z% — ret analizi, Rm/Re oranı, boru hattı güvenlik kriterleri" },
    en: { name: "Tensile Test", desc: "Rp0.2, Rm, A%, Z% — rejection analysis, Rm/Re ratio, pipeline safety criteria" },
    zh: { name: "拉伸试验", desc: "Rp0.2、Rm、A%、Z% — 不合格分析、Rm/Re比、管道安全准则" },
    ja: { name: "引張試験", desc: "Rp0.2、Rm、A%、Z% — 不合格分析、Rm/Re比、パイプライン安全基準" },
  },
  {
    href: "/mechanical-tests/darbe-testi",
    icon: "🧪",
    category: { tr: "Mekanik Test", en: "Mech. Test", zh: "力学测试", ja: "機械試験" },
    tags: ["impact test", "darbe testi", "charpy", "cvn", "iso 148", "fibrous", "lifli",
           "cleavage", "yarılma", "shear", "river marks", "nehir işaretleri",
           "dimple", "ductile", "brittle", "transfer time", "v notch", "冲击试验", "シャルピー試験",
           "subsize", "küçük numune", "dbtt", "transition"],
    tr: { name: "Darbe Testi (Charpy CVN)", desc: "Lifli/yarılma kırık morfolojisi, sıcaklık transferi, subsize numune dönüşümü" },
    en: { name: "Impact Test (Charpy CVN)", desc: "Fibrous/cleavage fracture morphology, temperature transfer, subsize specimen conversion" },
    zh: { name: "冲击试验（夏比CVN）", desc: "韧性/解理断口形态、温度传递、小尺寸试样换算" },
    ja: { name: "衝撃試験（シャルピーCVN）", desc: "延性/へき開破断形態、温度移送、小試験片換算" },
  },
  {
    href: "/mechanical-tests/sertlik-olcumu",
    icon: "🧪",
    category: { tr: "Mekanik Test", en: "Mech. Test", zh: "力学测试", ja: "機械試験" },
    tags: ["hardness", "sertlik", "haz", "heat affected zone", "welding", "kaynak",
           "nace mr0175", "iso 15156", "h2s", "ssc", "hic", "250 hv",
           "cghaz", "fghaz", "ichaz", "traverse", "load selection", "yük",
           "硬度测量", "硬さ測定", "vickers", "hv10", "hv0.1"],
    tr: { name: "Sertlik Ölçümü", desc: "HAZ sertlik kriteri NACE/ISO, ölçüm noktası deseni, CGHAZ/FGHAZ/ICHAZ bölgeleri" },
    en: { name: "Hardness Testing", desc: "HAZ hardness criterion NACE/ISO, measurement pattern, CGHAZ/FGHAZ/ICHAZ zones" },
    zh: { name: "硬度测量", desc: "HAZ硬度准则NACE/ISO，测量点模式，CGHAZ/FGHAZ/ICHAZ区域" },
    ja: { name: "硬さ測定", desc: "HAZ硬さ基準NACE/ISO、測定点パターン、CGHAZ/FGHAZ/ICHAZ領域" },
  },
  {
    href: "/mechanical-tests/dwtt",
    icon: "🧪",
    category: { tr: "Mekanik Test", en: "Mech. Test", zh: "力学测试", ja: "機械試験" },
    tags: ["dwtt", "drop weight", "api 5l", "shear area", "sa%", "pressed notch", "pn",
           "electron beam", "eb notch", "pipeline", "x65", "x70", "x80", "x100",
           "segregation", "segregasyon", "tmcp", "acc", "frt", "ar3",
           "落锤撕裂试验", "落重引裂試験", "fracture", "kırılma"],
    tr: { name: "DWTT Testi", desc: "Pressed notch / EB çentik, %SA hesabı, segregasyon etkisi, TMCP üretim parametreleri" },
    en: { name: "DWTT Test", desc: "Pressed notch / EB notch, %SA calculation, segregation effect, TMCP process parameters" },
    zh: { name: "DWTT测试", desc: "冲压缺口/EB缺口、%SA计算、偏析效应、TMCP工艺参数" },
    ja: { name: "DWTT試験", desc: "プレスノッチ/EBノッチ、%SA計算、偏析効果、TMCPプロセスパラメーター" },
  },
  {
    href: "/mechanical-tests/basma-testi",
    icon: "🧪",
    category: { tr: "Mekanik Test", en: "Mech. Test", zh: "力学测试", ja: "機械試験" },
    tags: ["compression", "basma", "flow stress", "akış gerilmesi", "gleeble",
           "hot compression", "sıcak basma", "recrystallization", "yeniden kristalleşme",
           "mfs", "mean flow stress", "voce", "swift", "fem", "finite element",
           "dp steel", "trip", "forming", "şekillendirme", "压缩试验", "圧縮試験"],
    tr: { name: "Basma Testi", desc: "Gleeble simülatörü, akış gerilmesi eğrisi, Tnr sıcaklığı, FEM girdi verisi" },
    en: { name: "Compression Test", desc: "Gleeble simulator, flow stress curve, Tnr temperature, FEM input data" },
    zh: { name: "压缩试验", desc: "Gleeble模拟器、流变应力曲线、Tnr温度、有限元输入数据" },
    ja: { name: "圧縮試験", desc: "Gleebleシミュレーター、流動応力曲線、Tnr温度、FEM入力データ" },
  },
  {
    href: "/mechanical-tests/katlama-egme-testi",
    icon: "🧪",
    category: { tr: "Mekanik Test", en: "Mech. Test", zh: "力学测试", ja: "機械試験" },
    tags: ["bend test", "eğme testi", "katlama", "guided bend", "kılavuzlu eğme",
           "free bend", "serbest eğme", "wrap around", "sarma", "mandrel",
           "asme ix", "iso 15614", "en iso 7438", "astm e290", "vda 238",
           "delamination", "laminasyon", "coating", "kaplama", "弯曲试验", "曲げ試験"],
    tr: { name: "Katlama / Eğme Testi", desc: "Kılavuzlu eğme, serbest eğme, sarma testi — kaynak eğme ret kriterleri, laminasyon tespiti" },
    en: { name: "Bend Test", desc: "Guided bend, free bend, wrap-around — weld bend rejection criteria, delamination detection" },
    zh: { name: "弯曲试验", desc: "导向弯曲、自由弯曲、卷绕弯曲 — 焊接弯曲拒收标准、分层检测" },
    ja: { name: "曲げ試験", desc: "ガイド曲げ、自由曲げ、巻き付け曲げ — 溶接曲げ不合格基準、デラミネーション検出" },
  },

  // ── METHODOLOGY & ABOUT ────────────────────────────────────────────────────
  {
    href: "/methodology",
    icon: "📐",
    category: { tr: "Sayfa", en: "Page", zh: "页面", ja: "ページ" },
    tags: ["methodology", "metodoloji", "validation", "doğrulama", "empirical", "ampirik",
           "formula", "formül", "production data", "üretim verisi", "reference", "referans",
           "scientific", "bilimsel", "reliability", "güvenilirlik", "方法论", "方法論"],
    tr: { name: "Bilimsel Temel ve Metodoloji", desc: "50.000+ üretim test kaydına karşı doğrulanmış formüller ve referans listesi" },
    en: { name: "Scientific Foundation & Methodology", desc: "Empirical formulas validated against 50,000+ production test records" },
    zh: { name: "科学基础与方法论", desc: "经过50,000+生产测试记录验证的经验公式和参考文献" },
    ja: { name: "科学的基盤と方法論", desc: "50,000+の生産試験記録で検証された経験式と参考文献" },
  },
  {
    href: "/about",
    icon: "👤",
    category: { tr: "Sayfa", en: "Page", zh: "页面", ja: "ページ" },
    tags: ["about", "hakkında", "metallurgist", "metalurjist", "experience", "deneyim",
           "bof", "integrated plant", "entegre tesis", "isdemir", "çelik", "steel",
           "关于", "概要", "18 years", "18 yıl", "failure analysis", "hasar analizi"],
    tr: { name: "Hakkımızda", desc: "Entegre demir çelik tesislerinde 18+ yıl deneyim — BOF üretiminden ürün testine" },
    en: { name: "About", desc: "18+ years in integrated steel plant operations — BOF steelmaking to final product testing" },
    zh: { name: "关于", desc: "在综合钢铁厂拥有18年以上经验 — 从BOF炼钢到最终产品测试" },
    ja: { name: "概要", desc: "統合製鉄所での18年以上の経験 — BOF製鋼から最終製品テストまで" },
  },
];

// ─── HIGHLIGHT HELPER ────────────────────────────────────────────────────────
function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-gold-400/30 text-gold-300 rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── CATEGORY BADGE ──────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  tr: { "Araç": "text-gold-400 bg-gold-400/10", "Bilgi Bankası": "text-blue-400 bg-blue-400/10", "Mekanik Test": "text-green-400 bg-green-400/10", "Sayfa": "text-purple-400 bg-purple-400/10" },
  en: { "Tool": "text-gold-400 bg-gold-400/10", "Knowledge": "text-blue-400 bg-blue-400/10", "Mech. Test": "text-green-400 bg-green-400/10", "Page": "text-purple-400 bg-purple-400/10" },
  zh: { "工具": "text-gold-400 bg-gold-400/10", "知识库": "text-blue-400 bg-blue-400/10", "力学测试": "text-green-400 bg-green-400/10", "页面": "text-purple-400 bg-purple-400/10" },
  ja: { "ツール": "text-gold-400 bg-gold-400/10", "ナレッジ": "text-blue-400 bg-blue-400/10", "機械試験": "text-green-400 bg-green-400/10", "ページ": "text-purple-400 bg-purple-400/10" },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SearchModal({ open, onClose }) {
  const { lang, t } = useLang();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = query.trim().length === 0
    ? SEARCH_INDEX
    : SEARCH_INDEX.filter((item) => {
        const q = query.toLowerCase();
        const loc = item[lang] || item.en;
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.desc.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.includes(q))
        );
      });

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (e.key === "Enter") {
        if (results[cursor]) {
          window.location.href = results[cursor].href;
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, cursor, results, onClose]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  // Group results by category
  const grouped = results.reduce((acc, item) => {
    const cat = item.category[lang] || item.category.en;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-16 sm:pt-24 px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Search input ── */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <span className="text-dark-300 text-lg shrink-0">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder || "Search tools, articles, tests..."}
            className="flex-1 bg-transparent text-dark-50 placeholder-dark-400 text-base outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-dark-400 hover:text-dark-100 bg-transparent border-none cursor-pointer font-sans text-sm px-1 shrink-0"
            >
              ✕
            </button>
          )}
          <kbd className="hidden sm:flex items-center px-2 py-1 rounded border border-white/10 text-dark-400 text-xs font-mono shrink-0">
            ESC
          </kbd>
        </div>

        {/* ── Results ── */}
        <div className="max-h-[480px] overflow-y-auto" ref={listRef}>
          {results.length === 0 ? (
            <div className="px-5 py-12 text-center text-dark-400 text-sm">
              <div className="text-3xl mb-3">🔍</div>
              {t.searchNoResults || "No results found"}
              <div className="text-xs mt-2 text-dark-500">&quot;{query}&quot;</div>
            </div>
          ) : (
            <div className="py-2">
              {query.trim() === "" ? (
                // Grouped view when no query
                Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <div className="px-5 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-dark-400 border-b border-white/[0.04]">
                      {cat}
                    </div>
                    {items.map((item, idx) => {
                      const globalIdx = results.indexOf(item);
                      const loc = item[lang] || item.en;
                      const catLabel = item.category[lang] || item.category.en;
                      const colorClass = (CATEGORY_COLORS[lang] || CATEGORY_COLORS.en)[catLabel] || "text-dark-400 bg-white/5";
                      return (
                        <ResultRow
                          key={item.href}
                          item={item}
                          loc={loc}
                          catLabel={catLabel}
                          colorClass={colorClass}
                          active={cursor === globalIdx}
                          query={query}
                          onClose={onClose}
                          onHover={() => setCursor(globalIdx)}
                        />
                      );
                    })}
                  </div>
                ))
              ) : (
                // Flat list when searching
                results.map((item, idx) => {
                  const loc = item[lang] || item.en;
                  const catLabel = item.category[lang] || item.category.en;
                  const colorClass = (CATEGORY_COLORS[lang] || CATEGORY_COLORS.en)[catLabel] || "text-dark-400 bg-white/5";
                  return (
                    <ResultRow
                      key={item.href}
                      item={item}
                      loc={loc}
                      catLabel={catLabel}
                      colorClass={colorClass}
                      active={cursor === idx}
                      query={query}
                      onClose={onClose}
                      onHover={() => setCursor(idx)}
                    />
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-4 text-[11px] text-dark-400 flex-wrap">
          <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 font-mono text-[10px]">↑↓</kbd> {lang === "tr" ? "gezin" : lang === "zh" ? "导航" : lang === "ja" ? "移動" : "navigate"}</span>
          <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 font-mono text-[10px]">↵</kbd> {lang === "tr" ? "aç" : lang === "zh" ? "打开" : lang === "ja" ? "開く" : "open"}</span>
          <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 font-mono text-[10px]">ESC</kbd> {lang === "tr" ? "kapat" : lang === "zh" ? "关闭" : lang === "ja" ? "閉じる" : "close"}</span>
          <span className="ml-auto text-dark-500">
            {results.length} {lang === "tr" ? "sonuç" : lang === "zh" ? "结果" : lang === "ja" ? "件" : "results"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ResultRow({ item, loc, catLabel, colorClass, active, query, onClose, onHover }) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      onMouseEnter={onHover}
      className={`flex items-center gap-3 px-5 py-2.5 transition-colors no-underline group ${active ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"}`}
    >
      <span className="text-lg w-7 text-center shrink-0">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-dark-50 group-hover:text-gold-400 transition-colors leading-tight">
            {highlight(loc.name, query)}
          </span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-medium shrink-0 ${colorClass}`}>
            {catLabel}
          </span>
        </div>
        <div className="text-xs text-dark-300 mt-0.5 truncate">
          {highlight(loc.desc, query)}
        </div>
      </div>
      <span className={`text-xs shrink-0 transition-colors ${active ? "text-gold-400" : "text-dark-600 group-hover:text-dark-400"}`}>→</span>
    </Link>
  );
}
