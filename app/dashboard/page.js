"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { TOOLS, getUserPlan, hasToolAccess } from "@/lib/plans";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-dark-200">Loading...</div>
      </div>
    );
  }

  const { plan, calculationsUsed } = getUserPlan(user);

  return (
    <div className="min-h-screen">
      {/* Dashboard Nav */}
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline text-dark-50"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">
            M
          </div>
          <span className="font-semibold text-lg tracking-tight">
            MetallurgyTools
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono bg-gold-400/10 text-gold-400 px-3 py-1 rounded-full border border-gold-400/20 uppercase">
            {plan}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user?.firstName || "Engineer"}
          </h1>
          <p className="text-dark-300">
            {calculationsUsed} calculations used this period
          </p>
        </div>

        {/* Trial banner */}
        {plan === "free_trial" && (
          <div className="bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-5 mb-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="font-semibold text-gold-400 text-sm">
                Free Trial Active
              </div>
              <div className="text-dark-200 text-sm mt-1">
                Upgrade to unlock all tools and unlimited calculations.
              </div>
            </div>
            <Link
              href="/pricing"
              className="bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-5 py-2 text-sm font-semibold no-underline hover:shadow-lg hover:shadow-gold-400/20 transition-all"
            >
              Upgrade Now
            </Link>
          </div>
        )}

        {/* Tools Grid */}
        <h2 className="text-xl font-semibold mb-6">Your Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => {
            const hasAccess = hasToolAccess(plan, tool.id);
            const isLive = tool.status === "live";

            return (
              <div
                key={tool.id}
                className={`relative rounded-xl p-6 border transition-all ${
                  hasAccess && isLive
                    ? "bg-white/[0.03] border-white/[0.08] hover:border-gold-400/30 hover:-translate-y-0.5 cursor-pointer"
                    : "bg-white/[0.01] border-white/[0.04] opacity-50"
                }`}
              >
                {!isLive && (
                  <div className="absolute top-4 right-4 bg-white/10 text-dark-300 text-[10px] font-mono px-2 py-0.5 rounded">
                    COMING SOON
                  </div>
                )}
                {isLive && !hasAccess && (
                  <div className="absolute top-4 right-4 bg-gold-400/20 text-gold-400 text-[10px] font-mono px-2 py-0.5 rounded">
                    UPGRADE
                  </div>
                )}

                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3 className="text-base font-semibold mb-2">{tool.name}</h3>
                <p className="text-dark-300 text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>

                {hasAccess && isLive ? (
                  <Link
                    href={tool.route}
                    className="inline-flex items-center gap-1.5 text-gold-400 text-sm font-medium no-underline hover:gap-2.5 transition-all"
                  >
                    Open Tool →
                  </Link>
                ) : (
                  <span className="text-dark-300 text-sm">
                    {isLive ? "Requires upgrade" : "In development"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
