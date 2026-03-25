// Fe-C Phase Diagram utility functions and constants

export const CRITICAL = {
  a1: 727, eutectoidC: 0.76, maxGammaC: 2.14,
  eutecticT: 1147, eutecticC: 4.3, periT: 1495, meltT: 1538,
  H: 0.09, B: 0.53, J: 0.17
};

export function determineSteelType(carbon) {
  if (carbon < 0.008) return "Hypoeutectoid";
  if (Math.abs(carbon - CRITICAL.eutectoidC) < 0.02) return "Eutectoid";
  if (carbon < CRITICAL.eutectoidC) return "Hypoeutectoid";
  if (carbon < 2.14) return "Hypereutectoid";
  return "Cast Iron";
}

export function interpolateY(x, p1, p2) {
  if (Math.abs(p2[0] - p1[0]) < 0.001) return p1[1];
  return p1[1] + ((x - p1[0]) / (p2[0] - p1[0])) * (p2[1] - p1[1]);
}

export function interpolateX(y, p1, p2) {
  if (Math.abs(p2[1] - p1[1]) < 0.001) return p1[0];
  return p1[0] + ((y - p1[1]) / (p2[1] - p1[1])) * (p2[0] - p1[0]);
}

export function getPhaseLines() {
  const { a1, eutectoidC: eC, maxGammaC: mC, eutecticT: eT, eutecticC: eCc, periT: pT, meltT: mT, H, B, J } = CRITICAL;
  return [
    { name: "Liquidus", points: [[0,mT],[B,pT],[eCc,eT],[6.67,1350]], color: "#f59e0b", w: 3 },
    { name: "Delta Solidus", points: [[0,mT],[H,pT]], color: "#b45309", w: 2 },
    { name: "Peritectic", points: [[H,pT],[B,pT]], color: "#7c3aed", w: 2, dash: "4,2" },
    { name: "Delta Solvus", points: [[0,1394],[H,pT]], color: "#a8a29e", w: 1.5 },
    { name: "γ Start", points: [[0,1394],[J,pT]], color: "#a8a29e", w: 1.5 },
    { name: "γ Solidus", points: [[J,pT],[mC,eT]], color: "#b45309", w: 3 },
    { name: "Eutectic", points: [[mC,eT],[6.67,eT]], color: "#f59e0b", w: 2, dash: "4,2" },
    { name: "Acm", points: [[mC,eT],[eC,a1]], color: "#8b5cf6", w: 3 },
    { name: "A3", points: [[0,912],[eC,a1]], color: "#10b981", w: 3 },
    { name: "A1", points: [[0.02,a1],[6.67,a1]], color: "#ef4444", w: 3, dash: "8,4" },
    { name: "Fe₃C", points: [[6.67,1350],[6.67,0]], color: "#1e293b", w: 2 },
    { name: "α Solvus", points: [[0.02,a1],[0.008,0]], color: "#cbd5e1", w: 1.5 },
  ];
}

export function getPhaseRegions() {
  const { a1, eutectoidC: eC, maxGammaC: mC, eutecticT: eT, eutecticC: eCc, periT: pT, meltT: mT, H, B, J } = CRITICAL;
  return [
    { id: "liquid", name: "Liquid (L)", color: "#0ea5e9", pts: [[0,mT],[B,pT],[eCc,eT],[6.67,1350],[6.67,1600],[0,1600]] },
    { id: "delta", name: "δ-Ferrite", color: "#fca5a5", pts: [[0,mT],[H,pT],[0,1394]] },
    { id: "l_delta", name: "L + δ", color: "#e2e8f0", pts: [[0,mT],[B,pT],[H,pT]] },
    { id: "d_gamma", name: "δ + γ", color: "#c4b5fd", pts: [[0,1394],[H,pT],[J,pT]] },
    { id: "austenite", name: "Austenite (γ)", color: "#fb923c", pts: [[0,912],[0,1394],[J,pT],[mC,eT],[eC,a1]] },
    { id: "ferrite", name: "Ferrite (α)", color: "#4ade80", pts: [[0,912],[0.02,a1],[0.008,0],[0,0]] },
    { id: "l_gamma", name: "L + γ", color: "#94a3b8", pts: [[J,pT],[B,pT],[eCc,eT],[mC,eT]] },
    { id: "l_fe3c", name: "L + Fe₃C", color: "#64748b", pts: [[eCc,eT],[6.67,1350],[6.67,eT]] },
    { id: "g_fe3c", name: "γ + Fe₃C", color: "#c084fc", pts: [[mC,eT],[6.67,eT],[6.67,a1],[eC,a1]] },
    { id: "a_gamma", name: "α + γ", color: "#67e8f9", pts: [[0,912],[eC,a1],[0.02,a1]] },
    { id: "hypo", name: "Proeutectoid α + Pearlite", color: "#f87171", pts: [[0.008,0],[0.02,a1],[eC,a1],[eC,0]] },
    { id: "hyper", name: "Pearlite + Proeutectoid Fe₃C", color: "#fb7185", pts: [[eC,0],[eC,a1],[mC,a1],[mC,0]] },
    { id: "cast", name: "Transformed Ledeburite", color: "#cbd5e1", pts: [[mC,0],[mC,a1],[6.67,a1],[6.67,0]] },
  ];
}

