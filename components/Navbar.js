"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        <a href="#tools" className="text-dark-100 hover:text-gold-400 transition-colors">
          Tools
        </a>
        <a href="#pricing" className="text-dark-100 hover:text-gold-400 transition-colors">
          Pricing
        </a>
        <a href="#about" className="text-dark-100 hover:text-gold-400 transition-colors">
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
