"use client";
import { UserProfile, useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const plan = user?.publicMetadata?.plan || "starter";
  const planExpires = user?.publicMetadata?.planExpiresAt;
  const isPro = plan === "professional" && planExpires && new Date(planExpires) > new Date();

  return (
    <div style={{ background: isDark ? "#0a0a0a" : "#f1f5f9", minHeight: "100vh" }}>

      {/* TOP BAR */}
      <div style={{ background: isDark ? "#111827" : "#ffffff", borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#ca8a04,#d97706)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#0a0a0a", fontSize: 16 }}>M</div>
          <span style={{ color: isDark ? "#f1f5f9" : "#0f172a", fontWeight: 600, fontSize: 15 }}>MetallurgyTools</span>
        </Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/dashboard" style={{ color: isDark ? "#64748b" : "#6b7280", fontSize: 13, textDecoration: "none", padding: "7px 14px" }}>← Dashboard</Link>
          <button onClick={handleSignOut} style={{ background: "#450a0a", border: "1px solid #7f1d1d", color: "#f87171", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            🚪 Çıkış Yap
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* PLAN CARD */}
        <div style={{ background: isDark ? "#111827" : "#ffffff", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", borderRadius: 12, padding: "18px 24px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ color: isDark ? "#64748b" : "#6b7280", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Mevcut Plan</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ background: isPro ? "#052e16" : "#1e1b4b", color: isPro ? "#4ade80" : "#818cf8", borderRadius: 6, padding: "3px 14px", fontSize: 12, fontWeight: 700 }}>
                {isPro ? "✅ Professional" : "Starter (Ücretsiz)"}
              </span>
              {isPro && planExpires && (
                <span style={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 12 }}>Bitiş: {new Date(planExpires).toLocaleDateString("tr-TR")}</span>
              )}
            </div>
          </div>
          {!isPro && (
            <Link href="/pricing" style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              Professional'a Yükselt →
            </Link>
          )}
        </div>

        {/* CLERK USER PROFILE
            routing="path" + path="/account" → Clerk handles /account/security, /account/profile etc.
            profileSectionPrimaryButton__emailAddresses hidden → prevents adding secondary emails
        */}
        <UserProfile
          routing="path"
          path="/account"
          appearance={{
            variables: {
              colorBackground:      isDark ? "#111827" : "#ffffff",
              colorText:            isDark ? "#e2e8f0" : "#0f172a",
              colorTextSecondary:   isDark ? "#94a3b8" : "#475569",
              colorPrimary:         "#2563eb",
              colorInputBackground: isDark ? "#0f172a" : "#f8fafc",
              colorInputText:       isDark ? "#e2e8f0" : "#0f172a",
              borderRadius:         "8px",
              fontFamily:           "system-ui, sans-serif",
            },
            elements: {
              rootBox:  { width: "100%" },
              card:     { boxShadow: "none", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", borderRadius: "12px", width: "100%" },
              navbar:   { background: isDark ? "#0f172a" : "#f8fafc", borderRight: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0" },
              // Hide "Add email address" — prevents plan bypass via secondary email
              profileSectionPrimaryButton__emailAddresses:    { display: "none" },
              profileSectionPrimaryButton__connectedAccounts: { display: "none" },
              headerTitle:       { color: isDark ? "#f1f5f9" : "#0f172a" },
              headerSubtitle:    { color: isDark ? "#64748b" : "#6b7280" },
              formFieldLabel:    { color: isDark ? "#94a3b8" : "#475569" },
              formFieldInput:    { background: isDark ? "#0f172a" : "#f8fafc", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0" },
              formButtonPrimary: { background: "#2563eb" },
              dividerLine:       { background: isDark ? "#1e293b" : "#e2e8f0" },
            },
          }}
        />
      </div>
    </div>
  );
}
