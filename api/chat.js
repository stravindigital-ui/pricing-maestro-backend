// File: api/chat.js

import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse body safely
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { message } = body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    // Initialize OpenAI with project key
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Pricing Maestro AI — a friendly pricing strategist who helps with subscription pricing, margins, price testing, and revenue strategy."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return res.status(200).json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({
      error: "Server Error",
      detail: error.message || error.toString()
    });
  }
}
