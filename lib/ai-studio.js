// ============================================
// Google AI Studio API Client
// ============================================
// This wraps your Google AI Studio (Gemini) API calls.
// Each tool sends a specific prompt to the AI and parses the response.

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Send a prompt to Google AI Studio (Gemini)
 * @param {string} systemPrompt - Tool-specific system instructions
 * @param {string} userPrompt - User's input/query
 * @param {object} options - Additional options (temperature, etc.)
 * @returns {object} - Parsed response
 */
export async function callGemini(systemPrompt, userPrompt, options = {}) {
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${GOOGLE_AI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: options.temperature || 0.2,
        maxOutputTokens: options.maxTokens || 2048,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} — ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return { text, raw: data };
}

/**
 * Send an image + prompt to Gemini (for grain size analysis)
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {string} base64Image - Base64 encoded image data
 * @param {string} mimeType - e.g. "image/png"
 */
export async function callGeminiWithImage(
  systemPrompt,
  userPrompt,
  base64Image,
  mimeType = "image/png"
) {
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${GOOGLE_AI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          parts: [
            { text: userPrompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini Vision API error: ${response.status} — ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return { text, raw: data };
}
