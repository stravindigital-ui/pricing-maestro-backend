const OpenAI = require("openai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    console.log("Message received:", message);
    console.log("API KEY loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Pricing Maestro AI — a friendly pricing strategist who helps with subscription pricing, margins, price testing, and revenue strategy.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    res.status(500).json({
      error: "Server crashed",
      details: err.message,
    });
  }
};