export function identifyPhaseRegion(carbon, temp) {
  const { a1, eutectoidC, maxGammaC, eutecticT, eutecticC, periT, meltT, H, B, J } = CRITICAL;
  
  // Liquidus temperature at this carbon
  let liquidusT = meltT;
  const liqPts = [[0,meltT],[B,periT],[eutecticC,eutecticT],[6.67,1350]];
  for (let i = 0; i < liqPts.length - 1; i++) {
    if (carbon >= liqPts[i][0] && carbon <= liqPts[i+1][0]) {
      liquidusT = interpolateY(carbon, liqPts[i], liqPts[i+1]);
      break;
    }
  }

  if (temp > liquidusT) return { region: "Liquid (L)", desc: "Homogeneous liquid solution of iron and carbon." };
  
  // A3 temperature
  const a3T = interpolateY(carbon, [0, 912], [eutectoidC, a1]);
  // Acm temperature
  const acmT = interpolateY(carbon, [maxGammaC, eutecticT], [eutectoidC, a1]);

  if (temp > a1 && temp <= liquidusT) {
    if (carbon <= eutectoidC && temp <= a3T) return { region: "α + γ", desc: "Intercritical region: Ferrite and Austenite coexist." };
    if (carbon > eutectoidC && carbon <= maxGammaC && temp <= acmT) return { region: "γ + Fe₃C", desc: "Austenite and secondary Cementite." };
    return { region: "Austenite (γ)", desc: "FCC structure. High carbon solubility. All heat treatments start here." };
  }

  if (temp <= a1) {
    if (carbon <= eutectoidC) {
      const pctFerrite = Math.round(((eutectoidC - carbon) / eutectoidC) * 100);
      return { region: "Proeutectoid α + Pearlite", desc: `${pctFerrite}% proeutectoid ferrite, ${100 - pctFerrite}% pearlite (lever rule at A1).` };
    }
    if (carbon <= maxGammaC) {
      const pctPearlite = Math.round(((6.67 - carbon) / (6.67 - eutectoidC)) * 100);
      return { region: "Pearlite + Proeutectoid Fe₃C", desc: `${pctPearlite}% pearlite, ${100 - pctPearlite}% proeutectoid cementite.` };
    }
    return { region: "Transformed Ledeburite", desc: "Pearlite + Cementite matrix. White cast iron (metastable Fe-Fe₃C)." };
  }

  return { region: "—", desc: "" };
}

export function calculateLeverRule(carbon, temp) {
  const { a1, eutectoidC, maxGammaC } = CRITICAL;
  if (temp > a1 || carbon > maxGammaC) return null;

  if (carbon <= eutectoidC) {
    const alphaC = 0.02; // approximate
    const pctAlpha = ((eutectoidC - carbon) / (eutectoidC - alphaC)) * 100;
    return {
      phase1: { name: "Proeutectoid Ferrite (α)", pct: Math.min(100, Math.max(0, pctAlpha)).toFixed(1), carbon: alphaC.toFixed(3) },
      phase2: { name: "Pearlite (α + Fe₃C)", pct: Math.min(100, Math.max(0, 100 - pctAlpha)).toFixed(1), carbon: eutectoidC.toFixed(3) },
    };
  } else {
    const pctPearlite = ((6.67 - carbon) / (6.67 - eutectoidC)) * 100;
    return {
      phase1: { name: "Pearlite (α + Fe₃C)", pct: Math.min(100, Math.max(0, pctPearlite)).toFixed(1), carbon: eutectoidC.toFixed(3) },
      phase2: { name: "Proeutectoid Fe₃C", pct: Math.min(100, Math.max(0, 100 - pctPearlite)).toFixed(1), carbon: "6.67" },
    };
  }
}

// Total equilibrium phase fractions
export function calculateTotalPhases(carbon) {
  const cMax = 6.67;
  return {
    ferrite: Math.max(0, ((cMax - carbon) / cMax) * 100),
    cementite: Math.max(0, (carbon / cMax) * 100),
  };
}
