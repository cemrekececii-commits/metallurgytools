"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import SearchModal from "./SearchModal";

const LANG_OPTIONS = [
  { code: "tr", label: "TR" },
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCat, setMobileCat] = useState(null); // expanded category on mobile
  const { isSignedIn } = useUser();
  const { lang, switchLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);
  const langRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setToolsOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const currentLang = LANG_OPTIONS.find((l) => l.code === lang) || LANG_OPTIONS[0];

  const moreLinks = [
    { href: "/tools/hasar-vakalari", label: lang === "tr" ? "Hasar Vakaları" : lang === "zh" ? "失效分析" : lang === "ja" ? "破損分析" : "Failure Analysis" },
    { href: "/mechanical-tests",     label: lang === "tr" ? "Mekanik Testler" : lang === "zh" ? "力学测试" : lang === "ja" ? "機械試験" : "Mech. Tests" },
    { href: "/knowledge",            label: lang === "tr" ? "Bilgi Bankası" : lang === "zh" ? "知识库" : lang === "ja" ? "ナレッジ" : "Knowledge" },
    { href: "/methodology",          label: lang === "tr" ? "Metodoloji" : lang === "zh" ? "方法论" : lang === "ja" ? "方法論" : "Methodology" },
    { href: "/about",                label: lang === "tr" ? "Hakkında" : lang === "zh" ? "关于" : lang === "ja" ? "概要" : "About" },
    { href: "/blog",                 label: lang === "tr" ? "Blog" : "Blog" },
  ];

  // Tool categories for mobile menu
  const mobileCategories = [
    {
      key: "metallo",
      label: lang === "tr" ? "Metalografi & Mikroyapı" : lang === "zh" ? "金相学 & 微观结构" : lang === "ja" ? "金属組織学" : "Metallography & Microstructure",
      items: [
        { href: "/tools/grain-size",      icon: "🔬", name: lang === "tr" ? "Tane Boyutu" : "Grain Size",         sub: "ASTM E112" },
        { href: "/tools/phase-diagram",   icon: "📊", name: lang === "tr" ? "Fe-C Simülatör" : "Fe-C Simulator",  sub: "Fe-C, Lever Rule" },
        { href: "/tools/cct-ttt",         icon: "🌡️", name: "CCT/TTT",                                             sub: "Ms, Ae3, Bs" },
        { href: "/tools/inclusion",       icon: "🔎", name: lang === "tr" ? "İnklüzyon ID" : "Inclusion ID",       sub: "ASTM E45" },
        { href: "/tools/sem-eds",         icon: "🔬", name: "SEM-EDS",                                             sub: lang === "tr" ? "Spektrum Analizi" : "Spectrum Analysis" },
        { href: "/tools/inclusion-atlas", icon: "📖", name: lang === "tr" ? "İnklüzyon Atlası" : "Inclusion Atlas", sub: "MnS · Al₂O₃ · TiN" },
      ],
    },
    {
      key: "mech",
      label: lang === "tr" ? "Mekanik Test" : lang === "zh" ? "力学测试" : lang === "ja" ? "機械的試験" : "Mechanical Testing",
      items: [
        { href: "/tools/hardness",         icon: "🔧", name: lang === "tr" ? "Sertlik Çevirici" : "Hardness Conv.",     sub: "HRC, HV, HB" },
        { href: "/tools/dbtt",             icon: "❄️", name: lang === "tr" ? "DBTT Motoru" : "DBTT Engine",             sub: "Charpy, DWTT" },
        { href: "/tools/tensile-specimen", icon: "↕",  name: lang === "tr" ? "Çekme Numunesi L₀" : "Tensile Spec. L₀", sub: "EN ISO 6892-1, ASTM E8" },
        { href: "/tools/dwtt",             icon: "⬇",  name: lang === "tr" ? "DWTT Simülatörü" : "DWTT Simulator",     sub: "API 5L · X42–X80" },
      ],
    },
    {
      key: "weld",
      label: lang === "tr" ? "Kaynak & Korozyon" : lang === "zh" ? "焊接 & 腐蚀" : lang === "ja" ? "溶接 & 腐食" : "Welding & Corrosion",
      items: [
        { href: "/tools/carbon-equivalent", icon: "🔥", name: "CE Calc",                                                              sub: "IIW, CET, Pcm" },
        { href: "/tools/preheat",           icon: "🔥", name: lang === "tr" ? "Ön Isıtma" : "Preheat",                               sub: "EN 1011-2, AWS D1.1" },
        { href: "/tools/corrosion",         icon: "⚗️", name: lang === "tr" ? "Korozyon Hesap" : "Corrosion Calc",                   sub: "API 570 / ASME" },
        { href: "/tools/ultrasonic",        icon: "〜",  name: lang === "tr" ? "UT Simülatör" : "UT Simulator",                       sub: "Pulse-Echo · NDT" },
        { href: "/tools/unit-converter",    icon: "🔍", name: lang === "tr" ? "Birim Çevirici" : "Unit Converter",                    sub: "MPa, ksi, J, ft·lb" },
      ],
    },
  ];

  const closeMobile = () => { setMobileOpen(false); setMobileCat(null); };

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 h-16 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-dark-800/95 backdrop-blur-xl border-b border-gold-400/10"
            : "bg-dark-800/80 backdrop-blur-md border-b border-white/5"
        }`}
      >
        {/* ── LEFT: Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0" onClick={closeMobile}>
          <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">
            M
          </div>
          <span className="font-semibold text-lg tracking-tight text-dark-50">MetallurgyTools</span>
        </Link>

        {/* ── DESKTOP: nav items (hidden on mobile) ── */}
        <div className="hidden md:flex items-center gap-3 text-sm ml-4 min-w-0">

          {/* Tools Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="text-dark-100 hover:text-gold-400 transition-colors bg-transparent border-none cursor-pointer font-sans text-sm flex items-center gap-1 whitespace-nowrap"
            >
              {t.freeTools} <span className="text-xs">{toolsOpen ? "▲" : "▼"}</span>
            </button>
            {toolsOpen && (
              <div
                className="absolute top-10 right-0 bg-dark-800 border border-white/10 rounded-xl shadow-2xl p-4 animate-fade-in"
                style={{ width: "660px" }}
              >
                <div className="grid grid-cols-3 gap-x-4 gap-y-0">

                  {/* Column 1: Metallography */}
                  <div>
                    <div className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-widest mb-2 pb-1.5 border-b border-white/[0.06]">
                      {lang === "tr" ? "Metalografi & Mikroyapı" : lang === "zh" ? "金相学 & 微观结构" : lang === "ja" ? "金属組織学 & ミクロ組織" : "Metallography & Microstructure"}
                    </div>
                    {[
                      { href: "/tools/grain-size",      icon: "🔬", name: lang === "tr" ? "Tane Boyutu"       : lang === "zh" ? "晶粒度"      : lang === "ja" ? "結晶粒度"       : "Grain Size",      sub: "ASTM E112" },
                      { href: "/tools/phase-diagram",   icon: "📊", name: lang === "tr" ? "Fe-C Simülatör"   : lang === "zh" ? "Fe-C模拟器"  : lang === "ja" ? "Fe-Cシミュレーター" : "Fe-C Simulator",  sub: "Fe-C, Lever Rule" },
                      { href: "/tools/cct-ttt",         icon: "🌡️", name: "CCT/TTT",                                                                                                                       sub: "Ms, Ae3, Bs" },
                      { href: "/tools/inclusion",       icon: "🔎", name: lang === "tr" ? "İnklüzyon ID"     : lang === "zh" ? "夹杂物分类"  : lang === "ja" ? "介在物分類"      : "Inclusion ID",    sub: "ASTM E45" },
                      { href: "/tools/sem-eds",         icon: "🔬", name: "SEM-EDS",                                                                                                                       sub: lang === "tr" ? "Spektrum Analizi" : lang === "zh" ? "能谱分析" : lang === "ja" ? "スペクトル分析" : "Spectrum Analysis" },
                      { href: "/tools/inclusion-atlas", icon: "📖", name: lang === "tr" ? "İnklüzyon Atlası" : lang === "zh" ? "夹杂物图谱"  : lang === "ja" ? "介在物アトラス" : "Inclusion Atlas",  sub: "MnS · Al₂O₃ · TiN · Spinel" },
                    ].map(({ href, icon, name, sub }) => (
                      <Link key={href} href={href} onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 no-underline text-dark-50 transition-colors">
                        <span className="text-base leading-none">{icon}</span>
                        <div><div className="text-sm font-medium leading-tight">{name}</div><div className="text-[11px] text-dark-300">{sub}</div></div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 2: Mechanical + Corrosion */}
                  <div>
                    <div className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-widest mb-2 pb-1.5 border-b border-white/[0.06]">
                      {lang === "tr" ? "Mekanik Test" : lang === "zh" ? "力学测试" : lang === "ja" ? "機械的試験" : "Mechanical Testing"}
                    </div>
                    {[
                      { href: "/tools/hardness",         icon: "🔧", name: lang === "tr" ? "Sertlik Çevirici"  : lang === "zh" ? "硬度换算"    : lang === "ja" ? "硬さ換算"        : "Hardness Conv.",      sub: "HRC, HV, HB, HRB" },
                      { href: "/tools/dbtt",             icon: "❄️", name: lang === "tr" ? "DBTT Motoru"       : lang === "zh" ? "DBTT引擎"    : lang === "ja" ? "DBTTエンジン"    : "DBTT Engine",         sub: "Charpy, DWTT" },
                      { href: "/tools/tensile-specimen", icon: "↕",  name: lang === "tr" ? "Çekme Numunesi L₀" : lang === "zh" ? "拉伸试样L₀"  : lang === "ja" ? "引張試験片L₀"   : "Tensile Specimen L₀", sub: "EN ISO 6892-1, ASTM E8" },
                      { href: "/tools/dwtt",             icon: "⬇",  name: lang === "tr" ? "DWTT Simülatörü"   : lang === "zh" ? "落锤撕裂试验"  : lang === "ja" ? "落錘引裂試験"   : "DWTT Simulator",      sub: "API 5L · X42–X80" },
                    ].map(({ href, icon, name, sub }) => (
                      <Link key={href} href={href} onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 no-underline text-dark-50 transition-colors">
                        <span className="text-base leading-none">{icon}</span>
                        <div><div className="text-sm font-medium leading-tight">{name}</div><div className="text-[11px] text-dark-300">{sub}</div></div>
                      </Link>
                    ))}

                    <div className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-widest mt-4 mb-2 pb-1.5 border-b border-white/[0.06]">
                      {lang === "tr" ? "Korozyon & Muayene" : lang === "zh" ? "腐蚀 & 检测" : lang === "ja" ? "腐食 & 検査" : "Corrosion & Inspection"}
                    </div>
                    <Link href="/tools/corrosion" onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 no-underline text-dark-50 transition-colors">
                      <span className="text-base leading-none">⚗️</span>
                      <div>
                        <div className="text-sm font-medium leading-tight">
                          {lang === "tr" ? "Korozyon Hesap" : lang === "zh" ? "腐蚀计算" : lang === "ja" ? "腐食計算" : "Corrosion Calc"}
                        </div>
                        <div className="text-[11px] text-dark-300">API 570 / ASME</div>
                      </div>
                    </Link>
                    <Link href="/tools/ultrasonic" onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 no-underline text-dark-50 transition-colors">
                      <span className="text-base leading-none">〜</span>
                      <div>
                        <div className="text-sm font-medium leading-tight">
                          {lang === "tr" ? "UT Simülatör" : lang === "zh" ? "超声检测模拟器" : lang === "ja" ? "超音波探傷シミュレーター" : "UT Simulator"}
                        </div>
                        <div className="text-[11px] text-dark-300">Pulse-Echo · K1/K2 · NDT</div>
                      </div>
                    </Link>
                  </div>

                  {/* Column 3: Welding + Units */}
                  <div>
                    <div className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-widest mb-2 pb-1.5 border-b border-white/[0.06]">
                      {lang === "tr" ? "Kaynak Teknolojisi" : lang === "zh" ? "焊接技术" : lang === "ja" ? "溶接技術" : "Welding Technology"}
                    </div>
                    {[
                      { href: "/tools/carbon-equivalent", icon: "🔥", name: "CE Calc",                                                                                                 sub: "IIW, CET, Pcm" },
                      { href: "/tools/preheat",           icon: "🔥", name: lang === "tr" ? "Ön Isıtma" : lang === "zh" ? "预热" : lang === "ja" ? "予熱" : "Preheat",                 sub: "EN 1011-2, AWS D1.1" },
                    ].map(({ href, icon, name, sub }) => (
                      <Link key={href} href={href} onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 no-underline text-dark-50 transition-colors">
                        <span className="text-base leading-none">{icon}</span>
                        <div><div className="text-sm font-medium leading-tight">{name}</div><div className="text-[11px] text-dark-300">{sub}</div></div>
                      </Link>
                    ))}

                    <div className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-widest mt-4 mb-2 pb-1.5 border-b border-white/[0.06]">
                      {lang === "tr" ? "Birim & Dönüşüm" : lang === "zh" ? "单位换算" : lang === "ja" ? "単位換算" : "Units & Conversion"}
                    </div>
                    <Link href="/tools/unit-converter" onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 no-underline text-dark-50 transition-colors">
                      <span className="text-base leading-none">🔍</span>
                      <div>
                        <div className="text-sm font-medium leading-tight">
                          {lang === "tr" ? "Birim Çevirici" : lang === "zh" ? "单位换算器" : lang === "ja" ? "単位換算器" : "Unit Converter"}
                        </div>
                        <div className="text-[11px] text-dark-300">MPa, ksi, J, ft·lb</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Danışmanlık — always visible */}
          <Link
            href="/consultation"
            className="text-dark-100 hover:text-gold-400 transition-colors no-underline shrink-0 whitespace-nowrap"
          >
            {lang === "tr" ? "Danışmanlık" : lang === "zh" ? "咨询" : lang === "ja" ? "相談" : "Consultation"}
          </Link>

          {/* More ▼ dropdown — secondary links */}
          <div className="relative shrink-0" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="text-dark-100 hover:text-gold-400 transition-colors bg-transparent border-none cursor-pointer font-sans text-sm flex items-center gap-1 whitespace-nowrap"
            >
              {lang === "tr" ? "Daha Fazla" : lang === "zh" ? "更多" : lang === "ja" ? "もっと" : "More"}{" "}
              <span className="text-xs">{moreOpen ? "▲" : "▼"}</span>
            </button>
            {moreOpen && (
              <div className="absolute top-10 right-0 bg-dark-800 border border-white/10 rounded-xl shadow-2xl py-2 animate-fade-in z-50" style={{ minWidth: 200 }}>
                {moreLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2.5 text-sm text-dark-200 hover:text-dark-50 hover:bg-white/5 no-underline transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            title={t.searchLabel || "Search"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-dark-300 hover:text-gold-400 hover:border-gold-400/40 transition-all cursor-pointer font-sans text-sm shrink-0"
          >
            <span className="text-base leading-none">🔍</span>
            <kbd className="hidden lg:flex items-center px-1.5 py-0.5 rounded border border-white/10 text-dark-500 text-[10px] font-mono leading-none">⌘K</kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-dark-100 hover:text-gold-400 hover:border-gold-400/40 transition-all cursor-pointer bg-transparent font-sans text-base shrink-0"
          >
            {theme === "dark" ? "☀" : "🌙"}
          </button>

          {/* Language */}
          <div className="relative shrink-0" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/[0.05] border border-white/10 text-dark-100 hover:text-gold-400 hover:border-gold-400/40 transition-all cursor-pointer font-sans text-xs font-medium"
            >
              <span>{currentLang.label}</span>
              <span className="text-[10px] text-dark-400">{langOpen ? "▲" : "▼"}</span>
            </button>
            {langOpen && (
              <div className="absolute top-10 right-0 bg-dark-800 border border-white/10 rounded-xl shadow-2xl py-1.5 min-w-[100px] animate-fade-in z-50">
                {LANG_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => { switchLang(option.code); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors bg-transparent border-none cursor-pointer font-sans flex items-center gap-2 ${
                      lang === option.code ? "text-gold-400 bg-gold-400/10" : "text-dark-200 hover:text-dark-50 hover:bg-white/5"
                    }`}
                  >
                    {option.code === lang ? <span className="text-gold-400 text-[10px]">✓</span> : <span className="w-3" />}
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Dashboard / Sign In */}
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 no-underline rounded-md px-4 py-1.5 text-sm font-semibold hover:shadow-lg hover:shadow-gold-400/20 transition-all shrink-0 whitespace-nowrap"
            >
              {t.dashboard}
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="border border-white/15 text-dark-100 rounded-md px-4 py-1.5 text-sm font-medium cursor-pointer hover:border-gold-400/40 hover:text-gold-400 transition-all bg-transparent font-sans shrink-0 whitespace-nowrap">
                {lang === "tr" ? "Giriş Yap" : lang === "zh" ? "登录" : lang === "ja" ? "ログイン" : "Sign In"}
              </button>
            </SignInButton>
          )}
        </div>

        {/* ── MOBILE: right side controls ── */}
        <div className="flex md:hidden items-center gap-2">
          {/* Search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/10 text-dark-300 hover:text-gold-400 transition-all cursor-pointer font-sans text-base"
          >
            🔍
          </button>
          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/10 text-dark-100 hover:text-gold-400 hover:border-gold-400/40 transition-all cursor-pointer font-sans"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col md:hidden" style={{ top: "64px" }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMobile} />
          {/* Panel */}
          <div className="relative bg-dark-800 border-b border-white/10 overflow-y-auto flex-1" style={{ maxHeight: "calc(100vh - 64px)" }}>
            <div className="p-4 space-y-1">

              {/* Tool categories (accordion) */}
              <div className="mb-3">
                <p className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-widest px-2 mb-2">
                  {t.freeTools || "Free Tools"}
                </p>
                {mobileCategories.map((cat) => (
                  <div key={cat.key} className="mb-1">
                    <button
                      onClick={() => setMobileCat(mobileCat === cat.key ? null : cat.key)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-dark-100 text-sm font-medium cursor-pointer font-sans border-none transition-colors"
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] text-dark-400">{mobileCat === cat.key ? "▲" : "▼"}</span>
                    </button>
                    {mobileCat === cat.key && (
                      <div className="mt-1 ml-2 space-y-0.5 border-l border-white/[0.08] pl-3">
                        {cat.items.map(({ href, icon, name, sub }) => (
                          <Link key={href} href={href} onClick={closeMobile}
                            className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 no-underline text-dark-50 transition-colors">
                            <span className="text-base leading-none w-5 text-center">{icon}</span>
                            <div>
                              <div className="text-sm font-medium leading-tight">{name}</div>
                              <div className="text-[11px] text-dark-300">{sub}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] my-3" />

              {/* Other links */}
              <p className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-widest px-2 mb-2">
                {lang === "tr" ? "Sayfalar" : "Pages"}
              </p>
              {[
                { href: "/consultation", label: lang === "tr" ? "Danışmanlık" : "Consultation" },
                { href: "/blog",         label: "Blog" },
                { href: "/mechanical-tests", label: lang === "tr" ? "Mekanik Testler" : "Mech. Tests" },
                { href: "/knowledge",    label: lang === "tr" ? "Bilgi Bankası" : "Knowledge" },
                { href: "/methodology",  label: lang === "tr" ? "Metodoloji" : "Methodology" },
                { href: "/about",        label: lang === "tr" ? "Hakkında" : "About" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} onClick={closeMobile}
                  className="block px-3 py-2.5 rounded-lg text-sm text-dark-200 hover:text-dark-50 hover:bg-white/5 no-underline transition-colors">
                  {label}
                </Link>
              ))}

              {/* Divider */}
              <div className="h-px bg-white/[0.06] my-3" />

              {/* Theme + Language row */}
              <div className="flex items-center gap-2 px-2 pb-2">
                <button
                  onClick={toggleTheme}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-dark-100 text-sm cursor-pointer font-sans hover:border-gold-400/40 hover:text-gold-400 transition-all"
                >
                  {theme === "dark" ? "☀" : "🌙"}
                  <span className="text-xs">{theme === "dark" ? (lang === "tr" ? "Aydınlık" : "Light") : (lang === "tr" ? "Karanlık" : "Dark")}</span>
                </button>
                <div className="flex gap-1">
                  {LANG_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => switchLang(opt.code)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer font-sans border transition-all ${
                        lang === opt.code
                          ? "bg-gold-400/10 border-gold-400/40 text-gold-400"
                          : "bg-white/[0.04] border-white/10 text-dark-300 hover:text-dark-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign in / Dashboard */}
              <div className="px-2 pt-1 pb-4">
                {isSignedIn ? (
                  <Link href="/dashboard" onClick={closeMobile}
                    className="block w-full text-center bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 no-underline rounded-lg px-4 py-2.5 text-sm font-semibold">
                    {t.dashboard}
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <button
                      onClick={closeMobile}
                      className="w-full border border-white/15 text-dark-100 rounded-lg px-4 py-2.5 text-sm font-medium cursor-pointer hover:border-gold-400/40 hover:text-gold-400 transition-all bg-transparent font-sans"
                    >
                      {lang === "tr" ? "Giriş Yap" : "Sign In"}
                    </button>
                  </SignInButton>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
