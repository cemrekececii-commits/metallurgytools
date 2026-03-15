// ============================================
// Subscription Plans & Tool Access Control
// ============================================

export const PLANS = {
  free_trial: {
    id: "free_trial",
    name: "Free Trial",
    price: 0,
    duration: 7, // days
    maxCalculations: 20,
    tools: ["grain-size", "corrosion", "phase-diagram"],
    exports: ["csv"],
    apiAccess: false,
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 5, // USD/month
    maxCalculations: 50,
    tools: ["grain-size", "corrosion"], // 2 tools only
    exports: ["csv"],
    apiAccess: false,
  },
  professional: {
    id: "professional",
    name: "Professional",
    price: 9,
    maxCalculations: Infinity,
    tools: ["grain-size", "corrosion", "phase-diagram", "dbtt", "inclusion"],
    exports: ["csv", "pdf", "docx"],
    apiAccess: true,
    apiCallsPerDay: 100,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: null, // custom
    maxCalculations: Infinity,
    tools: "all",
    exports: ["csv", "pdf", "docx", "api"],
    apiAccess: true,
    apiCallsPerDay: Infinity,
  },
};

export const TOOLS = [
  {
    id: "grain-size",
    name: "Ferrite Grain Size Analyzer",
    shortName: "Grain Size",
    description:
      "ASTM E112 compliant automated grain size measurement from optical micrographs.",
    icon: "🔬",
    tags: ["ASTM E112", "Metallography", "AI-Powered"],
    status: "live",
    route: "/tools/grain-size",
  },
  {
    id: "corrosion",
    name: "Corrosion Rate Calculator",
    shortName: "Corrosion Calc",
    description:
      "Multi-environment corrosion rate estimation for carbon and low-alloy steels.",
    icon: "⚗️",
    tags: ["API 570", "Weight Loss", "Electrochemical"],
    status: "live",
    route: "/tools/corrosion",
  },
  {
    id: "phase-diagram",
    name: "Fe-C Phase Diagram Simulator",
    shortName: "Fe-C Simulator",
    description:
      "Interactive iron-cementite equilibrium phase diagram with lever rule calculations.",
    icon: "📊",
    tags: ["Thermodynamics", "Phase Fractions", "Interactive"],
    status: "live",
    route: "/tools/phase-diagram",
  },
  {
    id: "dbtt",
    name: "DBTT Prediction Engine",
    shortName: "DBTT Engine",
    description:
      "Ductile-to-brittle transition temperature prediction from composition and process parameters.",
    icon: "❄️",
    tags: ["Charpy", "S355", "API 5L"],
    status: "coming",
    route: "/tools/dbtt",
  },
  {
    id: "inclusion",
    name: "Inclusion Classifier",
    shortName: "Inclusion ID",
    description:
      "SEM-EDS based inclusion identification and classification.",
    icon: "🔎",
    tags: ["SEM-EDS", "ASTM E45", "AI"],
    status: "coming",
    route: "/tools/inclusion",
  },
];

/**
 * Check if a user's plan grants access to a specific tool
 */
export function hasToolAccess(userPlan, toolId) {
  const plan = PLANS[userPlan];
  if (!plan) return false;
  if (plan.tools === "all") return true;
  return plan.tools.includes(toolId);
}

/**
 * Check if user has remaining calculations
 */
export function hasCalculationsRemaining(userPlan, usedCount) {
  const plan = PLANS[userPlan];
  if (!plan) return false;
  return usedCount < plan.maxCalculations;
}

/**
 * Get user's subscription status from Clerk metadata
 * In production, this reads from Clerk user metadata where
 * iyzico webhook updates the subscription status
 */
export function getUserPlan(user) {
  const meta = user?.publicMetadata || {};
  return {
    plan: meta.plan || "free_trial",
    trialStartDate: meta.trialStartDate || null,
    subscriptionId: meta.subscriptionId || null,
    calculationsUsed: meta.calculationsUsed || 0,
  };
}
