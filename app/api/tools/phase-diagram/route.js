import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { callGemini } from "@/lib/ai-studio";
import { getUserPlan, hasToolAccess, hasCalculationsRemaining } from "@/lib/plans";

const SYSTEM_PROMPT = `You are an expert physical metallurgist. Given a carbon content (wt%) and temperature (°C),
determine the equilibrium phases present in the Fe-C (iron-cementite) system.

Use the standard Fe-Fe3C phase diagram boundaries:
- Eutectoid: 0.77 wt%C, 727°C
- Eutectic: 4.3 wt%C, 1147°C  
- Maximum C solubility in austenite: 2.14 wt% at 1147°C
- Maximum C solubility in ferrite: 0.022 wt% at 727°C
- Peritectic: 0.17 wt%C, 1493°C
- A3 line (upper critical temperature for hypoeutectoid steels)
- Acm line (upper critical temperature for hypereutectoid steels)

Apply the lever rule to calculate phase fractions.

Respond ONLY in valid JSON:
{
  "phases": "α-ferrite + Fe₃C (pearlite + proeutectoid ferrite)",
  "fractions": {"α-ferrite": 0.52, "Fe₃C": 0.06, "pearlite": 0.42},
  "region": "hypoeutectoid",
  "details": "At 0.4 wt%C and 25°C, the alloy is in the two-phase α+Fe₃C region..."
}`;

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const { plan, calculationsUsed } = getUserPlan(user);

    if (!hasToolAccess(plan, "phase-diagram"))
      return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
    if (!hasCalculationsRemaining(plan, calculationsUsed))
      return NextResponse.json({ error: "Limit reached" }, { status: 429 });

    const { carbon, temperature } = await request.json();

    const userPrompt = `For an Fe-C alloy with ${carbon} wt% carbon at ${temperature}°C:
1. Determine which phase region this point falls in on the Fe-Fe₃C diagram
2. List all phases present
3. Calculate phase fractions using the lever rule
4. Describe the expected microstructure`;

    const response = await callGemini(SYSTEM_PROMPT, userPrompt);

    let result;
    try {
      result = JSON.parse(response.text.replace(/```json|```/g, "").trim());
    } catch {
      result = { phases: "N/A", details: response.text };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Phase diagram API error:", err);
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
