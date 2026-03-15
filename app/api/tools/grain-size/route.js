import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { callGeminiWithImage } from "@/lib/ai-studio";
import { getUserPlan, hasToolAccess, hasCalculationsRemaining } from "@/lib/plans";

const SYSTEM_PROMPT = `You are an expert metallurgical grain size analyzer. 
You receive optical micrographs of steel samples and perform grain size measurement 
according to ASTM E112 standard.

For each image, you must:
1. Identify the grain boundaries visible in the micrograph
2. Estimate the ASTM grain size number (G) using the comparison method
3. Calculate the approximate average grain diameter in micrometers
4. Note the grain morphology (equiaxed, elongated, mixed)
5. Comment on grain uniformity and any abnormal grain growth

Respond ONLY in valid JSON with this structure:
{
  "grainSizeNumber": "7.5",
  "avgDiameter": "26.3",
  "morphology": "equiaxed",
  "uniformity": "uniform",
  "details": "Multi-line analysis text here...",
  "confidence": "high"
}`;

export async function POST(request) {
  try {
    // Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Plan check
    const user = await currentUser();
    const { plan, calculationsUsed } = getUserPlan(user);

    if (!hasToolAccess(plan, "grain-size")) {
      return NextResponse.json(
        { error: "Tool not available in your plan. Please upgrade." },
        { status: 403 }
      );
    }

    if (!hasCalculationsRemaining(plan, calculationsUsed)) {
      return NextResponse.json(
        { error: "Monthly calculation limit reached. Please upgrade." },
        { status: 429 }
      );
    }

    // Parse request
    const { image, mimeType, method } = await request.json();
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Call Gemini with image
    const userPrompt = `Analyze this metallographic micrograph for ferrite grain size using the ${method || "comparison"} method per ASTM E112. Provide the ASTM G number, average grain diameter, and detailed observations.`;

    const response = await callGeminiWithImage(
      SYSTEM_PROMPT,
      userPrompt,
      image,
      mimeType || "image/png"
    );

    // Parse AI response
    let result;
    try {
      const cleaned = response.text.replace(/```json|```/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      // If JSON parsing fails, return raw text
      result = {
        grainSizeNumber: "N/A",
        avgDiameter: "N/A",
        details: response.text,
        confidence: "low",
      };
    }

    // TODO: Increment calculationsUsed in Clerk metadata
    // await clerkClient.users.updateUserMetadata(userId, {
    //   publicMetadata: { calculationsUsed: calculationsUsed + 1 }
    // });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Grain size API error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
