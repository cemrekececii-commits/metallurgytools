"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { isSignedIn } = useUser();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 h-16 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-dark-800/90 backdrop-blur-xl border-b border-gold-400/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">
          M
        </div>
        <span className="font-semibold text-lg tracking-tight text-dark-50">
          MetallurgyTools
        </span>
      </Link>

      <div className="flex items-center gap-8 text-sm">
        {/* Free Tools Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="text-dark-100 hover:text-gold-400 transition-colors bg-transparent border-none cursor-pointer font-sans text-sm flex items-center gap-1"
          >
            Free Tools
            <span className="text-xs">{toolsOpen ? "▲" : "▼"}</span>
          </button>
          {toolsOpen && (
            <div className="absolute top-10 left-0 bg-dark-800 border border-white/10 rounded-lg shadow-xl p-2 min-w-[220px] animate-fade-in">
              <Link
                href="/tools/hardness"
                onClick={() => setToolsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/5 no-underline text-dark-50 transition-colors"
              >
                <span>🔧</span>
                <div>
                  <div className="text-sm font-medium">Hardness Converter</div>
                  <div className="text-xs text-dark-300">HRC, HV, HB, HRB</div>
                </div>
              </Link>
              <Link
                href="/tools/unit-converter"
                onClick={() => setToolsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/5 no-underline text-dark-50 transition-colors"
              >
                <span>📐</span>
                <div>
                  <div className="text-sm font-medium">Unit Converter</div>
                  <div className="text-xs text-dark-300">MPa, ksi, J, ft·lb, °C</div>
                </div>
              </Link>
            </div>
          )}
        </div>

        <a href="#pricing" className="text-dark-100 hover:text-gold-400 transition-colors no-underline">
          Pricing
        </a>
        <a href="#about" className="text-dark-100 hover:text-gold-400 transition-colors no-underline">
          About
        </a>

        {isSignedIn ? (
          <Link
            href="/dashboard"
            className="bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 no-underline rounded-md px-5 py-2 text-sm font-semibold hover:shadow-lg hover:shadow-gold-400/20 transition-all"
          >
            Dashboard
          </Link>
        ) : (
          <SignInButton mode="modal">
            <button className="bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 rounded-md px-5 py-2 text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-gold-400/20 transition-all border-none font-sans">
              Get Started
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
