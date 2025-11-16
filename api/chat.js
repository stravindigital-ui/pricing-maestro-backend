import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // --- REQUIRED CORS HEADERS ---
  res.setHeader("Access-Control-Allow-Origin", "https://stravindigital.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const completion = await client.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content:
            "You are Bradley’s Pricing Strategy Bot — a virtual pricing advisor specializing in subscription pricing, revenue optimization, A/B testing, packaging strategy, price psychology, competitor analysis, and enterprise quoting. You speak clearly, confidently, and provide actionable pricing insights. Always be friendly, expert, and results-focused."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    const reply =
      completion.output[0]?.content[0]?.text || "No response generated.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
