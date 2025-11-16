import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const completion = await client.responses.create({
      model: "gpt-4.1",
      input: message,
    });

    const reply =
      completion.output[0]?.content[0]?.text || "No response generated";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
