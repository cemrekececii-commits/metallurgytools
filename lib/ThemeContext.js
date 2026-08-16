"use client";
// ─────────────────────────────────────────────────────────────────────────────
// Tema yönetimi — iki bağımsız eksen:
//
//   1. mode    "dark" | "light"                 → html.light sınıfı
//   2. palette "navy" | "copper" | "classic"    → html[data-palette]
//
// Renk değerleri app/globals.css içindeki değişken bloklarından gelir; burada
// yalnızca hangi bloğun aktif olduğu belirlenir. İlk boyama app/layout.js
// içindeki beforeInteractive script tarafından yapılır (FOUC önlemi), bu
// provider yalnızca React state'ini o değerle senkronlar.
//
// Geriye dönük uyumluluk: useTheme() hâlâ { theme, toggleTheme } döndürür —
// mevcut ~40 bileşen bu iki alanı kullanıyor, imza korunmuştur.
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const PALETTES = ["navy", "copper", "classic"];
export const DEFAULT_PALETTE = "navy";

export const PALETTE_LABELS = {
  navy:    { tr: "Lacivert · turuncu", en: "Navy · orange",    swatch: "#E07A28", bg: "#0c1a2e" },
  copper:  { tr: "Antrasit · bakır",   en: "Charcoal · copper", swatch: "#C4703A", bg: "#17191c" },
  classic: { tr: "Siyah · altın",      en: "Black · gold",      swatch: "#D4AF37", bg: "#0a0a0f" },
};

function applyMode(mode) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("light", mode === "light");
}

function applyPalette(palette) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-palette", palette);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [palette, setPaletteState] = useState(DEFAULT_PALETTE);

  // DOM zaten layout.js script'i tarafından boyanmış olabilir; state'i ona eşitle.
  useEffect(() => {
    const savedTheme = localStorage.getItem("mt-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      applyMode(savedTheme);
    }
    const savedPalette = localStorage.getItem("mt-palette");
    const p = PALETTES.includes(savedPalette) ? savedPalette : DEFAULT_PALETTE;
    setPaletteState(p);
    applyPalette(p);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyMode(next);
    try { localStorage.setItem("mt-theme", next); } catch {}
  };

  const setPalette = (p) => {
    if (!PALETTES.includes(p)) return;
    setPaletteState(p);
    applyPalette(p);
    try { localStorage.setItem("mt-palette", p); } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: "dark", toggleTheme: () => {}, palette: DEFAULT_PALETTE, setPalette: () => {} };
  }
  return context;
}
