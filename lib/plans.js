export const PLANS = {
  free_trial: {
    id: "free_trial",
    name: "Free Trial",
    price: 0,
    duration: 7,
    maxCalculations: 20,
    tools: ["grain-size", "corrosion", "phase-diagram", "hardness", "unit-converter", "sem-eds"],
    exports: ["csv"],
    apiAccess: false,
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 5,
    maxCalculations: 50,
    tools: ["grain-size", "corrosion", "hardness", "unit-converter", "sem-eds"],
    exports: ["csv"],
    apiAccess: false,
  },
  professional: {
    id: "professional",
    name: "Professional",
    price: 9,
    maxCalculations: Infinity,
    tools: ["grain-size", "corrosion", "phase-diagram", "hardness", "unit-converter", "sem-eds", "dbtt", "inclusion"],
    exports: ["csv", "pdf", "docx"],
    apiAccess: true,
    apiCallsPerDay: 100,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: null,
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
    description: "ASTM E112 compliant automated grain size measurement from optical micrographs.",
    icon: "\ud83d\udd2c",
    tags: ["ASTM E112", "Metallography", "AI-Powered"],
    status: "live",
    route: "/tools/grain-size",
  },
  {
    id: "corrosion",
    name: "Corrosion Rate Calculator",
    shortName: "Corrosion Calc",
    description: "API 570 / ASME B31.3 corrosion rate and remaining life assessment for process piping.",
    icon: "\u2697\ufe0f",
    tags: ["API 570", "ASME B31.3", "Remaining Life"],
    status: "live",
    route: "/tools/corrosion",
  },
  {
    id: "phase-diagram",
    name: "Fe-C Phase Diagram Simulator",
    shortName: "Fe-C Simulator",
    description: "Interactive iron-cementite equilibrium phase diagram with lever rule calculations.",
    icon: "\ud83d\udcca",
    tags: ["Thermodynamics", "Phase Fractions", "Interactive"],
    status: "live",
    route: "/tools/phase-diagram",
  },
  {
    id: "hardness",
    name: "Hardness Converter",
    shortName: "Hardness Conv.",
    description: "ASTM E140 compliant hardness scale conversion. HRC, HRB, HV, HB and approximate tensile strength.",
    icon: "\ud83d\udd27",
    tags: ["ASTM E140", "HRC", "HV", "Brinell"],
    status: "live",
    route: "/tools/hardness",
  },
  {
    id: "unit-converter",
    name: "Engineering Unit Converter",
    shortName: "Unit Converter",
    description: "Unit conversion for metallurgical engineering. Stress, force, energy, temperature.",
    icon: "\ud83d\udcd0",
    tags: ["MPa-ksi", "J-ft\u00b7lb", "\u00b0C-\u00b0F"],
    status: "live",
    route: "/tools/unit-converter",
  },
  {
    id: "sem-eds",
    name: "SEM-EDS Analysis Assistant",
    shortName: "SEM-EDS",
    description: "SEM-EDS spectrum peak overlap analysis and metallurgical interpretation with AI.",
    icon: "\ud83d\udd2c",
    tags: ["SEM-EDS", "Peak Overlap", "AI-Powered"],
    status: "live",
    route: "/tools/sem-eds",
  },
  {
    id: "dbtt",
    name: "DBTT Prediction Engine",
    shortName: "DBTT Engine",
    description: "Ductile-to-brittle transition temperature prediction from composition and process parameters.",
    icon: "\u2744\ufe0f",
    tags: ["Charpy", "S355", "API 5L"],
    status: "coming",
    route: "/tools/dbtt",
  },
  {
    id: "inclusion",
    name: "Inclusion Classifier",
    shortName: "Inclusion ID",
    description: "SEM-EDS based inclusion identification and classification.",
    icon: "\ud83d\udd0e",
    tags: ["SEM-EDS", "ASTM E45", "AI"],
    status: "coming",
    route: "/tools/inclusion",
  },
];

export function hasToolAccess(userPlan, toolId) {
  const plan = PLANS[userPlan];
  if (!plan) return false;
  if (plan.tools === "all") return true;
  return plan.tools.includes(toolId);
}

export function hasCalculationsRemaining(userPlan, usedCount) {
  const plan = PLANS[userPlan];
  if (!plan) return false;
  return usedCount < plan.maxCalculations;
}

export function getUserPlan(user) {
  const meta = user?.publicMetadata || {};
  return {
    plan: meta.plan || "free_trial",
    trialStartDate: meta.trialStartDate || null,
    subscriptionId: meta.subscriptionId || null,
    calculationsUsed: meta.calculationsUsed || 0,
  };
}
```
