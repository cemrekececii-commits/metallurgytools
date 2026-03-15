import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { callGemini } from "@/lib/ai-studio";
import { getUserPlan, hasToolAccess, hasCalculationsRemaining } from "@/lib/plans";

const SYSTEM_PROMPT = `You are an expert corrosion engineer specializing in carbon and low-alloy steel degradation.
Given material type, environment, temperature, pH, chloride concentration, and CO2 partial pressure,
calculate the estimated corrosion rate in mm/year.

Use established correlations:
- De Waard-Milliams model for CO2 corrosion
- NORSOK M-506 for sweet corrosion
- General weight loss correlations for atmospheric
- Consider passivity breakdown for stainless steels

Respond ONLY in valid JSON:
{
  "rate": "0.127",
  "severity": "moderate",
  "mechanism": "uniform/pitting/crevice/etc",
  "details": "Multi-line analysis...",
  "recommendations": "Mitigation suggestions..."
}`;

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const { plan, calculationsUsed } = getUserPlan(user);

    if (!hasToolAccess(plan, "corrosion"))
      return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
    if (!hasCalculationsRemaining(plan, calculationsUsed))
      return NextResponse.json({ error: "Limit reached" }, { status: 429 });

    const inputs = await request.json();

    const userPrompt = `Calculate the corrosion rate for:
- Material: ${inputs.material}
- Environment: ${inputs.environment}
- Temperature: ${inputs.temperature}°C
- pH: ${inputs.pH}
- Chloride: ${inputs.chloride} ppm
- CO2 partial pressure: ${inputs.co2Partial} bar

Provide rate in mm/year with mechanism and recommendations.`;

    const response = await callGemini(SYSTEM_PROMPT, userPrompt);

    let result;
    try {
      result = JSON.parse(response.text.replace(/```json|```/g, "").trim());
    } catch {
      result = { rate: "N/A", details: response.text };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Corrosion API error:", err);
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
